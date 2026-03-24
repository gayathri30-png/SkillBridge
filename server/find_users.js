import db from "./config/db.js";

async function findUsers() {
    console.log("🔍 Searching for users Gayathri and Tharun...");
    const promiseQuery = db.promise().query.bind(db.promise());
    try {
        const [gayathri] = await promiseQuery("SELECT id, name, role FROM users WHERE name LIKE '%Gayathri%'");
        console.log("👤 Gayathri ID(s):", gayathri);

        const [tharun] = await promiseQuery("SELECT id, name, role FROM users WHERE name LIKE '%Tharun%'");
        console.log("👤 Tharun ID(s):", tharun);

        if (tharun.length > 0) {
            const tharunId = tharun[0].id;
            const [interviews] = await promiseQuery("SELECT * FROM interviews WHERE student_id = ?", [tharunId]);
            console.log(`📅 Interviews for Tharun (ID ${tharunId}):`, interviews);
            
            const [notifications] = await promiseQuery("SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 5", [tharunId]);
            console.log(`🔔 Notifications for Tharun (ID ${tharunId}):`, notifications);
        }

    } catch (err) {
        console.error("❌ Error:", err);
    } finally {
        process.exit(0);
    }
}
findUsers();
