import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import { ArrowLeft, Send, Loader2 } from 'lucide-react';
import './ChatRoom.css';

const SOCKET_URL = 'http://localhost:5001';

const ChatRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [roomInfo, setRoomInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Determine chat partner info
  const partnerName = roomInfo
    ? (user.role === 'recruiter' ? roomInfo.student_name : roomInfo.recruiter_name)
    : '';

  const getInitials = (name = '') =>
    name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  useEffect(() => {
    loadRoom();

    // Start socket
    socketRef.current = io(SOCKET_URL, { transports: ['websocket'] });
    socketRef.current.emit('join_room', roomId);

    socketRef.current.on('receive_message', (data) => {
      setMessages(prev => [...prev, data]);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadRoom = async () => {
    try {
      setLoading(true);
      // Load room info from rooms list
      const roomsRes = await axios.get('/api/chat/rooms', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const room = roomsRes.data.find(r => r.room_id === roomId);
      setRoomInfo(room || null);

      // Load message history
      const msgRes = await axios.get(`/api/chat/rooms/${roomId}/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(msgRes.data);
    } catch (err) {
      console.error('Failed to load room:', err);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = () => {
    if (!messageText.trim() || sending) return;

    const receiverId = user.role === 'recruiter' ? roomInfo?.student_id : roomInfo?.recruiter_id;

    const msgData = {
      room: roomId,
      senderId: user.id,
      receiverId,
      author: user.name,
      message: messageText.trim()
    };

    setSending(true);
    socketRef.current.emit('send_message', msgData);
    setMessageText('');
    setSending(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (ts) => {
    if (!ts) return '';
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDateLabel = (ts) => {
    if (!ts) return '';
    const d = new Date(ts);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) return 'Today';
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return d.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
  };

  // Group messages by date
  const groupedMessages = messages.reduce((groups, msg) => {
    const dateKey = msg.created_at ? new Date(msg.created_at).toDateString() : 'Unknown';
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(msg);
    return groups;
  }, {});

  if (loading) return (
    <div className="chat-room-loading">
      <Loader2 size={32} className="spin-icon" />
      <p>Loading conversation...</p>
    </div>
  );

  return (
    <div className="chat-room-page">
      {/* Header */}
      <div className="chat-room-header">
        <button className="back-btn-chat" onClick={() => navigate('/chat')}>
          <ArrowLeft size={20} />
        </button>
        <div className="chat-room-avatar">
          {getInitials(partnerName)}
        </div>
        <div className="chat-room-partner-info">
          <h2>{partnerName}</h2>
          {roomInfo?.job_title && (
            <p>Re: <span className="job-title-tag">{roomInfo.job_title}</span></p>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="messages-container">
        {Object.keys(groupedMessages).length === 0 ? (
          <div className="empty-messages-state">
            <div className="wave-emoji">👋</div>
            <h3>Start the conversation!</h3>
            <p>Introduce yourself and ask about the opportunity.</p>
          </div>
        ) : (
          Object.entries(groupedMessages).map(([dateKey, msgs]) => (
            <div key={dateKey}>
              <div className="date-divider">
                <span>{formatDateLabel(msgs[0].created_at)}</span>
              </div>
              {msgs.map((msg, i) => {
                const isMine = Number(msg.senderId || msg.sender_id) === Number(user.id);
                return (
                  <div key={i} className={`message-row ${isMine ? 'mine' : 'theirs'}`}>
                    {!isMine && (
                      <div className="bubble-avatar">{getInitials(msg.sender_name || partnerName)}</div>
                    )}
                    <div className={`message-bubble ${isMine ? 'bubble-mine' : 'bubble-theirs'}`}>
                      <p>{msg.message}</p>
                      <span className="msg-time">{formatTime(msg.created_at)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="chat-input-bar">
        <textarea
          ref={inputRef}
          className="chat-input"
          placeholder="Type a message... (Enter to send)"
          value={messageText}
          onChange={e => setMessageText(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
        />
        <button
          className={`send-btn ${messageText.trim() ? 'active' : ''}`}
          onClick={sendMessage}
          disabled={!messageText.trim() || sending}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
