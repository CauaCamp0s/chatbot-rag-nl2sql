import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient();

// Funções auxiliares
const randomEnum = (values) => values[Math.floor(Math.random() * values.length)];
const randomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

async function main() {
    // Limpar dados existentes
    await prisma.$transaction([
        prisma.log.deleteMany(),
        prisma.route.deleteMany(),
        prisma.video.deleteMany(),
        prisma.photo_air_occcurrences.deleteMany(),
        prisma.photos_land_occurrences.deleteMany(),
        prisma.service_order.deleteMany(),
        prisma.occurrence_air.deleteMany(),
        prisma.occurrence_land.deleteMany(),
        prisma.pilot.deleteMany(),
        prisma.user.deleteMany(),
    ]);

    // Criar usuários
    const adminUser = await prisma.user.create({
        data: {
            email: 'admin@popcity.com',
            password: '$2b$10$Ej5yO8b7VxU7H6q3W6qkOe6z9yY1Z7QKj8WJc6n0d7vQ1aX3mZ9G',
            name: 'Administrador do Sistema',
            role: 'admin',
            is_active: 1
        }
    });

    const regularUser = await prisma.user.create({
        data: {
            email: 'user@popcity.com',
            password: '$2b$10$Ej5yO8b7VxU7H6q3W6qkOe6z9yY1Z7QKj8WJc6n0d7vQ1aX3mZ9G',
            name: 'Usuário Comum',
            role: 'user',
            is_active: 1
        }
    });

    // Criar pilotos
    const pilots = await Promise.all([
        'João Silva', 'Maria Oliveira', 'Carlos Souza', 'Ana Pereira'
    ].map(name => prisma.pilot.create({ data: { name } })));

    // Função para criar ocorrências aéreas
    const createAirOccurrence = async (pilotId, neighborhood, status) => {
        return prisma.occurrence_air.create({
            data: {
                date_time: randomDate(new Date(2024, 0, 1), new Date()),
                pilot_id: pilotId,
                address: `Avenida ${Math.floor(Math.random() * 1000)}, ${neighborhood}`,
                zip_code: '49000-' + Math.random().toString().slice(2, 5),
                street_direction: randomEnum(['Nordeste', 'Sudoeste', 'Sudeste', 'Noroeste']),
                type: randomEnum(['BuracoNaRua', 'FioEmaranhado', 'MeioFio', 'CalcadaIrregular']),
                zone: randomEnum(['Centro', 'Norte', 'Sul', 'Expansao']),
                quantity: Math.floor(Math.random() * 5) + 1,
                status,
                photo_start: `air_${Math.random().toString(36).substr(2, 9)}.jpg`,
                latitude_coordinate: 10.94 + (Math.random() * 0.1),
                longitude_coordinate: 37.07 + (Math.random() * 0.1),
                description: 'Ocorrência aérea registrada pelo sistema',
                neighborhood,
                width: Math.random() * 5,
                length: Math.random() * 5
            }
        });
    };

    // Função para criar ocorrências terrestres
    const createLandOccurrence = async (pilotId, neighborhood, status) => {
        return prisma.occurrence_land.create({
            data: {
                date_time: randomDate(new Date(2024, 0, 1), new Date()),
                pilot_id: pilotId,
                address: `Rua ${Math.floor(Math.random() * 1000)}, ${neighborhood}`,
                zip_code: '49000-' + Math.random().toString().slice(2, 5),
                street_direction: randomEnum(['Nordeste', 'Sudoeste', 'Sudeste', 'Noroeste']),
                type: randomEnum(['Drenagem', 'BuracoNaRua', 'CalcadaIrregular']),
                zone: randomEnum(['Centro', 'Expansao', 'SantaMaria']),
                quantity: Math.floor(Math.random() * 5) + 1,
                status,
                photo_start: `land_${Math.random().toString(36).substr(2, 9)}.jpg`,
                latitude_coordinate: 10.94 + (Math.random() * 0.1),
                longitude_coordinate: 37.07 + (Math.random() * 0.1),
                description: 'Ocorrência terrestre registrada pelo sistema',
                neighborhood
            }
        });
    };

    // Criar 20 ocorrências
    const neighborhoods = ['Centro', 'Zona_de_Expansão', 'Santa_Maria', 'Getúlio_Vargas'];
    const statuses = ['Pendente', 'Resolvido', 'EmAnalise', 'EmAndamento'];

    for (let i = 0; i < 10; i++) {
        const pilot = pilots[Math.floor(Math.random() * pilots.length)];
        const neighborhood = neighborhoods[Math.floor(Math.random() * neighborhoods.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];

        // Criar ocorrência aérea
        const airOccurrence = await createAirOccurrence(pilot.id, neighborhood, status);

        // Adicionar fotos
        await prisma.photo_air_occcurrences.createMany({
            data: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, i) => ({
                occurrence_air_id: airOccurrence.id,
                path: `air_photo_${airOccurrence.id}_${i}.jpg`
            }))
        });

        // Criar ocorrência terrestre
        const landOccurrence = await createLandOccurrence(pilot.id, neighborhood, status);

        await prisma.photos_land_occurrences.createMany({
            data: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, i) => ({
                occurrence_land_id: landOccurrence.id,
                path: `land_photo_${landOccurrence.id}_${i}.jpg`
            }))
        });

        // Criar service orders
        await prisma.service_order.create({
            data: {
                quantity: Math.floor(Math.random() * 5) + 1,
                status: randomEnum(['Pendente', 'EmAndamento', 'Resolvida']),
                date_time: new Date(),
                pilot_id: pilot.id,
                occurrence_type: randomEnum(['Solo', 'Aerea']),
                [landOccurrence.id ? 'land_occurrence_id' : 'air_occurrence_id']: landOccurrence.id || airOccurrence.id,
                responsible_id: Math.random() > 0.5 ? adminUser.id : regularUser.id
            }
        });
    }

    // Criar logs de atividade
    const actions = ['LOGIN', 'LOGOUT', 'CREATE', 'UPDATE', 'DELETE'];
    for (let i = 0; i < 50; i++) {
        await prisma.log.create({
            data: {
                reason: 'Atividade do sistema',
                occurredAt: randomDate(new Date(2024, 0, 1), new Date()),
                action: randomEnum(actions),
                userId: Math.random() > 0.5 ? adminUser.id : regularUser.id,
                ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
                route: `/${randomEnum(['ocorrencias', 'usuarios', 'relatorios'])}`,
                method: randomEnum(['GET', 'POST', 'PUT', 'DELETE'])
            }
        });
    }

    console.log('Seed completed successfully!');
}

main()
    .catch((e) => {
        console.error('Seed error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });