export const VALIDATION_PROMPT = `
ANÁLISE DE ESCOPO - Responda apenas "VALID" ou "OFFTOPIC"

Considere como VÁLIDAS perguntas sobre:
- Ocorrências aéreas/terrestres (FioEmaranhado, BuracoNaRua, etc.)
- Ordens de serviço (aéreas/terrestres)
- Pilotos (atribuições, performance)
- Usuários do sistema
- Registros de atividade/logs
- Status (Pendente, Resolvido, EmAnalise, EmAndamento)
- Localizações (bairros, zonas)
- Períodos temporais (datas, meses)

Exemplos VÁLIDOS:
"Quantas ordens tem o piloto X?" → "VALID"
"Liste usuários ativos" → "VALID"
"Mostre logs de hoje" → "VALID"

Exemplos INVÁLIDOS:
"Previsão do tempo" → "OFFTOPIC"
"Como fazer um bolo?" → "OFFTOPIC"

Sua análise (responda APENAS "VALID" ou "OFFTOPIC"):
`;
export const SCHEMA_CONTEXT = `
Estrutura Completa do Banco de Dados MYSQL:
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model photo_air_occcurrences {
  id                Int            @id @default(autoincrement())
  occurrence_air_id Int
  path              String         @db.VarChar(255)
  occurrence_air    occurrence_air @relation(fields: [occurrence_air_id], references: [id], onDelete: Cascade, onUpdate: Cascade)

  @@index([occurrence_air_id], map: "occurrence_air_id")
}

model photos_land_occurrences {
  id                 Int             @id @default(autoincrement())
  occurrence_land_id Int
  path               String          @db.VarChar(255)
  occurrence_land    occurrence_land @relation(fields: [occurrence_land_id], references: [id], onDelete: Cascade, onUpdate: Cascade)

  @@index([occurrence_land_id], map: "occurrence_land_id")
}

model occurrence_air {
  id                     Int                             @id @default(autoincrement())
  date_time              DateTime                        @db.DateTime(0)
  date_time_completion   DateTime?                       @db.DateTime(0)
  pilot_id               Int
  address                String                          @db.Text
  zip_code               String                          @db.VarChar(20)
  street_direction       occurrence_air_street_direction
  type                   occurrence_air_type
  zone                   occurrence_air_zone
  quantity               Int
  status                 occurrence_air_status
  photo_start            String                          @db.VarChar(255)
  photo_final            String?                         @db.VarChar(255)
  latitude_coordinate    Decimal                         @db.Decimal(10, 6)
  longitude_coordinate   Decimal                         @db.Decimal(10, 6)
  description            String                          @db.Text
  is_active              Int                             @default(1) // 1 = Ativo, 0 = Inativo
  neighborhood           neighborhood
  width                  Decimal?                        @db.Decimal(10, 2)
  length                 Decimal?                        @db.Decimal(10, 2)
  pilot                  pilot                           @relation(fields: [pilot_id], references: [id], onDelete: NoAction, onUpdate: NoAction, map: "occurrence_air_ibfk_1")
  service_order          service_order[]
  videos                 video[]
  photo_air_occcurrences photo_air_occcurrences[]
  observation            String?                         @db.Text // Novo campo para observação
  photo_in_progress      photo_in_progress[]

  @@index([pilot_id], map: "pilot_id")
}

model occurrence_land {
  id                     Int                              @id @default(autoincrement())
  date_time              DateTime                         @db.DateTime(0)
  date_time_completion   DateTime?                        @db.DateTime(0)
  pilot_id               Int
  address                String                           @db.Text
  zip_code               String                           @db.VarChar(20)
  street_direction       occurrence_land_street_direction
  type                   occurrence_land_type
  zone                   occurrence_land_zone
  quantity               Int
  status                 occurrence_land_status
  photo_start            String                           @db.VarChar(255)
  photo_final            String?                          @db.VarChar(255)
  latitude_coordinate    Decimal                          @db.Decimal(10, 6)
  longitude_coordinate   Decimal                          @db.Decimal(10, 6)
  description            String                           @db.Text
  is_active              Int                              @default(1) // 1 = Ativo, 0 = Inativo
  neighborhood           neighborhood
  pilot                  pilot                            @relation(fields: [pilot_id], references: [id], onDelete: NoAction, onUpdate: NoAction, map: "occurrence_land_ibfk_1")
  service_order          service_order[]
  photo_land_occurrences photos_land_occurrences[]
  observation            String?                          @db.Text // Novo campo para observação
  photo_in_progress      photo_in_progress[]

  @@index([pilot_id], map: "pilot_id")
}

model video {
  id                Int            @id @default(autoincrement())
  url               String         @db.VarChar(255)
  occurrence_air    occurrence_air @relation(fields: [occurrence_air_id], references: [id], onDelete: Cascade, onUpdate: Cascade)
  occurrence_air_id Int
  createdAt         DateTime       @default(now()) @db.DateTime(0)
}

model pilot {
  id              Int               @id @default(autoincrement())
  name            String            @unique(map: "name") @db.VarChar(255)
  occurrence_air  occurrence_air[]
  occurrence_land occurrence_land[]
  service_order   service_order[]
  route           route[]
}

model service_order {
  id                      Int                                 @id @default(autoincrement())
  quantity                Int
  status                  service_order_status
  date_time               DateTime                            @db.DateTime(0)
  pilot_id                Int
  land_occurrence_id      Int?
  air_occurrence_id       Int?
  occurrence_type         service_order_occurrence_type
  occurrence_type_land    service_order_occurrence_type_land?
  occurrence_type_air     service_order_occurrence_type_air?
  responsible_id          Int? // Campo opcional: ID do responsável pela OS
  responsible_assigned_at DateTime? // Campo opcional: Data de atribuição do responsável
  pilot                   pilot                               @relation(fields: [pilot_id], references: [id], onDelete: NoAction, onUpdate: NoAction, map: "service_order_ibfk_1")
  occurrence_land         occurrence_land?                    @relation(fields: [land_occurrence_id], references: [id], onDelete: NoAction, onUpdate: NoAction, map: "service_order_ibfk_2")
  occurrence_air          occurrence_air?                     @relation(fields: [air_occurrence_id], references: [id], onDelete: NoAction, onUpdate: NoAction, map: "service_order_ibfk_3")
  responsible             user?                               @relation(fields: [responsible_id], references: [id], onDelete: SetNull, onUpdate: Cascade)
  random_code             Int?                                @unique

  @@index([air_occurrence_id], map: "idx_air_occurrence")
  @@index([land_occurrence_id], map: "idx_land_occurrence")
  @@index([pilot_id], map: "pilot_id")
  @@index([responsible_id], map: "idx_responsible") // Índice para o responsável
}

model user {
  id            Int             @id @default(autoincrement())
  email         String          @unique @db.VarChar(255)
  password      String          @db.VarChar(100)
  name          String          @db.VarChar(255)
  role          String          @db.VarChar(100)
  avatar        String?         @db.VarChar(255)
  is_active     Int             @default(1) // 1 = Ativo, 0 = Inativo
  otps          OTP[] // Relação com a tabela OTP
  service_order service_order[]
  log           log[]
}

model OTP {
  id        Int      @id @default(autoincrement())
  code      String // O código OTP
  email     String   @unique
  expiresAt DateTime // Data de expiração do OTP
  createdAt DateTime @default(now())

  // Relação com a tabela User (opcional, se quiser vincular ao ID do usuário)
  user user? @relation(fields: [email], references: [email])
}

model log {
  id         Int      @id @default(autoincrement())
  reason     String   @db.Text
  occurredAt DateTime @db.DateTime(0)
  action     String   @db.Text
  userId     Int? // Tornando o campo opcional
  ip         String   @db.VarChar(45)
  route      String   @db.VarChar(255) // Rota (ex: /login, /user)
  method     String   @db.VarChar(10) // Método HTTP (ex: POST, PUT, DELETE)
  user       user?    @relation(fields: [userId], references: [id], onDelete: NoAction, onUpdate: NoAction)

  @@index([userId], map: "idx_user")
}

model route {
  id        Int      @id @default(autoincrement())
  pilotId   Int
  latitude  Decimal  @db.Decimal(10, 6)
  longitude Decimal  @db.Decimal(10, 6)
  date      DateTime @db.DateTime(0)
  pilot     pilot    @relation(fields: [pilotId], references: [id], onDelete: NoAction, onUpdate: NoAction)

  @@index([pilotId], map: "idx_pilot")
}

model UserQuery {
  id        Int      @id @default(autoincrement())
  question  String   @db.Text
  sqlQuery  String   @db.Text
  result    String   @db.Text
  createdAt DateTime @default(now())
}

model photo_in_progress {
  id                 Int              @id @default(autoincrement())
  occurrence_air_id  Int? // Opcional (fotos de ocorrências aéreas)
  path               String           @db.VarChar(255)
  occurrence_air     occurrence_air?  @relation(fields: [occurrence_air_id], references: [id], onDelete: Cascade, onUpdate: Cascade)
  occurrence_land_id Int? // Opcional (fotos de ocorrências terrestres)
  occurrence_land    occurrence_land? @relation(fields: [occurrence_land_id], references: [id], onDelete: Cascade, onUpdate: Cascade)

  // Índices para ambos os campos opcionais
  @@index([occurrence_air_id], map: "occurrence_air_id")
  @@index([occurrence_land_id], map: "occurrence_land_id")
}

enum service_order_status {
  Pendente
  Resolvida
  EmAnalise
  EmAndamento
}

enum occurrence_air_street_direction {
  Nordeste
  Sudoeste
  Sudeste
  Noroeste
}

enum occurrence_land_street_direction {
  Nordeste
  Sudoeste
  Sudeste
  Noroeste
}

enum occurrence_land_type {
  Drenagem
  BuracoNaRua
  CalcadaIrregular
  FioEmaranhado
  MeioFio
}

enum occurrence_air_type {
  Drenagem
  BuracoNaRua
  CalcadaIrregular
  FioEmaranhado
  MeioFio
}

enum service_order_occurrence_type {
  Solo
  Aerea
}

enum occurrence_land_zone {
  Norte
  Sul
  Leste
  Oeste
  Centro
  Expansao
  SantaMaria
}

enum service_order_occurrence_type_land {
  Drenagem
  BuracoNaRua
  CalcadaIrregular
  FioEmaranhado
  MeioFio
}

enum occurrence_air_zone {
  Norte
  Sul
  Leste
  Oeste
  Centro
  Expansao
  SantaMaria
}

enum service_order_occurrence_type_air {
  BuracoNaRua
  CalcadaIrregular
  FioEmaranhado
  MeioFio
}

enum occurrence_air_status {
  Pendente
  Resolvido
  EmAnalise
  EmAndamento
  EmFila
}

enum occurrence_land_status {
  Pendente
  Resolvido
  EmAnalise
  EmAndamento
  EmFila
}

enum neighborhood {
  Centro
  Getúlio_Vargas
  Cirurgia
  Pereira_Lobo
  Suíssa
  Salgado_Filho
  Treze_de_Julho
  Dezoito_do_Forte
  Palestina
  Santo_Antônio
  Industrial
  Santos_Dumont
  José_Conrado_de_Araújo
  Novo_Paraíso
  América
  Siqueira_Campos
  Soledade
  Lamarão
  Cidade_Nova
  Japãozinho
  Porto_Dantas
  Bugio
  Jardim_Centenário
  Olaria
  Capucho
  Jabotiana
  Ponto_Novo
  Luzia
  Grageru
  Jardins
  Inácio_Barbosa
  São_Conrado
  Farolândia
  Coroa_do_Meio
  Aeroporto
  Atalaia
  Santa_Maria
  Zona_de_Expansão
  São_José
}


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