import db from "./config/db.js";

async function definitiveDump() {
    console.log("🔍 DEFINITIVE DATA DUMP...");
    const promiseQuery = db.promise().query.bind(db.promise());
    try {
        const [users] = await promiseQuery("SELECT id, name, role FROM users");
        console.log("👥 ALL USERS:", users);

        const [interviews] = await promiseQuery(`
            SELECT i.id, i.application_id, i.recruiter_id, i.student_id, i.status, 
                   u_r.name as recruiter_name, u_s.name as student_name
            FROM interviews i
            JOIN users u_r ON i.recruiter_id = u_r.id
            JOIN users u_s ON i.student_id = u_s.id
        `);
        console.log("📅 ALL INTERVIEWS:", interviews);

        const [apps] = await promiseQuery(`
            SELECT a.id, a.job_id, a.student_id, u.name as applicant_name
            FROM applications a
            JOIN users u ON a.student_id = u.id
            WHERE a.job_id = 13
        `);
        console.log("📄 APPLICATIONS FOR JOB 13:", apps);

    } catch (err) {
        console.error("❌ Error:", err);
    } finally {
        process.exit(0);
    }
}
definitiveDump();
