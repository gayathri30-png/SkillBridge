import axios from "axios";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env explicitly to handle ESM hoisting
dotenv.config({ path: path.join(__dirname, "../.env") });

/**
 * Generate a text response using Google Gemini 1.5 Flash model via REST API
 * @param {string} prompt The user's prompt
 * @returns {Promise<string|null>} 
 */
export const generateGeminiResponse = async (prompt) => {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log("DEBUG: GEMINI_API_KEY set?", !!apiKey);
    if (apiKey) console.log("DEBUG: GEMINI_API_KEY start:", apiKey.substring(0, 5));
    
    if (!apiKey || apiKey === 'your_api_key_here' || apiKey === '') {
        console.warn("WARNING: GEMINI_API_KEY is not set. Generic fallback will be used.");
        return null;
    }

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
        
        const response = await axios.post(url, {
            contents: [{
                parts: [{ text: prompt }]
            }]
        }, {
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.data && response.data.candidates && response.data.candidates[0].content.parts[0].text) {
            return response.data.candidates[0].content.parts[0].text;
        }
        
        return null;
    } catch (error) {
        console.error("Gemini API Error:", error.response ? error.response.data : error.message);
        return null; 
    }
};
