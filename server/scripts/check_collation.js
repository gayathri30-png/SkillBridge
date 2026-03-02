import db from "../config/db.js";

const checkCollation = async () => {
    try {
        const [rows] = await db.promise().query(`
            SELECT TABLE_NAME, TABLE_COLLATION 
            FROM information_schema.TABLES 
            WHERE TABLE_SCHEMA = 'skillbridge' 
            AND TABLE_NAME IN ('users', 'jobs', 'applications')
        `);
        console.log("COLLATIONS:", JSON.stringify(rows));
        process.exit(0);
    } catch (e) {
        process.exit(1);
    }
};
checkCollation();
