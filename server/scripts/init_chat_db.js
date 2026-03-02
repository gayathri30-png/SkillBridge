import db from "../config/db.js";

const createMessagesTable = async () => {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        room_id VARCHAR(255) NOT NULL,
        sender_id INT NOT NULL,
        receiver_id INT NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await db.query(query);
    console.log("✅ Messages table created or already exists.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating messages table:", error);
    process.exit(1);
  }
};

createMessagesTable();
