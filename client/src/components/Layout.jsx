import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "./Layout.css";

function Layout({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="app-layout">
      <Sidebar user={user} /> 
      
      <div className="layout-main-content">
        <div className="layout-header-wrapper">
          <Header />
        </div>
        <main className="layout-page-content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;
