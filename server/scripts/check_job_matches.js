import mysql from "mysql2/promise";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

const check = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || "localhost",
            user: process.env.DB_USER || "root",
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME || "skillbridge"
        });

        console.log("--- TABLES ---");
        const [tables] = await connection.query("SHOW TABLES");
        console.log(tables);

        console.log("\n--- JOB SKILLS (Sample) ---");
        const [js] = await connection.query(`
            SELECT js.*, s.name as skill_name 
            FROM job_skills js 
            JOIN skills s ON js.skill_id = s.id 
            LIMIT 5
        `);
        console.log(js);

        console.log("\n--- USER SKILLS (Sample Student) ---");
        const [us] = await connection.query(`
            SELECT us.*, s.name as skill_name 
            FROM user_skills us 
            JOIN skills s ON us.skill_id = s.id 
            JOIN users u ON us.user_id = u.id
            WHERE u.role = 'student'
            LIMIT 5
        `);
        console.log(us);

        await connection.end();
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

check();
