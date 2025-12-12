import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import SkillsManager from "./components/SkillsManager";
import JobList from "./components/JobList";
import JobDetails from "./components/JobDetails";
import PostJob from "./components/PostJob"; // This line should exist

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      console.log("🔍 App.js checking auth. Token exists:", !!token);
      setIsAuthenticated(!!token);
      setLoading(false);
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div>Loading SkillBridge...</div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />

        <Route
          path="/skills"
          element={
            isAuthenticated ? <SkillsManager /> : <Navigate to="/login" />
          }
        />

        {/* Job routes */}
        <Route
          path="/jobs"
          element={isAuthenticated ? <JobList /> : <Navigate to="/login" />}
        />

        <Route
          path="/jobs/:id"
          element={isAuthenticated ? <JobDetails /> : <Navigate to="/login" />}
        />

        <Route
          path="/post-job"
          element={isAuthenticated ? <PostJob /> : <Navigate to="/login" />}
        />

        {/* Default route */}
        <Route
          path="/"
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />}
        />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
