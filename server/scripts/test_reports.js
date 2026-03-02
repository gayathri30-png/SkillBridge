import db from "../config/db.js";

const testQuery = async () => {
    try {
        console.log("Testing user counts...");
        const [u] = await db.promise().query("SELECT role, COUNT(*) as count FROM users GROUP BY role");
        console.log("Users:", u);

        console.log("Testing job counts...");
        const [j] = await db.promise().query("SELECT status, COUNT(*) as count FROM jobs GROUP BY status");
        console.log("Jobs:", j);

        console.log("Testing application counts...");
        const [a] = await db.promise().query("SELECT status, COUNT(*) as count FROM applications GROUP BY status");
        console.log("Apps:", a);

        console.log("Testing Merged Activity logic...");
        const [userActivity] = await db.promise().query("SELECT 'signup' as type, name as detail, created_at FROM users ORDER BY created_at DESC LIMIT 10");
        const [jobActivity] = await db.promise().query("SELECT 'job' as type, title as detail, created_at FROM jobs ORDER BY created_at DESC LIMIT 10");
        const [appActivity] = await db.promise().query(`
          SELECT 'application' as type, j.title as detail, a.created_at 
          FROM applications a 
          JOIN jobs j ON a.job_id = j.id
          ORDER BY a.created_at DESC LIMIT 10
        `);

        const mixedActivity = [...userActivity, ...jobActivity, ...appActivity]
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 10);

        console.log("Activity (Top 10):", mixedActivity);

        process.exit(0);
    } catch (error) {
        console.error("QUERY FAILED:", error);
        process.exit(1);
    }
};

testQuery();
