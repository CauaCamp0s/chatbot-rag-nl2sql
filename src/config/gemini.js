import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "AIzaSyD5-EMVGOSki07F2urAAF-BF4wqhVw0NhU");

const CHAT_MODEL_CONFIG = {
    model: "gemini-2.0-flash",
    generationConfig: {
        maxOutputTokens: 2000,  // Aumentado para queries complexas
        temperature: 0.2,      // Mais determinístico para SQL
        topP: 0.95,
        topK: 40
    },
    safetySettings: [
        {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_NONE"
        },
        {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_NONE"
        },
        {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_NONE"
        },
        {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_NONE"
        }
    ]
};

export { CHAT_MODEL_CONFIG, genAI };