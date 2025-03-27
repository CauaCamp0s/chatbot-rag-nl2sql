
import prisma from "../config/database.js";
import { CHAT_MODEL_CONFIG, genAI } from "../config/gemini.js";
import { convertNLToSQL } from "./nl2sqlService.js";

const RESPONSE_PROMPT = `Converta os resultados SQL em uma resposta natural com:
1. Total de ocorrências por tipo
2. Distribuição por status
3. Localização principal
4. Datas relevantes
5. Detalhes específicos

Exemplo de formatação:
"📊 Relatório de Ocorrências
✅ Total encontrado: {total}
✈️ Aéreas: {quantidade_aereas} ({percentual_aereas}%)
🚜 Terrestres: {quantidade_terrestres} ({percentual_terrestres}%)
📅 Período: {data_inicial} a {data_final}
📍 Principais locais: {locais}
🔄 Distribuição de status: {status}
📌 Detalhes: {detalhes}"

Dados brutos: {RESULTS}

Instruções:
- Use emojis relevantes para cada tipo de informação
- Formate datas no padrão DD/MM/AAAA
- Destaque números importantes em negrito
- Mantenha a resposta entre 5-7 linhas`;

const ERROR_MESSAGES = {
    database: "Erro de conexão com o banco de dados",
    security: "Operação não permitida pelo sistema",
    invalid_query: "Formato de consulta inválido",
    empty_result: "Nenhum registro encontrado",
    default: "Erro ao processar sua solicitação"
};

const ERROR_TIPS = {
    database: "Tente novamente mais tarde",
    security: "Apenas consultas de leitura são permitidas",
    invalid_query: "Verifique os parâmetros informados",
    empty_result: "Tente critérios de busca mais amplos",
    default: "Reformule sua pergunta com mais detalhes"
};

export async function processChat(question) {
    try {
        console.log(`\n[Nova consulta] "${question}"`);

        // Converter pergunta para SQL
        const sqlQuery = await convertNLToSQL(question);
        console.log('[SQL Validado]', sqlQuery);

        // Executar consulta
        const rawResult = await prisma.$queryRawUnsafe(sqlQuery);
        const result = JSON.parse(JSON.stringify(rawResult));

        // Tratar resultados vazios
        if (!result || result.length === 0) {
            return {
                resposta: "🔍 Nenhum registro encontrado com esses critérios",
                detalhes: "A consulta não retornou resultados"
            };
        }

        // Preparar dados para formatação
        const analysisData = {
            metadata: {
                total: result.length,
                types: analyzeTypes(result),
                status: analyzeStatus(result),
                locations: analyzeLocations(result),
                dates: analyzeDates(result)
            },
            sample: result.slice(0, 3)
        };

        // Gerar resposta natural
        const model = genAI.getGenerativeModel(CHAT_MODEL_CONFIG);
        const formatPrompt = RESPONSE_PROMPT.replace('{RESULTS}', JSON.stringify(analysisData));
        const { response } = await model.generateContent(formatPrompt);
        const naturalResponse = await response.text();

        // Registrar histórico
        await logQuery(question, sqlQuery, naturalResponse);

        return {
            resposta: naturalResponse,
            metadados: analysisData.metadata,
            dados_brutos: result.slice(0, 5)
        };

    } catch (error) {
        console.error('[Erro Processamento]', error);
        return handleError(error);
    }
}

// Métodos auxiliares
const analyzeTypes = (data) => {
    return data.reduce((acc, item) => {
        const type = item.type || item.tipo_ocorrencia;
        acc[type] = (acc[type] || 0) + 1;
        return acc;
    }, {});
};

const analyzeStatus = (data) => {
    return data.reduce((acc, item) => {
        acc[item.status] = (acc[item.status] || 0) + 1;
        return acc;
    }, {});
};

const analyzeLocations = (data) => {
    return data.reduce((acc, item) => {
        const location = item.neighborhood || item.zone;
        acc[location] = (acc[location] || 0) + 1;
        return acc;
    }, {});
};

const analyzeDates = (data) => {
    const dates = data.map(item => new Date(item.date_time));
    return {
        first: dates.reduce((a, b) => a < b ? a : b),
        last: dates.reduce((a, b) => a > b ? a : b)
    };
};

const logQuery = async (question, sql, result) => {
    if (prisma.userQuery?.create) {
        try {
            await prisma.userQuery.create({
                data: {
                    question,
                    sqlQuery: sql,
                    result: result.substring(0, 500)
                }
            });
        } catch (error) {
            console.error('Erro no histórico:', error.message);
        }
    }
};

const handleError = (error) => {
    const errorType = determineErrorType(error);
    return {
        resposta: `⚠️ ${ERROR_MESSAGES[errorType]}`,
        dica: ERROR_TIPS[errorType],
        detalhes: process.env.NODE_ENV === 'development' ? {
            message: error.message,
            stack: error.stack
        } : null
    };
};

const determineErrorType = (error) => {
    // Detecção de erros de sintaxe SQL
    if (error.message.includes('1064') || error.code === 'P2010') {
        return 'invalid_query';
    }

    // Detecção de erros de banco de dados
    if (error.message.includes('prisma') || error.message.includes('database')) {
        return 'database';
    }

    // Outros tipos de erros
    const errorPatterns = [
        { pattern: 'não permitido', type: 'security' },
        { pattern: 'inválido', type: 'invalid_query' },
        { pattern: 'Nenhum', type: 'empty_result' }
    ];

    for (const { pattern, type } of errorPatterns) {
        if (error.message.includes(pattern)) {
            return type;
        }
    }

    return 'default';
};
