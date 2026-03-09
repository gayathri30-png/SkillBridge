import pool from '../config/db.js';

async function addHeadline() {
  try {
    const promisePool = pool.promise();
    // Check if column exists first
    const [columns] = await promisePool.query("SHOW COLUMNS FROM users LIKE 'headline'");
    if (columns.length === 0) {
      console.log("Adding headline column...");
      await promisePool.query("ALTER TABLE users ADD COLUMN headline VARCHAR(255) DEFAULT ''");
      console.log("Column added.");
    } else {
      console.log("Headline column already exists.");
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    pool.end();
  }
}

addHeadline();
