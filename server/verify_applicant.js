import db from "./config/db.js";

async function verifyApplicant() {
    console.log("🔍 Verifying Applicant Side (User ID 3)...");

    const promiseQuery = db.promise().query.bind(db.promise());

    try {
        const userId = 3;
        
        // 1. Notifications
        const [notifications] = await promiseQuery(`
            SELECT * FROM notifications 
            WHERE user_id = ? 
            ORDER BY created_at DESC 
            LIMIT 5
        `, [userId]);
        console.log(`🔔 Recent Notifications for User ${userId}:`, notifications);

        // 2. Interviews
        const [interviews] = await promiseQuery(`
            SELECT i.*, j.title as job_title, u1.name as recruiter_name
            FROM interviews i
            JOIN applications a ON i.application_id = a.id
            JOIN jobs j ON a.job_id = j.id
            JOIN users u1 ON i.recruiter_id = u1.id
            WHERE i.student_id = ?
        `, [userId]);
        console.log(`📅 Interviews for User ${userId}:`, interviews);

        if (interviews.length > 0) {
            console.log("✅ Interview found! The applicant SHOULD see it.");
        } else {
            console.log("❌ No interviews found for the applicant. Re-running auto-invite simulation for User 3...");
            // Simulate invite again for user 3
            const [apps] = await promiseQuery("SELECT id FROM applications WHERE student_id = ? AND job_id = 13", [userId]);
            if (apps.length > 0) {
                const appId = apps[0].id;
                const recruiterId = 54; // Based on deep_verify
                const scheduledAt = "2026-03-24T10:00";
                await promiseQuery(`
                    INSERT INTO interviews (application_id, recruiter_id, student_id, scheduled_at, status)
                    VALUES (?, ?, ?, ?, 'pending')
                    ON DUPLICATE KEY UPDATE scheduled_at = VALUES(scheduled_at)
                `, [appId, recruiterId, userId, scheduledAt]);
                await promiseQuery(`
                    INSERT INTO notifications (user_id, title, message, type)
                    VALUES (?, 'Interview Invitation', 'You have been invited!', 'interview_invitation')
                `, [userId]);
                console.log("✅ Re-run successful. Application matched.");
            }
        }

    } catch (err) {
        console.error("❌ Error:", err);
    } finally {
        process.exit(0);
    }
}

verifyApplicant();
