import { processChat } from "../services/chatService.js";

export async function chatHandler(req, res) {
    try {
        const { question } = req.body;
        const response = await processChat(question);
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
