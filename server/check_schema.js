import db from "./config/db.js";

const check = async () => {
    try {
        const [rows] = await db.promise().query("SHOW COLUMNS FROM users");
        console.log("Users Table Columns:", rows.map(r => r.Field));
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
check();
