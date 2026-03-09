import db from "../config/db.js";
import bcrypt from "bcryptjs";

const NUM_STUDENTS = 15;
const NUM_RECRUITERS = 6;
const DEFAULT_PASSWORD = "password123";

const seedUsers = async () => {
    try {
        console.log("🌱 Starting user seeding process...");
        const hash = bcrypt.hashSync(DEFAULT_PASSWORD, 10);
        
        const insertUser = async (role, i) => {
            const name = `Test ${role.charAt(0).toUpperCase() + role.slice(1)} ${i}`;
            const email = `test${role}${i}@example.com`;
            
            const query = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
            
            try {
                await db.promise().query(query, [name, email, hash, role]);
                console.log(`✅ Inserted ${role}: ${email}`);
            } catch (err) {
                if (err.code === "ER_DUP_ENTRY") {
                    console.log(`⚠️ Skipped (already exists): ${email}`);
                } else {
                    console.error(`❌ Error inserting ${email}:`, err.message);
                }
            }
        };

        console.log(`\n👨‍🎓 Seeding ${NUM_STUDENTS} students...`);
        for (let i = 1; i <= NUM_STUDENTS; i++) {
            await insertUser("student", i);
        }

        console.log(`\n👔 Seeding ${NUM_RECRUITERS} recruiters...`);
        for (let i = 1; i <= NUM_RECRUITERS; i++) {
            await insertUser("recruiter", i);
        }

        console.log("\n✨ Seeding completed successfully!");
    } catch (error) {
        console.error("❌ Seeding failed:", error);
    } finally {
        process.exit(0);
    }
};

seedUsers();
