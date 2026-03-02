import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MessageSquare, Search, Clock, ChevronRight, Inbox } from 'lucide-react';
import './ChatList.css';

const ChatList = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/chat/rooms', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRooms(res.data);
    } catch (err) {
      console.error('Failed to load chats:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (ts) => {
    if (!ts) return '';
    const d = new Date(ts);
    const now = new Date();
    const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (diffDays === 1) return 'Yesterday';
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const getOtherName = (room) =>
    user.role === 'recruiter' ? room.student_name : room.recruiter_name;

  const getInitials = (name = '') =>
    name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const filtered = rooms.filter(r =>
    getOtherName(r)?.toLowerCase().includes(search.toLowerCase()) ||
    r.job_title?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="chat-list-page">
      <div className="chat-list-loading">
        <MessageSquare size={40} className="pulse-icon" />
        <p>Loading conversations...</p>
      </div>
    </div>
  );

  return (
    <div className="chat-list-page">
      {/* Header */}
      <div className="chat-list-header">
        <div className="header-title">
          <MessageSquare size={24} />
          <h1>Messages</h1>
          {rooms.filter(r => r.unread_count > 0).length > 0 && (
            <span className="total-unread-badge">
              {rooms.reduce((sum, r) => sum + Number(r.unread_count), 0)}
            </span>
          )}
        </div>
        <div className="search-bar-chat">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search conversations..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Rooms List */}
      <div className="rooms-list">
        {filtered.length === 0 ? (
          <div className="empty-chat-state">
            <Inbox size={56} />
            <h3>No conversations yet</h3>
            <p>When you apply to jobs or receive applicants, your chats will appear here.</p>
          </div>
        ) : (
          filtered.map(room => (
            <div
              key={room.room_id}
              className={`room-item ${room.unread_count > 0 ? 'unread' : ''}`}
              onClick={() => navigate(`/chat/${room.room_id}`)}
            >
              <div className="room-avatar">
                <span>{getInitials(getOtherName(room))}</span>
                {room.unread_count > 0 && (
                  <span className="unread-dot">{room.unread_count}</span>
                )}
              </div>
              <div className="room-info">
                <div className="room-info-top">
                  <h3 className="contact-name">{getOtherName(room)}</h3>
                  <span className="room-time">
                    <Clock size={11} />
                    {formatTime(room.last_message_at || room.created_at)}
                  </span>
                </div>
                <p className="room-job-title">{room.job_title}</p>
                <p className="room-last-msg">
                  {room.last_message || <span className="no-msg-yet">Start the conversation →</span>}
                </p>
              </div>
              <ChevronRight size={16} className="room-arrow" />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatList;
