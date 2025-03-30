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