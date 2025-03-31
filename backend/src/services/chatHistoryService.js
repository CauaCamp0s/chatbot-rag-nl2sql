// import prisma from "../config/database.js";

// export async function getChatHistory(userId, limit = 10) {
//     return prisma.chatHistory.findMany({
//         where: { userId },
//         orderBy: { createdAt: 'desc' },
//         take: limit,
//         select: {
//             id: true,
//             question: true,
//             response: true,
//             createdAt: true
//         }
//     });
// }