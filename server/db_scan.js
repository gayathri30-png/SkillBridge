import db from "./config/db.js";

async function showDB() {
  try {
    const [rows] = await db.promise().query("SHOW DATABASES");
    console.table(rows);
    
    // Also show tables in current DB
    const [tables] = await db.promise().query("SHOW TABLES");
    console.table(tables);
    
    // Also show rows in interviews
    const [interviews] = await db.promise().query("SELECT * FROM interviews");
    console.table(interviews);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}
showDB();
