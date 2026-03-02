import mysql from "mysql2/promise";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

async function migrate() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "skillbridge",
  });

  console.log("🚀 Adding 'technologies' column to 'portfolio_items'...");

  const [columns] = await connection.execute("DESCRIBE portfolio_items");
  const columnNames = columns.map(c => c.Field);

  if (!columnNames.includes("technologies")) {
    await connection.execute("ALTER TABLE portfolio_items ADD COLUMN technologies VARCHAR(255)");
    console.log("✅ Column 'technologies' added.");
  } else {
    console.log("ℹ️ Column 'technologies' already exists.");
  }

  await connection.end();
  console.log("🏁 Migration completed successfully!");
}

migrate().catch(err => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
