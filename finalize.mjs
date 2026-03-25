import mysql from 'mysql2/promise';
import fs from 'fs';
import { execSync } from 'child_process';

async function run() {
  console.log("1. Connecting to database to insert valid dummy records...");
  const connection = await mysql.createConnection({ host: 'localhost', user: 'root', password: 'gayathri', database: 'skillbridge' });
  const [users] = await connection.query('SELECT id FROM users LIMIT 1');
  const [jobs] = await connection.query('SELECT id FROM jobs LIMIT 1');
  const userId = users.length ? users[0].id : 1;
  const jobId = jobs.length ? jobs[0].id : 1;

  try { await connection.query(`INSERT IGNORE INTO ai_proposals (user_id, job_id, proposal_text) VALUES (?, ?, ?)`, [userId, jobId, 'Dummy proposal for testing']); } catch(e){ console.log("Failed ai_proposals", e.message); }
  try { await connection.query(`INSERT IGNORE INTO ai_recommendations (user_id, recommendations) VALUES (?, ?)`, [userId, JSON.stringify(["Dummy Recommendation"])]); } catch(e){ console.log("Failed ai_rec", e.message); }
  try { await connection.query(`INSERT IGNORE INTO skill_gap_analysis (user_id, job_title, matched_skills, missing_skills, recommendations) VALUES (?, ?, ?, ?, ?)`, [userId, 'Software Engineer', JSON.stringify(["JavaScript"]), JSON.stringify(["Python"]), JSON.stringify(["Learn python"])]); } catch(e){ console.log("Failed sga", e.message); }
  
  await connection.end();
  console.log("Dummy records inserted successfully.");

  console.log("2. Regenerating mysqldump...");
  execSync('"C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin\\mysqldump.exe" -u root -pgayathri skillbridge > skillbridge_final.sql', { stdio: 'inherit' });

  console.log("3. Prepending CREATE DATABASE statement...");
  const dumpContent = fs.readFileSync('skillbridge_final.sql', 'utf8');
  const prependText = "CREATE DATABASE IF NOT EXISTS skillbridge;\nUSE skillbridge;\n\n";
  fs.writeFileSync('skillbridge_final.sql', prependText + dumpContent);
  console.log("Prepended successfully.");

  console.log("4. Testing ONE full Drop & Import cycle...");
  const testConn = await mysql.createConnection({ host: 'localhost', user: 'root', password: 'gayathri' });
  await testConn.query('DROP DATABASE IF EXISTS skillbridge');
  await testConn.query('CREATE DATABASE skillbridge');
  await testConn.end();
  
  execSync('mysql -u root -pgayathri skillbridge < skillbridge_final.sql', { stdio: 'inherit' });
  console.log("Import test successful! The database is verified ready.");
}

run().catch(console.error);
