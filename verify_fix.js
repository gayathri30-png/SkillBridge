
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, './server/.env') });

async function checkFix() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'gayathri',
    database: process.env.DB_NAME || 'skillbridge'
  });

  try {
    console.log("Checking Joined Query (Fixed Logic)...");
    const [results] = await connection.query(`
      SELECT j.id, j.title, u.name as company_name 
      FROM jobs j 
      JOIN users u ON j.posted_by = u.id 
      LIMIT 3
    `);
    
    if (results.length > 0) {
      console.log("✅ Joined query successful!");
      console.table(results);
    } else {
      console.log("⚠️ No jobs found, but query structure is valid.");
    }

    console.log("\nChecking Student Data...");
    const [students] = await connection.query("SELECT id, name, bio FROM users WHERE role = 'student' LIMIT 3");
    console.table(students);

  } catch (err) {
    console.error("❌ Verification Failed:", err.message);
  } finally {
    await connection.end();
  }
}

checkFix();
