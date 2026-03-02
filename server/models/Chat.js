import db from "../config/db.js";

// Chat Table Schema (ensure this table exists)
/*
CREATE TABLE IF NOT EXISTS messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  room_id VARCHAR(255) NOT NULL,
  sender_id INT NOT NULL,
  receiver_id INT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
*/

export const createMessage = async (roomId, senderId, receiverId, message) => {
  const query = `
    INSERT INTO messages (room_id, sender_id, receiver_id, message)
    VALUES (?, ?, ?, ?)
  `;
  const [result] = await db.query(query, [roomId, senderId, receiverId, message]);
  return result.insertId;
};

export const getMessagesByRoom = async (roomId) => {
  const query = `
    SELECT m.*, u.name as sender_name 
    FROM messages m
    JOIN users u ON m.sender_id = u.id
    WHERE m.room_id = ?
    ORDER BY m.created_at ASC
  `;
  const [messages] = await db.query(query, [roomId]);
  return messages;
};
