import mysql from 'mysql2/promise';

const student_id = 1026;
const job_id = 7; 

async function runTest() {
  const conn = await mysql.createConnection({
    host: 'localhost', user: 'root', password: 'gayathri', database: 'skillbridge',
  });

  try {
    console.log("1. Cleaning up previous specific test data...");
    await conn.query("DELETE FROM applications WHERE student_id = ? AND job_id = ?", [student_id, job_id]);

    console.log("2. Manually inserting application for Student 1026...");
    const [ins] = await conn.query(
      "INSERT INTO applications (job_id, student_id, proposal, status, ai_match_score) VALUES (?, ?, ?, 'pending', 85.00)",
      [job_id, student_id, "Test proposal for integration verification"]
    );
    const appId = ins.insertId;
    console.log(`Inserted App ID: ${appId}`);

    const [recruiterRes] = await conn.query("SELECT posted_by, title FROM jobs WHERE id = ?", [job_id]);
    const recruiterId = recruiterRes[0].posted_by;
    const jobTitle = recruiterRes[0].title;
    const roomId = `app_${appId}`;

    console.log("3. Creating chat room...");
    await conn.query(
      "INSERT INTO chat_rooms (room_id, application_id, student_id, recruiter_id, job_title) VALUES (?, ?, ?, ?, ?)",
      [roomId, appId, student_id, recruiterId, jobTitle]
    );
    console.log(`Created Chat Room: ${roomId}`);

    console.log("4. Creating notification (Fixed Schema)...");
    await conn.query(
      "INSERT INTO notifications (user_id, type, message, is_read) VALUES (?, 'application', ?, 0)",
      [recruiterId, `New application for ${jobTitle}`]
    );
    console.log("Notification created for recruiter.");

    console.log("=== VERIFICATION ===");
    const [notifs] = await conn.query("SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 1", [recruiterId]);
    console.log("Latest Notification for Recruiter:", JSON.stringify(notifs[0], null, 2));

    const [rooms] = await conn.query("SELECT * FROM chat_rooms WHERE room_id = ?", [roomId]);
    console.log("Chat Room details:", JSON.stringify(rooms[0], null, 2));

  } catch (e) {
    console.error("Test failed:", e.message);
  } finally {
    await conn.end();
  }
}

runTest();
