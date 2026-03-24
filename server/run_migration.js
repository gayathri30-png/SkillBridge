import db from "./config/db.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const migrationPath = path.join(__dirname, "../migrations_interviews.sql");
const sql = fs.readFileSync(migrationPath, "utf8");

console.log("🚀 Running migration...");

db.query(sql, (err, results) => {
    if (err) {
        if (err.code === 'ER_TABLE_EXISTS_ERROR') {
            console.log("⚠️ Table 'interviews' already exists.");
            process.exit(0);
        }
        console.error("❌ Migration failed:", err);
        process.exit(1);
    }
    console.log("✅ Migration successful!");
    process.exit(0);
});
