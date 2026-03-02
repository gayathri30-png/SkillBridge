import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Bell } from 'lucide-react';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const role = user?.role || 'student';

  const [notifications, setNotifications] = useState([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const notifDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);

  useEffect(() => {
    if (user) {
        fetchNotifications();
        // Optional: Poll every 30s
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
      const handleClickOutside = (event) => {
          if (notifDropdownRef.current && !notifDropdownRef.current.contains(event.target)) {
              setShowNotifDropdown(false);
          }
          if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
              setShowProfileDropdown(false);
          }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
      try {
          const token = localStorage.getItem("token");
          if (!token) return;
          
          const res = await axios.get("/api/notifications", {
              headers: { Authorization: `Bearer ${token}` }
          });
          setNotifications(res.data);
          setUnreadCount(res.data.filter(n => !n.is_read).length);
      } catch (error) {
          console.error("Error fetching notifications", error);
      }
  };

  const handleMarkAsRead = async (id) => {
      try {
          const token = localStorage.getItem("token");
          await axios.put(`/api/notifications/${id}/read`, {}, {
              headers: { Authorization: `Bearer ${token}` }
          });
          // Update local state
          setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: 1 } : n));
          setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (error) {
          console.error("Error marking read", error);
      }
  };
  
  const handleMarkAllRead = async () => {
      try {
          const token = localStorage.getItem("token");
          await axios.put(`/api/notifications/read-all`, {}, {
              headers: { Authorization: `Bearer ${token}` }
          });
           setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));
           setUnreadCount(0);
      } catch (error) {
          console.error("Error marking all read", error);
      }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("storage"));
    navigate("/login");
  };

  return (
    <header className="main-header">
      <div className="header-left">
        <div className="search-bar-wrapper">
          <span className="search-icon">🔍</span>
          <input type="text" placeholder="Search internships..." className="header-search-input" />
        </div>
      </div>
      
      <div className="header-right">
        <div className="notification-bell" ref={notifDropdownRef}>
          <div className="relative cursor-pointer" onClick={() => { setShowNotifDropdown(!showNotifDropdown); setShowProfileDropdown(false); }}>
             <Bell className={`h-6 w-6 ${unreadCount > 0 ? 'text-indigo-600' : 'text-slate-500'}`} />
             {unreadCount > 0 && (
                 <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                     {unreadCount}
                 </span>
             )}
          </div>

          {showNotifDropdown && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-slate-200 z-50 overflow-hidden">
                  <div className="p-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                      <h3 className="font-semibold text-sm text-slate-700">Notifications</h3>
                      {unreadCount > 0 && (
                          <button onClick={handleMarkAllRead} className="text-xs text-indigo-600 hover:text-indigo-800">
                              Mark all read
                          </button>
                      )}
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                          <div className="p-4 text-center text-slate-500 text-sm">No notifications</div>
                      ) : (
                          notifications.map(notif => (
                              <div 
                                key={notif.id} 
                                className={`p-3 border-b border-slate-50 hover:bg-slate-50 transition-colors ${!notif.is_read ? 'bg-indigo-50/50' : ''}`}
                                onClick={() => { handleMarkAsRead(notif.id); setShowNotifDropdown(false); }}
                              >
                                  <div className="flex justify-between items-start">
                                    <p className="text-sm text-slate-800">{notif.message}</p>
                                    {!notif.is_read && <span className="h-2 w-2 bg-indigo-500 rounded-full mt-1.5 flex-shrink-0"></span>}
                                  </div>
                                  <span className="text-xs text-slate-400 mt-1 block">
                                      {new Date(notif.created_at).toLocaleDateString()}
                                  </span>
                              </div>
                          ))
                      )}
                  </div>
                  <button 
                    onClick={() => { navigate('/notifications'); setShowNotifDropdown(false); }}
                    className="w-full py-3 bg-slate-50 text-indigo-600 text-sm font-bold hover:bg-slate-100 border-t border-slate-100 transition-colors"
                  >
                    View All Notifications
                  </button>
              </div>
          )}
        </div>
        
        <div className="header-user-profile" ref={profileDropdownRef}>
          <div className="header-avatar" onClick={() => { setShowProfileDropdown(!showProfileDropdown); setShowNotifDropdown(false); }}>
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="header-user-info" onClick={() => { setShowProfileDropdown(!showProfileDropdown); setShowNotifDropdown(false); }}>
            <span className="header-user-name">{user?.name}</span>
            <span className="header-user-role">{role}</span>
          </div>
          
          {showProfileDropdown && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-200 z-50 py-1">
              <button 
                onClick={() => navigate('/profile')} 
                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                Profile Settings
              </button>
              <div className="h-px bg-slate-100 my-1"></div>
              <button 
                onClick={handleLogout} 
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <span>🚪</span> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
