import mysql from "mysql2/promise";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

async function migrate() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "skillbridge",
  });

  console.log("🚀 Starting Profile Redesign Migration...");

  // 1. Portfolio Items Table
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS portfolio_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      image_url VARCHAR(255),
      link_url VARCHAR(255),
      type ENUM('project', 'certificate') DEFAULT 'project',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
  console.log("✅ Table 'portfolio_items' ready.");

  // 2. Reviews Table
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS reviews (
      id INT AUTO_INCREMENT PRIMARY KEY,
      student_id INT NOT NULL,
      recruiter_id INT NOT NULL,
      rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
      comment TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (recruiter_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
  console.log("✅ Table 'reviews' ready.");

  // 3. Add endorsements to user_skills
  const [columns] = await connection.execute("DESCRIBE user_skills");
  const columnNames = columns.map(c => c.Field);

  if (!columnNames.includes("endorsements")) {
    await connection.execute("ALTER TABLE user_skills ADD COLUMN endorsements INT DEFAULT 0");
    console.log("✅ Column 'endorsements' added to 'user_skills'.");
  } else {
    console.log("ℹ️ Column 'endorsements' already exists in 'user_skills'.");
  }

  // 4. Add years_of_experience to user_skills (from mockup)
  if (!columnNames.includes("years_of_experience")) {
    await connection.execute("ALTER TABLE user_skills ADD COLUMN years_of_experience INT DEFAULT 0");
    console.log("✅ Column 'years_of_experience' added to 'user_skills'.");
  }

  await connection.end();
  console.log("🏁 Migration completed successfully!");
}

migrate().catch(err => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
