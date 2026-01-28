import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Pages
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";

// Student Pages
import JobList from "./components/JobList";
import JobDetails from "./components/JobDetails";
import SkillsManager from "./components/SkillsManager";

// Recruiter Pages
import PostJob from "./components/PostJob";

// -------------------------------------
// 🔐 AUTH GUARD COMPONENT
// -------------------------------------
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Just check once on load
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "20px",
        }}
      >
        Loading SkillBridge...
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* ---------------- PUBLIC ROUTES ---------------- */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ---------------- PROTECTED ROUTES ---------------- */}

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Student Routes */}
        <Route
          path="/skills"
          element={
            <ProtectedRoute>
              <SkillsManager />
            </ProtectedRoute>
          }
        />

        <Route
          path="/jobs"
          element={
            <ProtectedRoute>
              <JobList />
            </ProtectedRoute>
          }
        />

        {/* IMPORTANT: /jobs MUST COME BEFORE /jobs/:id */}
        <Route
          path="/jobs/:id"
          element={
            <ProtectedRoute>
              <JobDetails />
            </ProtectedRoute>
          }
        />

        {/* Recruiter Routes */}
        <Route
          path="/post-job"
          element={
            <ProtectedRoute>
              <PostJob />
            </ProtectedRoute>
          }
        />

        {/* ---------------- DEFAULT & FALLBACK ---------------- */}

        {/* Root */}
        <Route
          path="/"
          element={
            localStorage.getItem("token") ? (
              <Navigate to="/dashboard" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
