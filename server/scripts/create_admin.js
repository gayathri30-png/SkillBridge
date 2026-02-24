import db from "../config/db.js";
import bcrypt from "bcryptjs";

const createAdmin = () => {
    const name = "Admin User";
    const email = "admin@example.com";
    const password = "adminpassword123";
    const role = "admin";
    const hash = bcrypt.hashSync(password, 10);

    console.log(`🔧 Creating admin user: ${email}...`);

    db.query(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE role='admin'",
        [name, email, hash, role],
        (err, result) => {
            if (err) {
                console.error("❌ Error creating admin:", err.message);
            } else {
                console.log("✅ Admin user created/updated successfully!");
                console.log("📧 Email: admin@example.com");
                console.log("🔑 Password: adminpassword123");
            }
            process.exit();
        }
    );
};

createAdmin();
