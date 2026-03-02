import db from "../config/db.js";

const initAdminDb = () => {
    console.log("🔧 Initializing Admin Data Stores...");

    const queries = [
        // 1. Ensure is_verified exists in users
        "ALTER TABLE users MODIFY COLUMN is_verified TINYINT(1) DEFAULT 0",
        // 2. Create notifications table
        `CREATE TABLE IF NOT EXISTS notifications (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NULL, 
      title VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      type ENUM('info', 'warning', 'success', 'urgent') DEFAULT 'info',
      is_read TINYINT(1) DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`
    ];

    let completed = 0;
    queries.forEach(q => {
        db.query(q, (err) => {
            if (err && err.code !== 'ER_DUP_FIELDNAME') {
                console.error("❌ Error executing query:", err.message);
            } else {
                console.log(`✅ Query finished successfully (or was duplicate).`);
            }
            completed++;
            if (completed === queries.length) {
                console.log("🎉 Admin database initialization complete.");
                process.exit();
            }
        });
    });
};

initAdminDb();
