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
    console.log('--- VERIFYING MODULE 12 PHASE 2 SPECIALIZED TABLES ---');

    const tables = ['portfolio_analysis', 'skill_gap_analysis', 'ai_proposals', 'ai_recommendations'];
    for (const table of tables) {
      const [rows] = await connection.query(`SHOW TABLES LIKE '${table}'`);
      if (rows.length > 0) {
        console.log(`✅ Table "${table}" exists`);
      } else {
        console.log(`❌ Table "${table}" missing`);
      }
    }

    console.log('--- VERIFICATION COMPLETE ---');
  } catch (error) {
    console.error('Verification failed:', error);
  } finally {
    await connection.end();
  }
}

verify();
