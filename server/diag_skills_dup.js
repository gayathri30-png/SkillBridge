import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

async function checkDuplicates() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'skillbridge',
    });

    console.log("--- DUPLICATE SKILL NAMES IN 'skills' TABLE ---");
    const [dupSkills] = await connection.execute(
        `SELECT name, COUNT(*) as count FROM skills GROUP BY name HAVING count > 1`
    );
    console.log(JSON.stringify(dupSkills, null, 2));

    console.log("\n--- DUPLICATE SKILL ENTRIES IN 'job_skills' TABLE ---");
    const [dupJobSkills] = await connection.execute(
        `SELECT job_id, skill_id, COUNT(*) as count FROM job_skills GROUP BY job_id, skill_id HAVING count > 1`
    );
    console.log(JSON.stringify(dupJobSkills, null, 2));

    console.log("\n--- SAMPLE JOB SKILLS FOR A JOB WITH MANY SKILLS ---");
    const [sampleJob] = await connection.execute(
        `SELECT job_id, COUNT(*) as count FROM job_skills GROUP BY job_id ORDER BY count DESC LIMIT 5`
    );
    console.log(JSON.stringify(sampleJob, null, 2));

    const jobId = 7;
    console.log(`\n--- ALL SKILLS FOR JOB_ID ${jobId} ---`);
    const [allSkills] = await connection.execute(
        `SELECT s.name FROM skills s JOIN job_skills js ON s.id = js.skill_id WHERE js.job_id = ?`,
        [jobId]
    );
    console.log(allSkills.map(s => s.name).join(', '));
    console.log(`Count: ${allSkills.length}`);

    await connection.end();
}

checkDuplicates().catch(console.error);
