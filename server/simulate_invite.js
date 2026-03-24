import db from "./config/db.js";

async function simulateAutoInvite() {
    console.log("🧪 Simulating Auto-Invite for Job 13...");
    const promiseQuery = db.promise().query.bind(db.promise());
    try {
        const jobId = 13;
        const recruiterId = 3;
        const scheduledAt = new Date(Date.now() + 86400000).toISOString().slice(0, 16);
        const count = 3;

        // Simulate logic
        const selectQuery = `
            SELECT a.id as application_id, a.student_id, a.ai_match_score 
            FROM applications a
            LEFT JOIN interviews i ON a.id = i.application_id
            WHERE a.job_id = ? AND a.status != 'rejected' AND i.id IS NULL
            ORDER BY a.ai_match_score DESC
            LIMIT ?
        `;
        const [applicants] = await promiseQuery(selectQuery, [jobId, count]);
        console.log("📑 Found applicants:", applicants);

        for (const app of applicants) {
            const insertQuery = `
                INSERT INTO interviews (application_id, recruiter_id, student_id, scheduled_at, status)
                VALUES (?, ?, ?, ?, 'pending')
            `;
            await promiseQuery(insertQuery, [app.application_id, recruiterId, app.student_id, scheduledAt]);
            console.log(`✅ Created interview record for student ${app.student_id}`);
            
            await promiseQuery("INSERT INTO notifications (user_id, title, message, type) VALUES (?, 'Interview Invitation (TEST)', 'Test invitation', 'interview_invitation')", [app.student_id]);
            console.log(`🔔 Notification sent to student ${app.student_id}`);
        }

        console.log("🚀 Simulation complete. Database updated.");

    } catch (err) {
        console.error("❌ Simulation failed:", err);
    } finally {
        process.exit(0);
    }
}
simulateAutoInvite();
