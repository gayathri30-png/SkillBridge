
import db from "../config/db.js";

const addColumns = () => {
  console.log("🔧 Adding reset password columns to users table...");

  const queries = [
    "ALTER TABLE users ADD COLUMN reset_password_token VARCHAR(255) DEFAULT NULL",
    "ALTER TABLE users ADD COLUMN reset_password_expires DATETIME DEFAULT NULL"
  ];

  let completed = 0;

  queries.forEach((query) => {
    db.query(query, (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
            console.log(`⚠️ Column already exists, skipping.`);
        } else {
            console.error("❌ Error adding column:", err.message);
        }
      } else {
        console.log("✅ Column added successfully.");
      }
      completed++;
      if (completed === queries.length) {
        console.log("🎉 Database update complete.");
        process.exit();
      }
    });
  });
};

addColumns();
