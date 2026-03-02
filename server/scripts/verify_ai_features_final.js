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
    console.log('--- VERIFYING MODULE 12: ADVANCED AI FEATURES ---');

    // 1. Check Table
    const [tables] = await connection.query("SHOW TABLES LIKE 'ai_insights'");
    if (tables.length > 0) {
      console.log('✅ Table "ai_insights" exists');
    } else {
      console.log('❌ Table "ai_insights" missing');
      return;
    }

    // 2. Check Structure
    const [columns] = await connection.query('DESCRIBE ai_insights');
    const cols = columns.map(c => c.Field);
    const expected = ['user_id', 'type', 'content', 'score', 'job_id'];
    expected.forEach(ex => {
      if (cols.includes(ex)) console.log(`✅ Column ${ex} found`);
      else console.log(`❌ Column ${ex} missing`);
    });

    console.log('--- VERIFICATION COMPLETE ---');
  } catch (error) {
    console.error('Verification failed:', error);
  } finally {
    await connection.end();
  }
}

verify();
