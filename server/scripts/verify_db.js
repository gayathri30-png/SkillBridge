
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load .env from server root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.join(__dirname, "../.env");

console.log(`\n📂 Loading environment from: ${envPath}`);
dotenv.config({ path: envPath });

async function verifyConnection() {
  console.log("\n🔍 Checking Database Configuration...");
  console.log(`   Host: ${process.env.DB_HOST || "localhost"}`);
  console.log(`   User: ${process.env.DB_USER || "root"}`);
  console.log(`   Database: ${process.env.DB_NAME || "skillbridge"}`);
  // Do not log password

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "skillbridge",
    });

    console.log("\n✅ CONNECTION SUCCESSFUL!");
    
    const [rows] = await connection.execute("SELECT count(*) as count FROM users");
    console.log(`✅ 'users' table exists and has ${rows[0].count} records.`);

    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error("\n❌ CONNECTION FAILED:");
    console.error(`   Error Code: ${error.code}`);
    console.error(`   Message: ${error.message}`);
    
    if (error.code === 'ECONNREFUSED') {
      console.log("\n💡 TIP: Is your MySQL server running?");
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
        console.log("\n💡 TIP: Check your username and password in .env");
    } else if (error.code === 'ER_BAD_DB_ERROR') {
        console.log(`\n💡 TIP: Does the database '${process.env.DB_NAME || "skillbridge"}' exist?`);
    }

    process.exit(1);
  }
}

verifyConnection();
