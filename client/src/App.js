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
import Profile from "./pages/Profile";
import PublicProfile from "./pages/PublicProfile";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Notifications from "./pages/Notifications";
import Portfolio from "./pages/Portfolio";

// Student Pages
import JobList from "./components/JobList";
import JobDetails from "./components/JobDetails";
import SkillsManager from "./components/SkillsManager";
import ApplicationsList from "./components/ApplicationsList";
import SkillGapAnalysis from "./pages/SkillGapAnalysis";
import ChatList from "./pages/ChatList";
import ChatRoom from "./pages/ChatRoom";
import OfferLetter from "./pages/OfferLetter";
import OfferAccepted from "./pages/OfferAccepted";
import OnboardingChecklist from "./pages/OnboardingChecklist";
import AIDashboard from './pages/AIDashboard';
import AIPortfolioAnalyzer from './pages/AIPortfolioAnalyzer';
import AISkillGapDetector from './pages/AISkillGapDetector';
import AIProposalGenerator from './pages/AIProposalGenerator';

// Recruiter Pages
import PostJob from "./components/PostJob";
import RecruiterJobs from "./components/RecruiterJobs";
import RecruiterApplicants from "./components/RecruiterApplicants";
import RecruiterAIDashboard from "./pages/RecruiterAIDashboard";

// Admin Pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./components/AdminUsers";
import AdminJobs from "./components/AdminJobs";
import AdminApplications from "./components/AdminApplications";
import AdminVerify from "./components/AdminVerify";
import AdminReports from "./pages/Reports";
import AIWorkspace from "./pages/AIWorkspace";

// -------------------------------------
// 🔐 AUTH GUARD COMPONENT
// -------------------------------------
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  
  if (!token) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Redirect to their respective dashboards if they hit the wrong area
    if (user?.role === "admin") return <Navigate to="/admin" />;
    return <Navigate to="/dashboard" />;
  }

  return children;
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
              <ProtectedRoute allowedRoles={["student", "recruiter", "admin"]}>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={["student", "recruiter", "admin"]}>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile/:id"
            element={
                <Layout>
                  <PublicProfile />
                </Layout>
            }
          />

          {/* Student Routes */}
          <Route
            path="/skills"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <Layout>
                  <SkillsManager />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Module 12: AI Hub Routes */}
          <Route
            path="/ai"
            element={
              <ProtectedRoute allowedRoles={["student", "recruiter", "admin"]}>
                <Layout>
                  {JSON.parse(localStorage.getItem('user'))?.role === 'recruiter' ? (
                     <RecruiterAIDashboard />
                  ) : JSON.parse(localStorage.getItem('user'))?.role === 'admin' ? (
                     <AIWorkspace />
                  ) : (
                     <AIDashboard />
                  )}
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai/portfolio"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <Layout>
                  <AIPortfolioAnalyzer />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai/skill-gap"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <Layout>
                  <AISkillGapDetector />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/portfolio"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <Layout>
                  <Portfolio />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai/proposals"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <Layout>
                  <AIProposalGenerator />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/jobs"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <Layout>
                  <JobList />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/applications"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <Layout>
                  <ApplicationsList />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/jobs/:id"
            element={
              <ProtectedRoute allowedRoles={["student", "recruiter", "admin"]}>
                <Layout>
                  <JobDetails />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/skill-gap/:jobId"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <Layout>
                   <SkillGapAnalysis />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/chat"
            element={
              <ProtectedRoute allowedRoles={["student", "recruiter"]}>
                <Layout>
                  <ChatList />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/chat/:roomId"
            element={
              <ProtectedRoute allowedRoles={["student", "recruiter"]}>
                <Layout>
                  <ChatRoom />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/notifications"
            element={
              <ProtectedRoute allowedRoles={["student", "recruiter", "admin"]}>
                <Layout>
                  <Notifications />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/offer/:id"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <Layout>
                  <OfferLetter />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/offer-accepted/:id"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <Layout>
                  <OfferAccepted />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/onboarding/:id"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <Layout>
                  <OnboardingChecklist />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Recruiter Routes */}
          <Route
            path="/post-job"
            element={
              <ProtectedRoute allowedRoles={["recruiter", "admin"]}>
                <Layout>
                  <PostJob />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-jobs"
            element={
              <ProtectedRoute allowedRoles={["recruiter", "admin"]}>
                <Layout>
                  <RecruiterJobs />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/jobs/:jobId/applicants"
            element={
              <ProtectedRoute allowedRoles={["recruiter", "admin"]}>
                <Layout>
                  <RecruiterApplicants />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Layout>
                  <AdminDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Layout>
                  <AdminUsers />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/verify"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Layout>
                  <AdminVerify />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/jobs"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Layout>
                  <AdminJobs />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/applications"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Layout>
                  <AdminApplications />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Layout>
                  <AdminReports />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* AI Workspace - Specialized Layout (No Main Sidebar) */}
          <Route
            path="/ai"
            element={
              <ProtectedRoute allowedRoles={["admin", "recruiter"]}>
                  <AIWorkspace />
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
