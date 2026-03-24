import db from "./config/db.js";

async function globalCheck() {
    console.log("🔍 Global Applications Check...");
    const promiseQuery = db.promise().query.bind(db.promise());
    try {
        const [apps] = await promiseQuery(`
            SELECT a.id, a.job_id, a.student_id, j.title, u.name 
            FROM applications a
            JOIN jobs j ON a.job_id = j.id
            JOIN users u ON a.student_id = u.id
            LIMIT 50
        `);
        console.log("📄 All Applications in DB:", apps);

        const [jobCount] = await promiseQuery("SELECT COUNT(*) as count FROM jobs");
        console.log("📊 Total Jobs:", jobCount[0].count);

    } catch (err) {
        console.error("❌ Error:", err);
    } finally {
        process.exit(0);
    }
}
globalCheck();
