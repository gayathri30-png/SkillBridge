import db from '../config/db.js';

async function migrate() {
    try {
        console.log("Checking for company_name column...");
        const [columns] = await db.promise().query(`SHOW COLUMNS FROM users LIKE 'company_name'`);
        if (columns.length === 0) {
            console.log("Adding company_name column to users table...");
            await db.promise().query(`ALTER TABLE users ADD COLUMN company_name VARCHAR(255) DEFAULT NULL`);
            console.log("✅ company_name added successfully.");
        } else {
            console.log("✅ company_name column already exists.");
        }
        process.exit(0);
    } catch (e) {
        console.error("Migration failed:", e);
        process.exit(1);
    }
}

migrate();
