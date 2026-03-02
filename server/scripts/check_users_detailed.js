import db from '../config/db.js';

async function verifyUsers() {
  console.log("🔍 Auditing Users Table...");
  try {
    const [columns] = await db.promise().query("DESCRIBE users");
    console.log("Users Table Columns:");
    columns.forEach(c => console.log(`- ${c.Field}`));
  } catch (err) {
    console.error("Error auditing users table:", err);
  }
  process.exit(0);
}

verifyUsers();
