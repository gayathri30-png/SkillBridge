import axios from "axios";
import pool from "./config/db.js";

async function setupAndTest() {
  try {
    const studentEmail = `diag_${Date.now()}@test.com`;
    const password = "password123";
    
    // 1. Register new student
    console.log("Registering test student...");
    const regRes = await axios.post("http://localhost:5001/api/auth/register", {
        name: "Diag Student",
        email: studentEmail,
        password: password,
        role: "student"
    });
    
    const token = regRes.data.token;
    const studentId = regRes.data.user.id;
    console.log(`✅ Registered! Student ID: ${studentId}`);

    // 2. Create a dummy application and interview
    console.log("Creating test application and interview...");
    const [job] = await pool.promise().query("SELECT id FROM jobs LIMIT 1");
    const jobId = job[0].id;
    
    const [app] = await pool.promise().query(
        "INSERT INTO applications (job_id, student_id, status) VALUES (?, ?, 'shortlisted')",
        [jobId, studentId]
    );
    const applicationId = app.insertId;
    
    const [interview] = await pool.promise().query(
        "INSERT INTO interviews (application_id, scheduled_at, status) VALUES (?, NOW(), 'pending')",
        [applicationId]
    );
    const interviewId = interview.insertId;
    console.log(`✅ Created Interview ID: ${interviewId}`);

    // 3. Test the endpoint
    console.log(`Testing /api/ai/interview-prep/${interviewId}...`);
    try {
        const prepRes = await axios.get(`http://localhost:5001/api/ai/interview-prep/${interviewId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("✅ Endpoint Response Success!");
        console.log(JSON.stringify(prepRes.data, null, 2));
    } catch (e) {
        console.error("❌ Endpoint Failed:", e.response ? e.response.status : e.message);
        if (e.response) console.error("Error Data:", e.response.data);
    }

  } catch (err) {
    console.error("❌ Setup Failed:", err.message);
    if (err.response) console.error("Error Data:", err.response.data);
  } finally {
    process.exit();
  }
}

setupAndTest();
