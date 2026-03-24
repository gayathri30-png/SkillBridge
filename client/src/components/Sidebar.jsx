import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, 
  User, 
  Settings, 
  LogOut, 
  Briefcase, 
  FileText, 
  MessageSquare, 
  Sparkles, 
  Layout,
  Code,
  CheckCircle,
  X,
  Plus,
  Bell
} from 'lucide-react';
import axios from 'axios';
import './Sidebar.css';

const Sidebar = ({ user, isOpen, onClose }) => {
  const navigate = useNavigate();
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [unreadNotifs, setUnreadNotifs] = useState(0);

  useEffect(() => {
    if (user) {
      fetchCounts();
      const interval = setInterval(fetchCounts, 10000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchCounts = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const headers = { headers: { Authorization: `Bearer ${token}` } };

      const [msgRes, notifRes] = await Promise.all([
        axios.get('/api/chat/unread-count', headers).catch(() => ({ data: { unread_count: 0 } })),
        axios.get('/api/notifications/unread-count', headers).catch(() => ({ data: { unread_count: 0 } })),
      ]);
      setUnreadMessages(msgRes.data.unread_count || 0);
      setUnreadNotifs(notifRes.data.unread_count || 0);
    } catch (err) {
      // silent
    }
  };

  const studentLinks = [
    { title: 'Dashboard', path: '/dashboard', icon: <Home size={20} /> },
    { title: 'My Profile', path: '/profile', icon: <User size={20} /> },
    { title: 'My Skills', path: '/skills', icon: <Code size={20} /> },
    { title: 'Find Jobs', path: '/jobs', icon: <Briefcase size={20} /> },
    { title: 'My Applications', path: '/applications', icon: <FileText size={20} /> },
    { title: 'Messages', path: '/chat', icon: <MessageSquare size={20} />, badge: unreadMessages > 0 ? unreadMessages : null },
    { title: 'Notifications', path: '/notifications', icon: <Bell size={20} />, badge: unreadNotifs > 0 ? unreadNotifs : null },
    { title: 'Skill Gap', path: '/ai/skill-gap', icon: <Sparkles size={20} /> },
  ];

  const recruiterLinks = [
    { title: 'Dashboard', path: '/dashboard', icon: <Home size={20} /> },
    { title: 'Pipeline', path: '/my-jobs', icon: <Briefcase size={20} /> },
    { title: 'Post Job', path: '/post-job', icon: <Plus size={20} /> },
    { title: 'Messages', path: '/chat', icon: <MessageSquare size={20} />, badge: unreadMessages > 0 ? unreadMessages : null },
    { title: 'Notifications', path: '/notifications', icon: <Bell size={20} />, badge: unreadNotifs > 0 ? unreadNotifs : null },
  ];

  const adminLinks = [
    { title: 'Dashboard', path: '/admin', icon: <Home size={20} /> },
    { title: 'Users', path: '/admin/users', icon: <User size={20} /> },
    { title: 'Verify', path: '/admin/verify', icon: <CheckCircle size={20} /> },
    { title: 'Jobs', path: '/admin/jobs', icon: <Briefcase size={20} /> },
    { title: 'Applications', path: '/admin/applications', icon: <FileText size={20} /> },
    { title: 'Reports', path: '/admin/reports', icon: <Layout size={20} /> },
    { title: 'Notifications', path: '/notifications', icon: <Bell size={20} />, badge: unreadNotifs > 0 ? unreadNotifs : null },
  ];

  let navLinks = studentLinks;
  if (user?.role === 'recruiter') navLinks = recruiterLinks;
  if (user?.role === 'admin') navLinks = adminLinks;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };


  return (
    <div className={`sidebar-container ${isOpen ? 'open' : ''}`}>
      {/* Mobile Close Button */}
      <button className="sidebar-close-btn" onClick={onClose}>
        <X size={24} />
      </button>

      {/* 1. Logo */}
      <div className="sidebar-logo">
        <Sparkles size={24} className="text-[#0057D9]" fill="currentColor" />
        <span className="logo-text">SkillBridge</span>
      </div>


      {/* 3. Navigation Links */}
      <nav className="sidebar-nav">
        {navLinks.map((link, index) => (
          <NavLink
            key={index}
            to={link.path}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">{link.icon}</span>
            <span className="nav-title">{link.title}</span>
            {link.badge && <span className="nav-badge">{link.badge}</span>}
          </NavLink>
        ))}
      </nav>

      {/* 4. Footer Actions */}
      <div className="sidebar-footer">
        <button className="nav-link w-full text-left" onClick={() => navigate('/settings')}>
          <span className="nav-icon"><Settings size={20} /></span>
          <span className="nav-title">Settings</span>
        </button>
        <button className="nav-link logout-btn w-full text-left" onClick={handleLogout}>
          <span className="nav-icon"><LogOut size={20} /></span>
          <span className="nav-title">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
