import db from './server/config/db.js';

async function checkSchema() {
  try {
    const [rows] = await db.promise().query("DESCRIBE applications;");
    console.log(rows);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
checkSchema();
