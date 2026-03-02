import db from "../config/db.js";

const addCreatedAt = async () => {
    try {
        console.log("Adding created_at to users table...");
        await db.promise().query("ALTER TABLE users ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP");
        console.log("Success.");
        process.exit(0);
    } catch (e) {
        console.error("Migration failed:", e);
        process.exit(1);
    }
};

addCreatedAt();
