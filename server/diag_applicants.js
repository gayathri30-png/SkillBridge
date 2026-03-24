import db from "./config/db.js";

console.log("🔍 Checking Jobs and Applications...");

db.query("SELECT id, title, posted_by FROM jobs WHERE title LIKE 'Frontend%'", (err, jobs) => {
    if (err) {
        console.error("Error fetching jobs:", err);
        process.exit(1);
    }
    console.log("📋 Found Jobs:", jobs);

    if (jobs.length > 0) {
        const jobIds = jobs.map(j => j.id);
        db.query("SELECT id, job_id, student_id, status FROM applications WHERE job_id IN (?)", [jobIds], (err, apps) => {
            if (err) {
                console.error("Error fetching applications:", err);
            } else {
                console.log("📄 Found Applications for these jobs:", apps);
            }
            db.query("SELECT COUNT(*) as total_apps FROM applications", (err, count) => {
                console.log("📊 Total applications in DB:", count[0].total_apps);
                process.exit(0);
            });
        });
    } else {
        console.log("❌ No jobs found matching 'Frontend'.");
        process.exit(0);
    }
});
