import 'dotenv/config';
import db from './server/config/db.js';
import { markSuggestionSent } from './server/controllers/applicationsController.js';

async function test() {
  console.log("--- Testing Interview Invitation Fix ---");
  
  // Real IDs from DB
  const applicationId = 7;
  const studentId = 2; 
  const recruiterId = 41; 

  // Create a mock req and res
  const req = {
    params: { id: applicationId },
    body: {
      interviewDate: '2026-04-10',
      interviewTime: '02:00 PM',
      message: 'Looking forward to discussing your UI/UX portfolio!'
    },
    user: { id: recruiterId, name: 'Lead Recruiter' }
  };
  
  const res = {
    json: (data) => console.log("Success Response:", data),
    status: (code) => {
      console.log(`Setting status to ${code}`);
      return { json: (data) => console.log(`Error Response:`, data) };
    }
  };

  try {
    await markSuggestionSent(req, res);
    
    // Check notifications
    const [notifs] = await db.promise().query("SELECT * FROM notifications WHERE type = 'interview_invitation' AND user_id = ? ORDER BY created_at DESC LIMIT 1", [studentId]);
    console.log("Recent Notification:", JSON.stringify(notifs[0], null, 2));
    
    // Check messages
    const roomId = `app_${applicationId}`;
    const [msgs] = await db.promise().query("SELECT * FROM messages WHERE room_id = ? ORDER BY created_at DESC LIMIT 1", [roomId]);
    console.log("Recent Message in Chat:", JSON.stringify(msgs[0], null, 2));
    
    process.exit(0);
  } catch (err) {
    console.error("Test failed:", err);
    process.exit(1);
  }
}

test();
