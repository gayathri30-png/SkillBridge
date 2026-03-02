import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

async function migrate() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  console.log('Migrating applications table for hiring workflow...');

  try {
    // 1. Add 'hired' to status enum (Note: MySQL requires re-defining the set if using ENUM, or we can just ensure it accepts it)
    await connection.query(`
      ALTER TABLE applications 
      MODIFY COLUMN status ENUM('pending', 'accepted', 'rejected', 'hired') DEFAULT 'pending'
    `);
    console.log('✅ Added "hired" to applications status enum');

    // 2. Add hiring columns
    const columns = [
      ['hired_at', 'TIMESTAMP NULL'],
      ['start_date', 'DATE NULL'],
      ['salary', 'VARCHAR(255) NULL'],
      ['contract_type', "ENUM('Full-time', 'Part-time', 'Contract', 'Internship') DEFAULT 'Full-time'"],
      ['offer_letter', 'TEXT NULL'],
      ['additional_notes', 'TEXT NULL'],
      ['is_offer_accepted', 'BOOLEAN DEFAULT FALSE'],
      ['is_offer_declined', 'BOOLEAN DEFAULT FALSE'],
      ['offer_accepted_at', 'TIMESTAMP NULL'],
      ['offer_declined_at', 'TIMESTAMP NULL']
    ];

    for (const [name, type] of columns) {
      try {
        await connection.query(`ALTER TABLE applications ADD COLUMN ${name} ${type}`);
        console.log(`✅ Added column: ${name}`);
      } catch (err) {
        if (err.code === 'ER_DUP_COLUMN_NAME') {
          console.log(`ℹ️ Column ${name} already exists, skipping.`);
        } else {
          throw err;
        }
      }
    }

    console.log('🚀 Migration successful!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await connection.end();
  }
}

migrate();
