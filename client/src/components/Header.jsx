import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Bell, Menu } from 'lucide-react';
import './Header.css';

const Header = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const role = user?.role || 'student';

  const [notifications, setNotifications] = useState([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const notifDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    if (user) {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 10000);
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
          
          const res = await axios.get("/api/notifications", getAuthHeaders());
          const fetchedNotifications = res.data;
          setNotifications(fetchedNotifications);
          setUnreadCount(fetchedNotifications.filter(n => !n.is_read || n.is_read === 0).length);
      } catch (error) {
          console.error("Error fetching notifications", error);
      }
  };

  const handleMarkAsRead = async (id) => {
      try {
          await axios.put(`/api/notifications/${id}/read`, {}, getAuthHeaders());
          setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: 1 } : n));
          setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (error) {
          console.error("Error marking read", error);
      }
  };
  
  const handleMarkAllRead = async () => {
      try {
          await axios.put(`/api/notifications/read-all`, {}, getAuthHeaders());
           setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));
           setUnreadCount(0);
      } catch (error) {
          console.error("Error marking all read", error);
      }
  };

  const handleNotifClick = (notif) => {
      handleMarkAsRead(notif.id);
      setShowNotifDropdown(false);
      if (notif.type === 'message') navigate('/chat');
      else if (notif.type === 'application') navigate('/my-jobs');
      else if (notif.type === 'status_update') navigate('/applications');
      else if (notif.type === 'offer_accepted') navigate('/my-jobs');
      else if (notif.type === 'account_verified') navigate('/dashboard');
      else navigate('/notifications');
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
        <button className="mobile-menu-btn" onClick={onMenuClick}>
          <Menu size={24} />
        </button>
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
                     {unreadCount > 9 ? '9+' : unreadCount}
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
                          <div className="p-4 text-center text-slate-500 text-sm">No notifications yet.</div>
                      ) : (
                          notifications.slice(0, 10).map(notif => {
                              const isNotifUnread = !notif.is_read || notif.is_read === 0;
                              return (
                                <div 
                                  key={notif.id} 
                                  className={`p-3 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer ${isNotifUnread ? 'bg-indigo-50/50' : ''}`}
                                  onClick={() => handleNotifClick(notif)}
                                >
                                    <div className="flex justify-between items-start">
                                      <p className={`text-sm ${isNotifUnread ? 'text-slate-800 font-semibold' : 'text-slate-600'}`}>{notif.message}</p>
                                      {isNotifUnread && <span className="h-2 w-2 bg-indigo-500 rounded-full mt-1.5 flex-shrink-0"></span>}
                                    </div>
                                    <div className="flex justify-between items-center mt-1">
                                      <span className="text-[10px] text-slate-400 capitalize">{(notif.type || '').replace(/_/g, ' ')}</span>
                                      <span className="text-xs text-slate-400">
                                          {new Date(notif.created_at).toLocaleDateString()}
                                      </span>
                                    </div>
                                </div>
                              );
                          })
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
