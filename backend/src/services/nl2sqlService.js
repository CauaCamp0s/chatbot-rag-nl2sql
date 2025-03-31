import { GoogleGenerativeAI } from "@google/generative-ai";
import { CHAT_MODEL_CONFIG, genAI } from "../config/gemini.js";
import { VALIDATION_PROMPT, SCHEMA_CONTEXT } from "../constants/prompts.js";
import { SQLValidator } from "../utils/sqlValidator.js";

/**
 * Converts a natural language question to a valid SQL query
 * @param {string} question - The natural language question to convert
 * @returns {Promise<string>} - The generated SQL query
 * @throws {Error} - If the question is out of scope or SQL generation fails
 */
export async function convertNLToSQL(question) {
    if (!question || typeof question !== 'string') {
        throw new Error('Invalid question: must be a non-empty string');
    }

    try {
        const model = genAI.getGenerativeModel({
            ...CHAT_MODEL_CONFIG,
            generationConfig: {
                ...CHAT_MODEL_CONFIG.generationConfig,
                temperature: 0.1,
                responseMimeType: "text/plain"
            }
        });

        // Context validation with timeout
        console.log('[VALIDATING QUESTION CONTEXT]', question);
        const validationResult = await model.generateContent({
            contents: [
                { role: "user", parts: [{ text: VALIDATION_PROMPT }] },
                { role: "user", parts: [{ text: `Pergunta: ${question}` }] }
            ]
        });
        
        const validationText = (await validationResult.response).text().trim();
        console.log('[VALIDATION RESULT]', validationText);

        if (validationText.toUpperCase() !== "VALID") {
            throw new Error('Question out of system scope');
        }

        // SQL generation with reinforced context
        console.log('[GENERATING SQL FOR QUESTION]', question);
        const sqlResult = await model.generateContent({
            contents: [
                { role: "user", parts: [{ text: SCHEMA_CONTEXT }] },
                { role: "user", parts: [{ text: `Converta para MySQL (APENAS SELECT): ${question}` }] }
            ]
        });

        let sql = (await sqlResult.response).text()
            .replace(/```sql/g, '')
            .replace(/```/g, '')
            .replace(/;/g, '')
            .trim();

        // Validation and optimization
        console.log('[VALIDATING GENERATED SQL]', sql);
        SQLValidator.validate(sql);
        
        console.log('[FINAL SQL QUERY]', sql);
        return sql;

    } catch (error) {
        console.error('[CONVERSION ERROR]', error);
        throw new Error(`Conversion error: ${error.message}`);
    }
}