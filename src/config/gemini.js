import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const CHAT_MODEL_CONFIG = {
    model: "gemini-2.0-flash",
    generationConfig: {
        maxOutputTokens: 1500,
        temperature: 0.3,
    },
};

export { CHAT_MODEL_CONFIG, genAI };

