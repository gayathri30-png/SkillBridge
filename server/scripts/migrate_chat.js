import { createConnection } from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const init = async () => {
  console.log("🔧 Connecting to DB...");
  try {
    const connection = await createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "skillbridge"
    });

    // Ensure messages table exists
    await connection.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        room_id VARCHAR(255) NOT NULL,
        sender_id INT NOT NULL,
        receiver_id INT NOT NULL,
        message TEXT NOT NULL,
        is_read TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_room_id (room_id)
      )
    `);
    console.log("✅ messages table ready.");

    // Create chat_rooms table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS chat_rooms (
        id INT AUTO_INCREMENT PRIMARY KEY,
        room_id VARCHAR(255) NOT NULL UNIQUE,
        application_id INT NOT NULL,
        student_id INT NOT NULL,
        recruiter_id INT NOT NULL,
        job_title VARCHAR(255) DEFAULT '',
        student_name VARCHAR(255) DEFAULT '',
        recruiter_name VARCHAR(255) DEFAULT '',
        last_message TEXT DEFAULT NULL,
        last_message_at TIMESTAMP NULL DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_student (student_id),
        INDEX idx_recruiter (recruiter_id),
        INDEX idx_application (application_id)
      )
    `);
    console.log("✅ chat_rooms table ready.");

    await connection.end();
    console.log("\n✅ Chat migration complete!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Migration error:", err.message);
    process.exit(1);
  }
};

init();
