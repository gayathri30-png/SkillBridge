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
    console.log('--- VERIFYING MODULE 10: HIRING WORKFLOW ---');

    // 1. Check if 'hired' is in enum
    const [columns] = await connection.query('DESCRIBE applications');
    const statusCol = columns.find(c => c.Field === 'status');
    console.log('Status Column Type:', statusCol.Type);
    if (statusCol.Type.includes("'hired'")) {
      console.log('✅ "hired" status exists in enum');
    } else {
      console.log('❌ "hired" status missing from enum');
    }

    // 2. Check for hiring columns
    const hiringCols = ['salary', 'start_date', 'offer_letter', 'is_offer_accepted'];
    for (const col of hiringCols) {
      if (columns.some(c => c.Field === col)) {
        console.log(`✅ Column ${col} exists`);
      } else {
        console.log(`❌ Column ${col} missing`);
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
