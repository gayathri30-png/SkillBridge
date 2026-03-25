import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../server/.env') });
dotenv.config({ path: path.join(__dirname, '../.env') });
async function cleanup() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    console.log('🧹 Starting Mock AI Data Cleanup...');

    // 1. Drop mock-only tables
    await connection.query('DROP TABLE IF EXISTS ai_insights');
    console.log('✅ Dropped table "ai_insights"');

    // 2. Truncate tables that might be used for real AI but currently have mock data
    await connection.query('DELETE FROM ai_recommendations');
    console.log('✅ Cleared table "ai_recommendations"');

    // 3. Optional: Clear skill gap analysis if it contains mock flags
    // (Based on our analysis, we'll just clear it all to be safe as requested)
    await connection.query('DELETE FROM skill_gap_analysis');
    console.log('✅ Cleared table "skill_gap_analysis"');

    console.log('✨ Database cleanup completed successfully!');
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
  } finally {
    await connection.end();
  }
}

cleanup();
