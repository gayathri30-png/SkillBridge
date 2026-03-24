import db from "./config/db.js";

async function verifyDB() {
    console.log("🔍 Verifying DB Tables and Job 13...");
    const promiseQuery = db.promise().query.bind(db.promise());
    try {
        const [tables] = await promiseQuery("SHOW TABLES");
        console.log("📋 Tables:", tables.map(t => Object.values(t)[0]));

        const [job] = await promiseQuery("SELECT * FROM jobs WHERE id = 13");
        console.log("💼 Job 13:", job);

        const [users] = await promiseQuery("SELECT * FROM users WHERE id = 2");
        console.log("👤 User 2:", users);

    } catch (err) {
        console.error("❌ Error:", err);
    } finally {
        process.exit(0);
    }
}
verifyDB();
