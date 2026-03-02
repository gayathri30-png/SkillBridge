import db from "../config/db.js";

const printUsers = async () => {
    try {
        const [rows] = await db.promise().query("DESCRIBE users");
        console.log("USER_COLS:", rows.map(r => r.Field).join(", "));
        process.exit(0);
    } catch (e) {
        process.exit(1);
    }
};

printUsers();
