
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const role = user?.role || 'student';

  return (
    <header className="main-header glass">
      <div className="header-left">
        <div className="search-bar-wrapper">
          <span className="search-icon">🔍</span>
          <input type="text" placeholder="Search internships, jobs, skills..." className="header-search-input" />
        </div>
      </div>
      
      <div className="header-right">
        <div className="notification-bell">
          <span>🔔</span>
          <span className="notification-dot"></span>
        </div>
        
        <div className="header-user-profile" onClick={() => navigate('/profile')}>
          <div className="header-avatar">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="header-user-info">
            <span className="header-user-name">{user?.name}</span>
            <span className="header-user-role chip chip-outline">{role}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
