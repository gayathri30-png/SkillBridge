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
    multipleStatements: true
  });

  try {
    console.log('🚀 Starting Module 12 Specialized AI Features Migration...');

    const createTablesQuery = `
      -- 1. portfolio_analysis
      CREATE TABLE IF NOT EXISTS portfolio_analysis (
          id INT PRIMARY KEY AUTO_INCREMENT,
          user_id INT NOT NULL,
          overall_score INT,
          project_count INT,
          project_scores JSON,
          suggestions JSON,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );

      -- 2. skill_gap_analysis
      CREATE TABLE IF NOT EXISTS skill_gap_analysis (
          id INT PRIMARY KEY AUTO_INCREMENT,
          user_id INT NOT NULL,
          job_title VARCHAR(255),
          match_percentage INT,
          matched_skills JSON,
          missing_skills JSON,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );

      -- 3. ai_proposals
      CREATE TABLE IF NOT EXISTS ai_proposals (
          id INT PRIMARY KEY AUTO_INCREMENT,
          user_id INT NOT NULL,
          job_id INT,
          job_title VARCHAR(255),
          company VARCHAR(255),
          proposal_text TEXT,
          tone VARCHAR(50),
          length VARCHAR(50),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          used_count INT DEFAULT 0,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE SET NULL
      );

      -- 4. ai_recommendations
      CREATE TABLE IF NOT EXISTS ai_recommendations (
          id INT PRIMARY KEY AUTO_INCREMENT,
          user_id INT NOT NULL,
          recommendation_type ENUM('portfolio', 'skill', 'job') NOT NULL,
          recommendation_text TEXT,
          priority ENUM('high', 'medium', 'low') DEFAULT 'medium',
          is_completed BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `;

    await connection.query(createTablesQuery);
    console.log('✅ Specialized AI tables created successfully.');

    console.log('✨ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await connection.end();
  }
}

migrate();
