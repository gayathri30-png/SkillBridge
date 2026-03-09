import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "./Layout.css";

function Layout({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="app-layout">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div className="sidebar-backdrop" onClick={closeSidebar}></div>
      )}
      
      <Sidebar user={user} isOpen={isSidebarOpen} onClose={closeSidebar} /> 
      
      <div className="layout-main-content">
        <div className="layout-header-wrapper">
          <Header onMenuClick={toggleSidebar} />
        </div>
        <main className="layout-page-content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;
