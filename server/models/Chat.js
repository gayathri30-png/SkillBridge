import db from "../config/db.js";

export const createMessage = async (roomId, senderId, receiverId, message) => {
  const query = `
    INSERT INTO messages (room_id, sender_id, receiver_id, message, is_read)
    VALUES (?, ?, ?, ?, 0)
  `;
  const [result] = await db.promise().query(query, [roomId, senderId, receiverId, message]);
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
  const [messages] = await db.promise().query(query, [roomId]);
  return messages;
};
