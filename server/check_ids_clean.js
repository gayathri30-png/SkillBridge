import pool from "./config/db.js";

async function check() {
  try {
    const [rows] = await pool.promise().query("SELECT id, application_id, student_id FROM interviews");
    console.log("INTERVIEW_RECORDS:");
    console.log(JSON.stringify(rows, null, 2));
    
    const [apps] = await pool.promise().query("SELECT id, student_id FROM applications");
    console.log("APPLICATION_RECORDS:");
    console.log(JSON.stringify(apps, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}
check();
