import db from "./config/db.js";

async function finalSync() {
    console.log("🔄 Final Syncing Interviews...");
    const promiseQuery = db.promise().query.bind(db.promise());
    try {
        // 1. Sync student_id from applications to interviews
        await promiseQuery(`
            UPDATE interviews i
            JOIN applications a ON i.application_id = a.id
            SET i.student_id = a.student_id
        `);
        console.log("✅ Interviews synced with correct student IDs.");

        // 2. Clear old notifications and create one for User 8 (Tharun)
        const [int] = await promiseQuery(`
            SELECT i.id, i.student_id, j.title 
            FROM interviews i
            JOIN applications a ON i.application_id = a.id
            JOIN jobs j ON a.job_id = j.id
            LIMIT 1
        `);

        if (int.length > 0) {
            const { student_id, title } = int[0];
            await promiseQuery(`
                INSERT INTO notifications (user_id, title, message, type)
                VALUES (?, 'Interview Invitation', 'You have an interview scheduled for ' + ?, 'interview_invitation')
            `, [student_id, title]);
            console.log(`🔔 Notification sent to User ${student_id} for ${title}`);
        }

    } catch (err) {
        console.error("❌ Sync failed:", err);
    } finally {
        process.exit(0);
    }
}
finalSync();
