import pool from "./config/db.js";

async function check() {
  try {
    const [cols] = await pool.promise().query("DESCRIBE applications");
    cols.forEach(c => console.log(c.Field));
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}
check();
