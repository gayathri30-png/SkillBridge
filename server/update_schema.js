import { createConnection } from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const updateSchema = async () => {
    try {
        const connection = await createConnection({
            host: process.env.DB_HOST || "localhost",
            user: process.env.DB_USER || "root",
            password: process.env.DB_PASSWORD || "",
            database: process.env.DB_NAME || "skillbridge"
        });

        // Check columns
        const [columns] = await connection.query("SHOW COLUMNS FROM users");
        const columnNames = columns.map(c => c.Field);

        if (!columnNames.includes('portfolio_url')) {
            await connection.query("ALTER TABLE users ADD COLUMN portfolio_url TEXT");
            console.log("✅ Added portfolio_url column");
        }

        if (!columnNames.includes('github_url')) {
            await connection.query("ALTER TABLE users ADD COLUMN github_url TEXT");
            console.log("✅ Added github_url column");
        }

        if (!columnNames.includes('resume_url')) {
            await connection.query("ALTER TABLE users ADD COLUMN resume_url TEXT");
            console.log("✅ Added resume_url column");
        }
        
        console.log("Schema check complete.");
        process.exit(0);

    } catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
};

updateSchema();
