import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role || "student";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const menuItems = {
    student: [
      { path: "/dashboard", label: "Dashboard", icon: "📊" },
      { path: "/skills", label: "My Skills", icon: "💼" },
      { path: "/jobs", label: "Find Jobs", icon: "🔍" },
      { path: "/applications", label: "Applications", icon: "📄" },
    ],
    recruiter: [
      { path: "/dashboard", label: "Dashboard", icon: "📊" },
      { path: "/post-job", label: "Post a Job", icon: "📝" },
      { path: "/my-jobs", label: "My Jobs", icon: "💼" },
    ],
    admin: [
      { path: "/admin", label: "Dashboard", icon: "📊" },
      { path: "/admin/users", label: "Manage Users", icon: "👥" },
      { path: "/admin/jobs", label: "Manage Jobs", icon: "💼" },
    ],
  };

  const currentItems = menuItems[role] || [];

  return (
    <aside className="sidebar shadow-md">
      <div className="sidebar-branding">
        <h2 className="sidebar-logo">SkillBridge</h2>
        <span className="logo-dot">.</span>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">Main Menu</div>
        {currentItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-item ${location.pathname === item.path ? "active" : ""}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-logout-card" onClick={handleLogout}>
          <div className="logout-icon-bg">🚪</div>
          <div className="logout-text">
            <span className="logout-title">Logout</span>
            <span className="logout-subtitle">See you soon!</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

