
import { GoogleGenerativeAI } from "@google/generative-ai";
import { CHAT_MODEL_CONFIG } from "../config/gemini.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const VALIDATION_PROMPT = `
Antes de converter para SQL, analise se a pergunta está relacionada aaos seguintes tópicos:
- Ocorrências aéreas,  terrestres, ordens de serviços, usuarios, pilotos e log 
- Tipos de serviços (drenagem, buracos, calçadas irregulares, fios emaranhados, meio-fio)
- Status de ocorrências(  Pendente, Resolvido, EmAnalise, EmAndamento, EmFila)
- Localizações (bairros, zonas, latitude e longitude)
- Datas ou períodos

Se a pergunta NÃO for sobre esses tópicos, responda APENAS com "OFFTOPIC"
`;
const SCHEMA_CONTEXT = `
Estrutura Completa do Banco de Dados:

1. Tabela occurrence_air (Ocorrências Aéreas):
   - Campos:
     * id: Int
     * date_time: DateTime
     * pilot_id: Int (referencia pilot.id)
     * address: String
     * zip_code: String
     * street_direction: Enum(Nordeste, Sudoeste, Sudeste, Noroeste)
     * type: Enum(BuracoNaRua, FioEmaranhado, MeioFio, CalcadaIrregular)
     * zone: Enum(Norte, Sul, Leste, Oeste, Centro, Expansao, SantaMaria)
     * quantity: Int
     * status: Enum(Pendente, Resolvido, EmAnalise, EmAndamento)
     * neighborhood: Enum(Centro, Getúlio_Vargas, Santa_Maria, etc.)
     * latitude_coordinate: Decimal
     * longitude_coordinate: Decimal
     * description: String

2. Tabela occurrence_land (Ocorrências Terrestres):
   - Campos:
     * id: Int
     * date_time: DateTime
     * pilot_id: Int (referencia pilot.id)
     * address: String
     * zip_code: String
     * street_direction: Enum(Nordeste, Sudoeste, Sudeste, Noroeste)
     * type: Enum(Drenagem, BuracoNaRua, CalcadaIrregular)
     * zone: Enum(Norte, Sul, Leste, Oeste, Centro, Expansao, SantaMaria)
     * quantity: Int
     * status: Enum(Pendente, Resolvido, EmAnalise, EmAndamento)
     * neighborhood: Enum(Centro, Getúlio_Vargas, Santa_Maria, etc.)
     * latitude_coordinate: Decimal
     * longitude_coordinate: Decimal
     * description: String

3. Tabela pilot (Pilotos):
   - Campos:
     * id: Int
     * name: String (Único)
     * occurrence_air: Relação com occurrence_air[]
     * occurrence_land: Relação com occurrence_land[]
     * service_order: Relação com service_order[]
     * route: Relação com route[]

4. Tabela service_order (Ordens de Serviço):
   - Campos:
     * id: Int
     * quantity: Int
     * status: Enum(Pendente, Resolvida, EmAnalise, EmAndamento)
     * date_time: DateTime
     * pilot_id: Int (referencia pilot.id)
     * land_occurrence_id: Int? (referencia occurrence_land.id)
     * air_occurrence_id: Int? (referencia occurrence_air.id)
     * occurrence_type: Enum(Solo, Aerea)
     * occurrence_type_land: Enum(Drenagem, BuracoNaRua, CalcadaIrregular, FioEmaranhado, MeioFio)?
     * occurrence_type_air: Enum(BuracoNaRua, CalcadaIrregular, FioEmaranhado, MeioFio)?
     * responsible_id: Int? (referencia user.id)
     * responsible_assigned_at: DateTime?
     * random_code: Int? (Único)

5. Tabela user (Usuários):
   - Campos:
     * id: Int
     * email: String (Único)
     * password: String
     * name: String
     * role: String
     * avatar: String?
     * is_active: Int (1 = Ativo, 0 = Inativo)
     * service_order: Relação com service_order[]
     * log: Relação com log[]

