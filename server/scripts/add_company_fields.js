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
    database: process.env.DB_NAME
  });

  try {
    console.log('🚀 Adding company fields to users table...');

    const alterTableQuery = `
      ALTER TABLE users 
      ADD COLUMN company_name VARCHAR(255) DEFAULT NULL,
      ADD COLUMN company_bio TEXT DEFAULT NULL;
    `;

    await connection.query(alterTableQuery);
    console.log('✅ Columns "company_name" and "company_bio" added successfully.');

    console.log('✨ Migration completed!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await connection.end();
  }
}

migrate();
