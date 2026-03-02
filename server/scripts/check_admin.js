import db from "./config/db.js";

const checkAdmin = async () => {
    try {
        db.query("SELECT name, email, role FROM users WHERE role = 'admin'", (err, rows) => {
            if (err) {
                console.error("Error:", err);
                process.exit(1);
            }
            console.log("---ADMIN_USER_LIST---");
            console.log(JSON.stringify(rows));
            console.log("---END_LIST---");
            process.exit(0);
        });
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};
checkAdmin();
