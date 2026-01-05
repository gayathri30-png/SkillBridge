import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

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
    console.error("Error Code:", err.code);

    // Detailed troubleshooting
    console.log("\n🔧 Troubleshooting:");
    console.log("1. Check if MySQL is running");
    console.log("2. Verify credentials in .env file");
    console.log(
      "3. Check if database exists:",
      process.env.DB_NAME || "skillbridge"
    );
    console.log("4. Try: mysql -u root -p (in terminal)");
  } else {
    console.log("✅ MySQL Pool Connected Successfully!");
    console.log("Database:", process.env.DB_NAME || "skillbridge");
    console.log("Thread ID:", connection.threadId);

    // Test query
    connection.query("SELECT 1 + 1 AS test", (err, results) => {
      if (err) {
        console.error("❌ Test query failed:", err.message);
      } else {
        console.log("✅ Test query result:", results[0].test);
      }
      connection.release(); // Release back to pool
    });
  }
});

// Handle pool errors
pool.on("error", (err) => {
  console.error("❌ MySQL Pool Error:", err.message);
});

export default pool;
