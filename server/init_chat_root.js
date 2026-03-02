import { createConnection } from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const init = async () => {
    console.log("Connecting to DB with:", process.env.DB_USER, " Password length:", process.env.DB_PASSWORD?.length);
    try {
        const connection = await createConnection({
            host: process.env.DB_HOST || "localhost",
            user: process.env.DB_USER || "root",
            password: process.env.DB_PASSWORD || "", 
            database: process.env.DB_NAME || "skillbridge"
        });

        await connection.query(`
            CREATE TABLE IF NOT EXISTS messages (
                id INT AUTO_INCREMENT PRIMARY KEY,
                room_id VARCHAR(255) NOT NULL,
                sender_id INT NOT NULL,
                receiver_id INT NOT NULL,
                message TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log("✅ Messages table created.");
        process.exit(0);
    } catch (err) {
        console.error("Error:", err.message);
        process.exit(1);
    }
};

init();
