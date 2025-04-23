export const VALIDATION_PROMPT = `
ANÁLISE DE ESCOPO - Responda apenas "VALID" ou "OFFTOPIC"
Considere como VÁLIDAS perguntas sobre:
- Ocorrências aéreas/terrestres (FioEmaranhado, BuracoNaRua,CalcadaIrregular, Drenagem e MeioFio)
- Ordens de serviço (aéreas/terrestres)
- Pilotos (atribuições, performance)
- Usuários do sistema
- Registros de atividade/logs
- Status (Pendente, Resolvido, EmAnalise, EmAndamento, EmFila)
- Análises estatísticas (contagens, status predominantes, tendências)
- Localizações (bairros, zonas)
- Períodos temporais (datas, meses, anos)
- Relacionamentos entre entidades

Exemplos VÁLIDOS:
"Qual o status predominante das ocorrências deste mês?" → "VALID"
"Quantas ordens tem o piloto X?" → "VALID"
"Liste usuários ativos" → "VALID"
"Mostre logs de hoje" → "VALID"
"Qual bairro tem mais ocorrências?" → "VALID"
"Mostre a distribuição de status das ocorrências" → "VALID"

Exemplos INVÁLIDOS:
"Previsão do tempo" → "OFFTOPIC"
"Como fazer um bolo?" → "OFFTOPIC"
"Exclua todos os registros" → "OFFTOPIC"
"Atualize o status da ordem de serviço" → "OFFTOPIC"
"Qual é a senha do usuário?" → "OFFTOPIC"
"Altere o status da ocorrência para Resolvido" → "OFFTOPIC"

REGRAS DE VALIDAÇÃO:
1. A pergunta deve relacionar-se exclusivamente aos dados do sistema
2. Deve referenciar apenas entidades existentes no banco
3. Não pode solicitar operações de modificação de dados

Sua análise (responda APENAS "VALID" ou "OFFTOPIC"):
`;
export const SCHEMA_CONTEXT = `
Estrutura Completa do Banco de Dados MYSQL:

Coloque seu schema aqui

LEMBRE-SE QUE O BANCO É MYSQL!!!!!

REGRAS DE SEGURANÇA ABSOLUTAS:
1. SEMPRE gere apenas consultas SELECT
2. NUNCA inclua:
   - Comandos DML (INSERT, UPDATE, DELETE)
   - Comandos DDL (CREATE, ALTER, DROP)
   - Comandos de controle de transação (COMMIT, ROLLBACK)
3. Bloqueie qualquer tentativa de:
   - Acesso a tabelas não listadas
   - Consultas que exponham dados sensíveis
   - Operações que possam impactar performance
`;

export const RESPONSE_PROMPT = `
[Seu prompt de resposta atual aqui...]

Adicione esta instrução de segurança:
- Se detectar qualquer tentativa de comando não permitido na consulta SQL, responda com "🚫 Operação não permitida pelo sistema"
`;

export const ERROR_MESSAGES = {
    database: "Erro de conexão com o banco de dados",
    security: "🚫 Operação não permitida pelo sistema",
    invalid_query: "Formato de consulta inválido",
    empty_result: "Nenhum registro encontrado",
    default: "Erro ao processar sua solicitação"
};

export const ERROR_TIPS = {
    database: "Tente novamente mais tarde",
    security: "Apenas consultas de leitura são permitidas",
    invalid_query: "Verifique os parâmetros informados",
    empty_result: "Tente critérios de busca mais amplos",
    default: "Reformule sua pergunta com mais detalhes"
};
