import pool from "./server/config/db.js";

async function check() {
  try {
    const [rows] = await pool.promise().query(`
      SELECT i.id as interview_id, a.student_id, u.name as student_name
      FROM interviews i
      JOIN applications a ON i.application_id = a.id
      JOIN users u ON a.student_id = u.id
      LIMIT 10
    `);
    console.table(rows);
    
    const [currentUser] = await pool.promise().query("SELECT id, name, role FROM users WHERE name = 'Gayathri' LIMIT 1");
    console.log("Current User (Gayathri):", currentUser[0]);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}
check();
