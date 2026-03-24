import 'dotenv/config';
import db from './config/db.js';

async function check() {
  try {
    const [jobsCols] = await db.promise().query("SHOW COLUMNS FROM jobs");
    console.log("--- JOBS TABLE (Currency Fields) ---");
    jobsCols.filter(c => /salary|budget/i.test(c.Field)).forEach(c => console.log(`${c.Field} - ${c.Type}`));
    
    const [appsCols] = await db.promise().query("SHOW COLUMNS FROM applications");
    console.log("\n--- APPLICATIONS TABLE (Currency Fields) ---");
    appsCols.filter(c => /salary|budget/i.test(c.Field)).forEach(c => console.log(`${c.Field} - ${c.Type}`));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
