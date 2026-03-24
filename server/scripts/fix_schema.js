import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const conn = await mysql.createConnection({
  host: 'localhost', user: 'root', password: 'gayathri', database: 'skillbridge',
});
let out = '';
try {
  const [a] = await conn.query("SELECT a.id, a.student_id, a.job_id, a.status, j.title FROM applications a JOIN jobs j ON a.job_id = j.id ORDER BY a.created_at DESC LIMIT 5");
  out += "APPS:\n" + JSON.stringify(a, null, 2) + "\n\n";

  const [r] = await conn.query("SELECT id, room_id, student_id, recruiter_id, job_title FROM chat_rooms ORDER BY created_at DESC LIMIT 5");
  out += "ROOMS:\n" + JSON.stringify(r, null, 2) + "\n\n";

  const [n] = await conn.query("SELECT id, user_id, type, message, CAST(is_read AS UNSIGNED) as is_read FROM notifications ORDER BY created_at DESC LIMIT 10");
  out += "NOTIFS:\n" + JSON.stringify(n, null, 2) + "\n\n";

  const [c] = await conn.query("SHOW COLUMNS FROM messages");
  out += "MSG_COLS: " + JSON.stringify(c.map(x => x.Field)) + "\n";
} catch(e) { out += "ERROR: " + e.message; }
finally {
  await conn.end();
  const outPath = path.join(__dirname, 'db_check_result.txt');
  fs.writeFileSync(outPath, out);
  console.log("Written to " + outPath);
}
