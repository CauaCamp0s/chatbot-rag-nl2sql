import { processChat } from "../services/chatService.js";

export async function chatHandler(req, res) {
    try {
        const { question } = req.body;
        if (!question || typeof question !== 'string') {
            return res.status(400).json({
                error: "Pergunta inválida",
                details: "O campo 'question' é obrigatório e deve ser uma string"
            });
        }

        const result = await processChat(question);
        res.json(result);
    } catch (error) {
        console.error('[ERRO NO CONTROLADOR]', error);
        res.status(500).json({
            error: "Erro ao processar a pergunta",
            details: process.env.NODE_ENV === 'development' ? error.message : null
        });
    }
}






// INTEGRADO AO BANCO SISTEMA EM PRODUÇÃO:

// import { processChat } from "../services/chatService.js";

// export async function chatHandler(req, res) {
//     try {
//         const { question } = req.body;
//         const userId = req.user?.id; // Assuming you have user info in req.user
        
//         if (!question || typeof question !== 'string') {
//             return res.status(400).json({
//                 error: "Pergunta inválida",
//                 details: "O campo 'question' é obrigatório e deve ser uma string"
//             });
//         }

//         if (!userId) {
//             return res.status(401).json({
//                 error: "Não autorizado",
//                 details: "Usuário não autenticado"
//             });
//         }

//         const result = await processChat(question, userId);
//         res.json(result);
//     } catch (error) {
//         console.error('[ERRO NO CONTROLADOR]', error);
//         res.status(500).json({
//             error: "Erro ao processar a pergunta",
//             details: process.env.NODE_ENV === 'development' ? error.message : null
//         });
//     }
// }