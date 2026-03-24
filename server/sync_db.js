import db from "./config/db.js";

async function sync() {
    console.log("🔄 Syncing Interviews with Applications...");
    const promiseQuery = db.promise().query.bind(db.promise());
    try {
        // Update any interview records where student_id doesn't match the application's student_id
        await promiseQuery(`
            UPDATE interviews i
            JOIN applications a ON i.application_id = a.id
            SET i.student_id = a.student_id
        `);
        console.log("✅ Sync complete. student_id in interviews now matches applications.");

        // Clear any orphaned notifications or create new ones for the correct student
        const [apps] = await promiseQuery("SELECT a.id, a.student_id, j.title FROM applications a JOIN jobs j ON a.job_id = j.id WHERE a.id IN (SELECT application_id FROM interviews)");
        
        for (const app of apps) {
            await promiseQuery("INSERT INTO notifications (user_id, title, message, type) VALUES (?, 'Interview Invitation', 'You have an interview for ' + ?, 'interview_invitation')", [app.student_id, app.title]);
            console.log(`🔔 Notification sent to correct student (ID ${app.student_id})`);
        }

    } catch (err) {
        console.error("❌ Sync failed:", err);
    } finally {
        process.exit(0);
    }
}
sync();
