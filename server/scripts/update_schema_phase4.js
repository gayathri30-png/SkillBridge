import mysql from "mysql2/promise";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load .env from server root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.join(__dirname, "../.env");

dotenv.config({ path: envPath });

async function updateSchema() {
  console.log("🔄 Starting Phase 4 Schema Update...");

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "skillbridge",
  });

  try {
    // 1. Add is_verified to users table
    console.log("Checking 'users' table for 'is_verified' column...");
    const [columns] = await connection.query("SHOW COLUMNS FROM users LIKE 'is_verified'");
    
    if (columns.length === 0) {
      await connection.query(`
        ALTER TABLE users 
        ADD COLUMN is_verified BOOLEAN DEFAULT FALSE
      `);
      console.log("✅ Added 'is_verified' column to users table.");
    } else {
      console.log("ℹ️ 'is_verified' column already exists.");
    }

    // 2. Create notifications table
    console.log("Checking/Creating 'notifications' table...");
    await connection.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        type VARCHAR(50) NOT NULL, -- 'application', 'hire', 'system'
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log("✅ 'notifications' table verified/created.");

    // 3. Mark existing recruiters as verified (optional, for convenience)
    await connection.query(`
      UPDATE users SET is_verified = TRUE WHERE role = 'admin'
    `);
    // Uncomment below if you want all current recruiters verified
    // await connection.query("UPDATE users SET is_verified = TRUE WHERE role = 'recruiter'");
    
    console.log("✅ Phase 4 Schema Update Complete!");

  } catch (error) {
    console.error("❌ Schema Update Failed:", error);
  } finally {
    await connection.end();
    process.exit();
  }
}

updateSchema();
