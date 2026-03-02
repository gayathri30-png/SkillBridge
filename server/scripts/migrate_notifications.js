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
    console.log('🚀 Starting Module 13 Notifications Migration...');

    // We use ALTER TABLE or CREATE TABLE IF NOT EXISTS
    // Based on previous code, the table might exist but we want to ensure target_id and indexing
    const schemaQuery = `
      CREATE TABLE IF NOT EXISTS notifications (
          id INT PRIMARY KEY AUTO_INCREMENT,
          user_id INT NOT NULL,
          type VARCHAR(50) NOT NULL,
          target_id INT DEFAULT NULL,
          message TEXT NOT NULL,
          is_read BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );

      -- Add target_id if it doesn't exist (in case table existed but was simpler)
      SET @dbname = DATABASE();
      SET @tablename = "notifications";
      SET @columnname = "target_id";
      SET @preparedStatement = (SELECT IF(
        (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
         WHERE TABLE_SCHEMA = @dbname
           AND TABLE_NAME = @tablename
           AND COLUMN_NAME = @columnname) > 0,
        "SELECT 1",
        "ALTER TABLE notifications ADD COLUMN target_id INT DEFAULT NULL AFTER type"
      ));
      PREPARE stmt FROM @preparedStatement;
      EXECUTE stmt;
      DEALLOCATE PREPARE stmt;
    `;

    await connection.query(schemaQuery);
    console.log('✅ Notifications table schema updated.');

    console.log('✨ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await connection.end();
  }
}

migrate();
