import db from "./config/db.js";

async function verify() {
    console.log("🔍 Full System Interview Verification...");

    const promiseQuery = db.promise().query.bind(db.promise());

    try {
        // 1. Check all interviews
        const [interviews] = await promiseQuery(`
            SELECT i.*, u_s.name as student_name, u_r.name as recruiter_name, j.title as job_title
            FROM interviews i
            JOIN users u_s ON i.student_id = u_s.id
            JOIN users u_r ON i.recruiter_id = u_r.id
            JOIN jobs j ON (SELECT job_id FROM applications WHERE id = i.application_id) = j.id
        `);
        console.log("📅 All Interviews in DB:", interviews);

        // 2. Check notifications for students
        const [notifications] = await promiseQuery(`
            SELECT * FROM notifications 
            WHERE type = 'interview_invitation' 
            ORDER BY created_at DESC 
            LIMIT 5
        `);
        console.log("🔔 Recent Interview Notifications:", notifications);

        // 3. Check student dashboard stats for user 2 (Student One)
        const [studentApps] = await promiseQuery("SELECT COUNT(*) as count FROM applications WHERE student_id = 2");
        console.log("📄 Applications by Student One (ID 2):", studentApps[0].count);

        if (interviews.length === 0) {
            console.log("⚠️ No interviews found. Trying to find top applicants for job 13 to see if auto-invite WOULD work...");
            const [topApps] = await promiseQuery(`
                SELECT a.id, a.student_id, u.role
                FROM applications a
                JOIN users u ON a.student_id = u.id
                WHERE a.job_id = 13
            `);
            console.log("🔝 Potential applicants for Job 13:", topApps);
        }

    } catch (err) {
        console.error("❌ Verification failed:", err);
    } finally {
        process.exit(0);
    }
}

verify();
