import React from 'react'; // Force recompile
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
  CheckCircle
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ user }) => {
  const navigate = useNavigate();

  const studentLinks = [
    { title: 'Dashboard', path: '/dashboard', icon: <Home size={20} /> },
    { title: 'My Profile', path: '/profile', icon: <User size={20} /> },
    { title: 'My Skills', path: '/skills', icon: <Code size={20} /> },
    { title: 'My Portfolio', path: '/portfolio', icon: <Layout size={20} /> },
    { title: 'Find Jobs', path: '/jobs', icon: <Briefcase size={20} /> },
    { title: 'My Applications', path: '/applications', icon: <FileText size={20} /> },
    { title: 'Messages', path: '/chat', icon: <MessageSquare size={20} /> },
    { title: 'AI Hub', path: '/ai', icon: <Sparkles size={20} /> },
  ];

  const recruiterLinks = [
    { title: 'Dashboard', path: '/dashboard', icon: <Home size={20} /> },
    { title: 'Post Job', path: '/post-job', icon: <Briefcase size={20} /> },
    { title: 'My Jobs', path: '/my-jobs', icon: <FileText size={20} /> },
    { title: 'Messages', path: '/chat', icon: <MessageSquare size={20} /> },
    { title: 'AI Hub', path: '/ai', icon: <Sparkles size={20} /> },
  ];

  const adminLinks = [
    { title: 'Dashboard', path: '/admin', icon: <Home size={20} /> },
    { title: 'Users', path: '/admin/users', icon: <User size={20} /> },
    { title: 'Verify', path: '/admin/verify', icon: <CheckCircle size={20} /> },
    { title: 'Jobs', path: '/admin/jobs', icon: <Briefcase size={20} /> },
    { title: 'Applications', path: '/admin/applications', icon: <FileText size={20} /> },
    { title: 'Reports', path: '/admin/reports', icon: <Layout size={20} /> },
    { title: 'AI Workspace', path: '/ai', icon: <Sparkles size={20} /> },
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
    <div className="sidebar-container">
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
