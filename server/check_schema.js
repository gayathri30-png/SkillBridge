
import db from "./config/db.js";

const checkSchema = () => {
  console.log("🔍 Checking Users Table Schema...");
  db.query("DESCRIBE users", (err, results) => {
    if (err) {
      console.error("❌ Error checking schema:", err.message);
    } else {
      console.log("✅ Users Table Schema:", results);
    }
    process.exit();
  });
};

checkSchema();
