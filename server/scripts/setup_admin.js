import db from "../config/db.js";
import bcrypt from "bcryptjs";

const setupAdmin = async () => {
    try {
        db.query("SELECT id FROM users WHERE role = 'admin'", async (err, rows) => {
            if (err) {
                console.error("DB Error:", err);
                process.exit(1);
            }

            if (rows.length > 0) {
                console.log("---ADMIN_INFO---");
                console.log("An admin account already exists.");
                db.query("SELECT email FROM users WHERE role = 'admin'", (err, results) => {
                    if (!err && results.length > 0) {
                        console.log("Admin email: " + results[0].email);
                    }
                    console.log("---END_INFO---");
                    process.exit(0);
                });
            } else {
                console.log("No admin found. Creating a default admin account...");
                const name = "Super Admin";
                const email = "admin@skillbridge.com";
                const password = "admin_password_2024";
                const hash = bcrypt.hashSync(password, 10);
                
                db.query(
                    "INSERT INTO users (name, email, password, role, is_verified) VALUES (?, ?, ?, 'admin', true)",
                    [name, email, hash],
                    (err, result) => {
                        if (err) {
                            console.error("Failed to create admin:", err);
                            process.exit(1);
                        }
                        console.log("---ADMIN_CREATED---");
                        console.log("Admin email: " + email);
                        console.log("Admin password: " + password);
                        console.log("---END_INFO---");
                        process.exit(0);
                    }
                );
            }
        });
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

setupAdmin();
