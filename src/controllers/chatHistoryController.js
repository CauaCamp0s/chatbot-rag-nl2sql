// import { getChatHistory } from "../services/chatHistoryService.js";

// export async function getHistoryHandler(req, res) {
//     try {
//         const userId = req.user?.id;
//         const { limit } = req.query;
        
//         if (!userId) {
//             return res.status(401).json({
//                 error: "Não autorizado",
//                 details: "Usuário não autenticado"
//             });
//         }

//         const history = await getChatHistory(userId, parseInt(limit) || 10);
//         res.json(history);
//     } catch (error) {
//         console.error('[ERRO AO OBTER HISTÓRICO]', error);
//         res.status(500).json({
//             error: "Erro ao obter histórico",
//             details: process.env.NODE_ENV === 'development' ? error.message : null
//         });
//     }
// }