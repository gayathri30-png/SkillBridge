
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, './server/.env') });

async function checkDB() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'gayathri',
    database: process.env.DB_NAME || 'skillbridge'
  });

  try {
    console.log("Connected to DB successfully.");
    
    console.log("\n--- Checking users table ---");
    const [userCols] = await connection.query("SHOW COLUMNS FROM users");
    console.table(userCols.map(c => ({ Field: c.Field, Type: c.Type })));
    
    console.log("\n--- Checking jobs table ---");
    const [jobCols] = await connection.query("SHOW COLUMNS FROM jobs");
    console.table(jobCols.map(c => ({ Field: c.Field, Type: c.Type })));

    console.log("\n--- Checking for potential nulls in recent users ---");
    const [users] = await connection.query("SELECT id, name, bio FROM users LIMIT 5");
    console.table(users);

    console.log("\n--- Checking for recent jobs ---");
    const [jobs] = await connection.query("SELECT id, title, company_name FROM jobs LIMIT 5");
    console.table(jobs);

  } catch (err) {
    console.error("DB Error:", err);
  } finally {
    await connection.end();
  }
}

checkDB();
