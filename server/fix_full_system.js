import db from "./config/db.js";

async function fix() {
    console.log("🛠️ Fixing data and logic...");

    const promiseQuery = db.promise().query.bind(db.promise());

    try {
        // 1. Create application for Student One (ID 2) to Job 13
        const [existing] = await promiseQuery("SELECT * FROM applications WHERE student_id = 2 AND job_id = 13");
        if (existing.length === 0) {
            await promiseQuery(`
                INSERT INTO applications (student_id, job_id, proposal, status, ai_match_score)
                VALUES (2, 13, 'I am a real student developer interested in this role.', 'pending', 85)
            `);
            console.log("✅ Created application for Student One (ID 2) for Job 13");
        } else {
            console.log("ℹ️ Student One already has an application for Job 13");
        }

        // 2. We will now update the controller logic to be more flexible
        console.log("🚀 Data ready for testing with Student One (User ID 2)");

    } catch (err) {
        console.error("❌ Fix failed:", err);
    } finally {
        process.exit(0);
    }
}

fix();
