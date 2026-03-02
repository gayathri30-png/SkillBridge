import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

async function verify() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    console.log('--- VERIFYING MODULE 13 NOTIFICATIONS ---');

    // 1. Check table structure
    const [cols] = await connection.query("SHOW COLUMNS FROM notifications");
    const hasTargetId = cols.some(c => c.Field === 'target_id');
    console.log(hasTargetId ? "✅ target_id column present" : "❌ target_id missing");

    // 2. Count notifications
    const [counts] = await connection.query("SELECT COUNT(*) as count FROM notifications");
    console.log(`📊 Current notification count: ${counts[0].count}`);

    // 3. Check for specific types
    const [types] = await connection.query("SELECT DISTINCT type FROM notifications");
    console.log("Types found:", types.map(t => t.type).join(', '));

    console.log('--- VERIFICATION COMPLETE ---');
  } catch (error) {
    console.error('Verification failed:', error);
  } finally {
    await connection.end();
  }
}

verify();
