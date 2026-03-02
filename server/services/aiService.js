import { GoogleGenAI } from '@google/genai';

const getGeminiClient = () => {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_api_key_here' || process.env.GEMINI_API_KEY === '') {
        console.warn("WARNING: GEMINI_API_KEY is not set or is invalid in .env. Falling back to simulated AI mode.");
        return null;
    }
    return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
};

/**
 * Generate a text response using Google Gemini 2.5 Flash model
 * @param {string} prompt The user's prompt or data to analyze
 * @param {string} systemInstruction Optional system instruction to guide the AI's persona
 * @returns {Promise<string|null>} The generated text or null if the API key is missing
 */
export const generateGeminiResponse = async (prompt, systemInstruction = null) => {
    const ai = getGeminiClient();
    
    // Fallback if no API key is set
    if (!ai) return null;

    try {
        const config = {
            temperature: 0.7,
        };
        
        if (systemInstruction) {
            config.systemInstruction = systemInstruction;
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: config,
        });

        return response.text;
    } catch (error) {
        console.error("Gemini AI Generation Error:", error);
        throw new Error("Failed to generate AI response.");
    }
};
