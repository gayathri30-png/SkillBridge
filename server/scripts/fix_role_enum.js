import db from "../config/db.js";

const fixRoleEnum = () => {
  console.log("🔧 Updating users table role enum to include 'admin'...");

  const query = "ALTER TABLE users MODIFY COLUMN role ENUM('student', 'recruiter', 'admin') NOT NULL";

  db.query(query, (err, result) => {
    if (err) {
      console.error("❌ Error updating enum:", err.message);
    } else {
      console.log("✅ Role enum updated successfully.");
    }
    process.exit();
  });
};

fixRoleEnum();
