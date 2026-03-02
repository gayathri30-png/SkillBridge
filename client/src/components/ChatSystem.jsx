import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import "./ChatSystem.css";

const socket = io("http://localhost:5001");

const ChatSystem = ({ currentUser, chatPartnerId, chatPartnerName, roomId, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (roomId) {
        socket.emit("join_room", roomId);
    }

    // Listen for messages
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    // Listen for history
    socket.on("receive_history", (history) => {
        setMessages(history);
    });

    return () => {
      socket.off("receive_message");
      socket.off("receive_history");
    };
  }, [roomId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: roomId,
        senderId: currentUser.id || currentUser.user_id,
        receiverId: chatPartnerId,
        author: currentUser.name,
        message: currentMessage,
        created_at: new Date().toISOString(), // Optimistic update
      };

      await socket.emit("send_message", messageData);
      // setMessages((prev) => [...prev, messageData]); // Socket broadcasts back to sender too
      setCurrentMessage("");
    }
  };

  return (
    <div className="chat-window shadow-xl">
      <div className="chat-header bg-primary text-white p-3 flex justify-between items-center rounded-t-lg">
        <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-success rounded-full"></span>
            <span className="font-bold">{chatPartnerName || "Chat"}</span>
        </div>
        <button onClick={onClose} className="text-white hover:text-slate-200">✕</button>
      </div>
      
      <div className="chat-body p-4 bg-slate-50 h-[300px] overflow-y-auto">
        {messages.map((msg, index) => {
            const isMe = msg.senderId === (currentUser.id || currentUser.user_id) || msg.author === currentUser.name;
            return (
                <div key={index} className={`message-container flex ${isMe ? "justify-end" : "justify-start"} mb-3`}>
                    <div className={`message-bubble max-w-[80%] p-3 rounded-lg text-sm ${isMe ? "bg-primary text-white rounded-br-none" : "bg-white border text-slate-700 rounded-bl-none"}`}>
                        <p className="m-0">{msg.message}</p>
                        <span className={`text-[10px] block mt-1 ${isMe ? "text-blue-100" : "text-slate-400"}`}>
                            {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                    </div>
                </div>
            );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-footer p-3 bg-white border-t flex gap-2">
        <input
          type="text"
          value={currentMessage}
          placeholder="Type a message..."
          className="flex-1 input-field text-sm"
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage} className="btn btn-primary btn-sm px-4">➤</button>
      </div>
    </div>
  );
};

export default ChatSystem;
