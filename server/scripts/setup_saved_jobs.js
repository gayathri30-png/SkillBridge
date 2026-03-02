import mysql from "mysql2/promise";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

const setup = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || "localhost",
            user: process.env.DB_USER || "root",
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME || "skillbridge"
        });

        console.log("Creating saved_jobs table...");
        await connection.query(`
            CREATE TABLE IF NOT EXISTS saved_jobs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                job_id INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
                UNIQUE KEY unique_save (user_id, job_id)
            )
        `);
        console.log("✅ Table created or already exists.");

        await connection.end();
        process.exit(0);
    } catch (e) {
        console.error("❌ Setup failed:", e);
        process.exit(1);
    }
};

setup();