6. Tabela log (Registros de Atividade):
   - Campos:
     * id: Int
     * reason: String
     * occurredAt: DateTime
     * action: String
     * userId: Int? (referencia user.id)
     * ip: String
     * route: String
     * method: String

Instruções para Conversão:
1. Para consultas complexas, usar JOIN entre tabelas relacionadas
2. Exemplo de consulta com pilotos e ordens de serviço:
SELECT 
  p.name AS piloto,
  COUNT(so.id) AS total_ordens,
  so.status
FROM pilot p
LEFT JOIN service_order so ON p.id = so.pilot_id
GROUP BY p.name, so.status;

3. Para consultas com usuários responsáveis:
SELECT 
  u.name AS responsavel,
  so.date_time,
  o.address
FROM service_order so
JOIN user u ON so.responsible_id = u.id
JOIN occurrence_air o ON so.air_occurrence_id = o.id;

4. Para histórico de atividades:
SELECT 
  l.action,
  l.route,
  u.email
FROM log l
LEFT JOIN user u ON l.userId = u.id
WHERE l.occurredAt > '2024-01-01';

Instruções Adicionais de Segurança:
1. NUNCA gerar queries com:
   - CREATE
   - DROP TABLE
   - TRUNCATE TABLE
   - DELETE
   - UPDATE
2. Sempre validar os tipos de ocorrência contra as tabelas
3. Bloquear consultas que misturem tipos inválidos

`;
export async function convertNLToSQL(question) {
    try {
        // Validação de contexto
        const validationModel = genAI.getGenerativeModel(CHAT_MODEL_CONFIG);
        const validationResult = await validationModel.generateContent(
            `${VALIDATION_PROMPT}\n\nPergunta: ${question}\nResposta:`
        );

        const validationText = (await validationResult.response).text().trim();

        if (validationText === "OFFTOPIC") {
            throw new Error('Pergunta fora do escopo do sistema');
        }

        // Geração do SQL
        const model = genAI.getGenerativeModel(CHAT_MODEL_CONFIG);
        const result = await model.generateContent(
            `${SCHEMA_CONTEXT}\n\nPergunta: ${question}\n\nSQL:`
        );

        const response = await result.response;
        let sql = response.text()
            .replace(/```sql/g, '')
            .replace(/```/g, '')
            .replace(/;/g, '')
            .trim();

        // Correção de funções de data para MySQL
        sql = sql.replace(/date\('now',\s*'(-?\d+)\s+days'\)/gi,
            (match, days) => `DATE_SUB(NOW(), INTERVAL ${Math.abs(days)} DAY)`);

        // Validação de segurança reforçada
        const forbiddenCommands = ['drop', 'truncate', 'delete', 'update', 'insert'];
        const forbiddenRegex = new RegExp(
            `\\b(${forbiddenCommands.join('|')})\\b\\s+`,
            'gi'
        );

        if (forbiddenRegex.test(sql)) {
            throw new Error('Comando não permitido');
        }
        // Validação de consulta SELECT
        if (!/^\s*SELECT\s+/i.test(sql)) {
            throw new Error('Apenas consultas SELECT são permitidas');
        }

        // Validação de sintaxe MySQL
        const invalidPatterns = [
            {
                regex: /strftime|date\(/i,
                message: 'Função de data incompatível com MySQL'
            },
            {
                regex: /true|false/i,
                replace: () => '1=1',
                message: 'Valores booleanos devem ser convertidos'
            }
        ];

        invalidPatterns.forEach(pattern => {
            if (pattern.regex.test(sql)) {
                if (pattern.replace) {
                    sql = sql.replace(pattern.regex, pattern.replace);
                } else {
                    throw new Error(pattern.message);
                }
            }
        });

        console.log('[SQL Validado]', sql);
        return sql;

    } catch (error) {
        console.error('[Erro de Conversão]', error);
        throw new Error(`Erro na conversão: ${error.message}`);
    }
}