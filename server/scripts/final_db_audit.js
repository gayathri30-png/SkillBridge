import db from '../config/db.js';

async function verifyDatabase() {
  console.log("🔍 Starting Comprehensive Database Audit...");
  
  const tables = ['users', 'skills', 'user_skills', 'applications', 'jobs'];
  
  for (const table of tables) {
    try {
      const [columns] = await db.promise().query(`DESCRIBE ${table}`);
      console.log(`\n✅ Table Found: ${table}`);
      console.log("   Columns: " + columns.map(c => c.Field).join(", "));
    } catch (err) {
      console.error(`\n❌ Table MISSING or Error in ${table}:`, err.message);
    }
  }
  
  console.log("\n🏁 Audit Complete.");
  process.exit(0);
}

verifyDatabase();
