import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const port = process.env.PORT || 5001;
const baseUrl = `http://localhost:${port}/api/ai`;

// We need a token. I'll try to find a user or use a hardcoded student ID if I can bypass auth for testing.
// Since I can't easily get a JWT, I'll just call the controller functions directly in a node script by mocking the req/res.

import db from './config/db.js';
import { calculateMatchScore, getSkillGapPathways } from './controllers/aiController.js';

async function testControllers() {
    // Mock user for studentId 1
    const req = {
        user: { id: 1000 },
        params: { jobId: 7 },
        query: { jobId: 7 }
    };

    const res = {
        json: (data) => {
            console.log("\n--- RESPONSE DATA ---");
            console.log(JSON.stringify(data, null, 2));
        },
        status: (code) => ({
            json: (data) => {
                console.log(`\n--- ERROR RESPONSE (${code}) ---`);
                console.log(JSON.stringify(data, null, 2));
            }
        })
    };

    console.log("Testing calculateMatchScore(jobId=1)...");
    await calculateMatchScore(req, res);

    console.log("\nTesting getSkillGapPathways(jobId=1)...");
    await getSkillGapPathways(req, res);

    await db.end();
}

testControllers().catch(console.error);
