import 'dotenv/config';
import db from './config/db.js';

async function migrate() {
  const connection = await db.promise();
  try {
    console.log("🚀 Starting Currency Migration (USD -> INR)...");

    // 1. Convert jobs.budget (USD * 83)
    console.log("📊 Migrating jobs.budget...");
    // Check if budget is non-empty and contains only numeric characters (or period)
    const [jobs] = await connection.query("SELECT id, budget FROM jobs WHERE budget IS NOT NULL AND budget != ''");
    for (const job of jobs) {
      const usdValue = parseFloat(job.budget.replace(/[^0-9.]/g, ''));
      if (!isNaN(usdValue)) {
        const inrValue = Math.round(usdValue * 83);
        await connection.query("UPDATE jobs SET budget = ? WHERE id = ?", [inrValue.toString(), job.id]);
      }
    }

    // 2. Convert applications.salary (USD * 83)
    console.log("📊 Migrating applications.salary...");
    const [apps] = await connection.query("SELECT id, salary FROM applications WHERE salary IS NOT NULL AND salary != ''");
    for (const app of apps) {
      const usdValue = parseFloat(app.salary.replace(/[^0-9.]/g, ''));
      if (!isNaN(usdValue)) {
        const inrValue = Math.round(usdValue * 83);
        await connection.query("UPDATE applications SET salary = ? WHERE id = ?", [inrValue.toString(), app.id]);
      }
    }

    // 3. Update column types to BIGINT for future consistency (optional but recommended)
    console.log("🛠️ Updating schema to BIGINT...");
    try {
        await connection.query("ALTER TABLE jobs MODIFY budget BIGINT UNSIGNED");
        await connection.query("ALTER TABLE applications MODIFY salary BIGINT UNSIGNED");
        console.log("✅ Schema updated successfully!");
    } catch (schemaErr) {
        console.warn("⚠️ Schema update failed (might be due to non-numeric data), keeping as VARCHAR for now.");
        console.error(schemaErr.message);
    }

    console.log("✨ Migration completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  }
}

migrate();
