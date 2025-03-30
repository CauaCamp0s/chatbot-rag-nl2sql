import prisma from "../config/database.js";
import { CHAT_MODEL_CONFIG, genAI } from "../config/gemini.js";
import { convertNLToSQL } from "./nl2sqlService.js";
import { RESPONSE_PROMPT } from "../constants/prompts.js";

// Add BigInt serialization support
BigInt.prototype.toJSON = function() {
    return this.toString();
};

export async function processChat(question) {
    try {
        console.log(`[PROCESSANDO] "${question}"`);

        // Converter pergunta para SQL
        const sqlQuery = await convertNLToSQL(question);
        console.log('[SQL GERADO]', sqlQuery);

        // Executar consulta
        const rawResult = await prisma.$queryRawUnsafe(sqlQuery);
        
        // Convert BigInt to string before serialization
        const result = JSON.parse(JSON.stringify(rawResult, (_, v) => 
            typeof v === 'bigint' ? v.toString() : v
        ));

        // Formatar resposta
        return formatResponse(question, sqlQuery, result);

    } catch (error) {
        console.error('[ERRO]', error);
        return handleError(error);
    }
}

function formatResponse(question, sql, data) {
    const count = data[0]?.total || data[0]?.['COUNT(*)'] || data.length;
    
    let response = `📊 Resultado da Consulta\n\n`;
    response += `🔍 "${question}"\n\n`;
    response += `✅ Total encontrado: ${count}\n\n`;

    if (count > 0 && data[0]?.address) {
        response += `📍 Locais relevantes:\n`;
        response += data.slice(0, 3).map(item => 
            `- ${item.address} (${new Date(item.date_time).toLocaleDateString()})`
        ).join('\n');
    } else if (count === 0) {
        response += `💡 Não encontramos resultados. Tente:\n`;
        response += `- Ampliar o período de busca\n`;
        response += `- Verificar outros filtros\n`;
        response += `- Considerar status relacionados`;
    }

    return {
        resposta: response,
        sql: sql,
        dados: data.slice(0, 5)
    };
}

function handleError(error) {
    if (error.message.includes('fora do escopo')) {
        return {
            resposta: "🔍 Esta pergunta está fora do escopo do sistema",
            sugestao: "Pergunte sobre: ocorrências, ordens de serviço, pilotos ou usuários"
        };
    }
    
    return {
        resposta: "⚠️ Erro ao processar sua solicitação",
        detalhes: process.env.NODE_ENV === 'development' ? error.message : null
    };
}