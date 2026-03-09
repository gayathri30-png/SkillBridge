import db from "../config/db.js";

const verifySeeding = async () => {
    try {
        const [studentRows] = await db.promise().query("SELECT COUNT(*) as count FROM users WHERE email LIKE 'teststudent%@example.com'");
        const [recruiterRows] = await db.promise().query("SELECT COUNT(*) as count FROM users WHERE email LIKE 'testrecruiter%@example.com'");
        
        console.log(`\n📊 Verification Results:`);
        console.log(`Students found: ${studentRows[0].count}`);
        console.log(`Recruiters found: ${recruiterRows[0].count}`);
    } catch (err) {
        console.error("\n❌ Verification failed:", err);
    } finally {
        process.exit(0);
    }
}
verifySeeding();
