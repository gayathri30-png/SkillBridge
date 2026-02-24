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
import LandingPage from "./pages/LandingPage";
import Layout from "./components/Layout";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// Student Pages
import JobList from "./components/JobList";
import JobDetails from "./components/JobDetails";
import SkillsManager from "./components/SkillsManager";
import ApplicationsList from "./components/ApplicationsList";

// Recruiter Pages
import PostJob from "./components/PostJob";
import RecruiterJobs from "./components/RecruiterJobs";
import RecruiterApplicants from "./components/RecruiterApplicants";

// Admin Pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./components/AdminUsers";
import AdminJobs from "./components/AdminJobs";
import AdminApplications from "./components/AdminApplications";
import AdminNotifications from "./components/AdminNotifications";
import AdminReports from "./components/AdminReports";
import AdminSkills from "./components/AdminSkills";
import AdminSettings from "./components/AdminSettings";

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
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* ---------------- PROTECTED ROUTES ---------------- */}

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Student Routes */}
        <Route
          path="/skills"
          element={
            <ProtectedRoute>
              <Layout>
                <SkillsManager />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/jobs"
          element={
            <ProtectedRoute>
              <Layout>
                <JobList />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/applications"
          element={
            <ProtectedRoute>
              <Layout>
                <ApplicationsList />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* IMPORTANT: /jobs MUST COME BEFORE /jobs/:id */}
        <Route
          path="/jobs/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <JobDetails />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Recruiter Routes */}
        <Route
          path="/post-job"
          element={
            <ProtectedRoute>
              <Layout>
                <PostJob />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-jobs"
          element={
            <ProtectedRoute>
              <Layout>
                <RecruiterJobs />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/jobs/:jobId/applicants"
          element={
            <ProtectedRoute>
              <Layout>
                <RecruiterApplicants />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Layout>
                <AdminDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <Layout>
                <AdminUsers />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/jobs"
          element={
            <ProtectedRoute>
              <Layout>
                <AdminJobs />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/applications"
          element={
            <ProtectedRoute>
              <Layout>
                <AdminApplications />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/notifications"
          element={
            <ProtectedRoute>
              <Layout>
                <AdminNotifications />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute>
              <Layout>
                <AdminReports />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/skills"
          element={
            <ProtectedRoute>
              <Layout>
                <AdminSkills />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute>
              <Layout>
                <AdminSettings />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* ---------------- DEFAULT & FALLBACK ---------------- */}
        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
