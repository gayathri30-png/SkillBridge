import db from "../config/db.js";

const printColumns = async () => {
    try {
        const [rows] = await db.promise().query("DESCRIBE applications");
        const cols = rows.map(r => r.Field);
        console.log("COLUMNS:", cols.join(", "));
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

printColumns();
