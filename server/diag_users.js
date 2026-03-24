import db from "./config/db.js";

console.log("🔍 Checking Users and Roles...");

db.query("SELECT id, name, role FROM users", (err, users) => {
    if (err) {
        console.error("Error fetching users:", err);
        process.exit(1);
    }
    console.log("👥 Users:", users);

    db.query("SELECT * FROM applications WHERE job_id = 13", (err, apps) => {
        console.log("📄 Applications for Job 13:", apps);
        process.exit(0);
    });
});
