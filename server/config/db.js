import mysql from "mysql2";
import dotenv from "dotenv";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env explicitly to handle ESM hoisting issues
dotenv.config({ path: path.join(__dirname, "../.env") });

console.log("🔍 DB Config - Loading environment variables:");
console.log("DB_HOST:", process.env.DB_HOST || "localhost");
console.log("DB_USER:", process.env.DB_USER || "root");
console.log("DB_NAME:", process.env.DB_NAME || "skillbridge");

// Use createPool for better connection handling
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "skillbridge",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

// Test the connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ MySQL Connection Failed:", err.message);
  } else {
    console.log("✅ MySQL Pool Connected Successfully!");
    connection.query("SELECT 1 + 1 AS test", (err, results) => {
      if (!err) console.log("✅ Test query result:", results[0].test);
      connection.release();
    });
  }
});

// Handle pool errors
pool.on("error", (err) => {
  console.error("❌ MySQL Pool Error:", err.message);
});

export default pool;
