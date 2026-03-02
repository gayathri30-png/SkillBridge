import db from "../config/db.js";

const listJobs = async () => {
    try {
        const [rows] = await db.promise().query("DESCRIBE jobs");
        console.log("JOB_COLS:", rows.map(r => r.Field).join(", "));
        process.exit(0);
    } catch (e) {
        process.exit(1);
    }
};
listJobs();
