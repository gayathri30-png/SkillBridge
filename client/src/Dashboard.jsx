import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [userSkills, setUserSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]); // Add jobs state
  const [stats, setStats] = useState({
    totalSkills: 0,
    profileComplete: 100,
    applications: 0,
    recruiterJobs: 0, // Add recruiter jobs count
  });
  const navigate = useNavigate();

  // Add this function to fetch all jobs - using useCallback to prevent infinite re-renders
  const fetchAllJobs = useCallback(
    async (token) => {
      try {
        console.log("🔄 Fetching all jobs...");
        const response = await axios.get("http://localhost:5000/api/jobs", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("📊 All jobs loaded:", response.data);
        setJobs(response.data);

        // Update recruiter jobs count if user is recruiter
        if (user?.role === "recruiter") {
          const recruiterJobs = response.data.filter(
            (job) => Number(job.posted_by) === Number(user.id)
          );
          console.log("👤 Recruiter's jobs:", recruiterJobs.length);
          setStats((prev) => ({
            ...prev,
            recruiterJobs: recruiterJobs.length,
          }));
        }
      } catch (error) {
        console.error("❌ Error fetching jobs:", error);
      }
    },
    [user?.role, user?.id]
  ); // Add dependencies

  const fetchUserSkills = useCallback(async (token, userId) => {
    try {
      setLoading(true);
      console.log("🔄 Fetching user skills...");
      const response = await axios.get(
        `http://localhost:5000/api/skills/my-skills`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("✅ Skills loaded:", response.data.length, "skills");
      setUserSkills(response.data);
      setStats((prev) => ({ ...prev, totalSkills: response.data.length }));
    } catch (error) {
      console.error("❌ Error fetching skills:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Remove unused fetchRecruiterStats function since it's not being used
  // const fetchRecruiterStats = async (token) => {
  //   try {
  //     console.log("🔄 Fetching recruiter stats...");
  //   } catch (error) {
  //     console.error("Error fetching recruiter stats:", error);
  //   }
  // };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    console.log("📊 Dashboard loading...");
    console.log("Token exists:", !!token);
    console.log("User exists:", !!savedUser);

    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        console.log("✅ User loaded:", userData);
        setUser(userData);
        fetchUserSkills(token, userData.id);
        fetchAllJobs(token); // Fetch all jobs
      } catch (error) {
        console.error("❌ Error parsing user data:", error);
        navigate("/login");
      }
    } else {
      console.log("❌ No auth data, redirecting to login");
      navigate("/login");
    }
  }, [navigate, fetchUserSkills, fetchAllJobs]); // Add dependencies

  const handleLogout = () => {
    console.log("👋 Logging out...");
    localStorage.clear();
    navigate("/login");
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  // Calculate recruiter's jobs
  const recruiterJobs =
    user?.role === "recruiter"
      ? jobs.filter((job) => {
          const match = Number(job.posted_by) === Number(user.id);
          console.log(
            `Comparing: job.posted_by=${
              job.posted_by
            } (${typeof job.posted_by}) vs user.id=${
              user.id
            } (${typeof user.id}) => ${match}`
          );
          return match;
        })
      : [];

  // Debug logging
  console.log("=== DASHBOARD DEBUG ===");
  console.log("User:", user);
  console.log("User ID:", user?.id, "Type:", typeof user?.id);
  console.log("All jobs:", jobs.length);
  console.log("Recruiter jobs:", recruiterJobs.length);
  console.log("=========================");

  if (!user) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div>Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="brand-section">
            <h1>SkillBridge</h1>
            <p className="greeting">
              {getGreeting()}! Ready to bridge your skills with opportunities?
            </p>
          </div>

          <div className="user-info">
            <div className="user-details">
              <span className="user-name">
                Welcome back, <strong>{user.name}</strong>
              </span>
              <div className="user-badges">
                <span className="user-role badge">{user.role}</span>
                {user.role === "student" && (
                  <span className="badge student-badge">🎓 Student</span>
                )}
                {user.role === "recruiter" && (
                  <span className="badge recruiter-badge">💼 Recruiter</span>
                )}
              </div>
            </div>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Quick Stats */}
        <div className="quick-stats">
          <div className="stat-card">
            <div className="stat-icon">💼</div>
            <h3>Your Skills</h3>
            <p className="stat-number">{stats.totalSkills}</p>
            <p className="stat-label">Total Skills</p>
            {stats.totalSkills === 0 && (
              <button
                className="stat-action"
                onClick={() => navigate("/skills")}
              >
                Add Your First Skill
              </button>
            )}
          </div>

          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <h3>Profile</h3>
            <p className="stat-number">{stats.profileComplete}%</p>
            <p className="stat-label">Complete</p>
            <button
              className="stat-action"
              onClick={() => navigate("/profile")}
            >
              Complete Profile
            </button>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📄</div>
            <h3>Applications</h3>
            <p className="stat-number">{stats.applications}</p>
            <p className="stat-label">Submitted</p>
            {user.role === "student" && stats.applications === 0 && (
              <button className="stat-action" onClick={() => navigate("/jobs")}>
                Browse Jobs
              </button>
            )}
          </div>

          {user.role === "recruiter" && (
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <h3>Your Jobs</h3>
              <p className="stat-number">{recruiterJobs.length}</p>
              <p className="stat-label">Posted</p>
              <button
                className="stat-action"
                onClick={() => navigate("/post-job")}
              >
                Post New Job
              </button>
            </div>
          )}
        </div>

        {/* Student Dashboard */}
        {user.role === "student" && (
          <>
            <div className="dashboard-section">
              <h2 className="section-title">Student Features</h2>
              <p className="section-subtitle">
                Everything you need to kickstart your career
              </p>

              <div className="feature-grid">
                {/* Manage Skills Card */}
                <div
                  className="feature-card"
                  onClick={() => navigate("/skills")}
                >
                  <div className="feature-icon">💼</div>
                  <div className="feature-content">
                    <h3>Manage Skills</h3>
                    <p>
                      Add, edit, or remove your skills to attract recruiters
                    </p>
                    <div className="skill-preview">
                      {loading ? (
                        <div className="loading-skills">Loading skills...</div>
                      ) : userSkills.length > 0 ? (
                        <div className="skills-list">
                          {userSkills.slice(0, 3).map((skill) => (
                            <span key={skill.id} className="skill-tag">
                              {skill.name}
                            </span>
                          ))}
                          {userSkills.length > 3 && (
                            <span className="skill-tag more-tag">
                              +{userSkills.length - 3} more
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="no-skills">
                          <p>No skills added yet</p>
                          <small>Add skills to get better job matches</small>
                        </div>
                      )}
                    </div>
                    <button className="feature-btn">Manage Skills →</button>
                  </div>
                </div>

                {/* Browse Jobs Card */}
                <div className="feature-card" onClick={() => navigate("/jobs")}>
                  <div className="feature-icon">🔍</div>
                  <div className="feature-content">
                    <h3>Browse Jobs</h3>
                    <p>Find opportunities matching your skills and interests</p>
                    <div className="job-preview">
                      <div className="job-stats">
                        <span className="stat-item">
                          🎯 Skill-based matches
                        </span>
                        <span className="stat-item">💰 Competitive pay</span>
                        <span className="stat-item">🚀 Quick apply</span>
                      </div>
                    </div>
                    <button className="feature-btn">Browse Jobs →</button>
                  </div>
                </div>

                {/* My Applications Card */}
                <div
                  className="feature-card"
                  onClick={() => navigate("/applications")}
                >
                  <div className="feature-icon">📄</div>
                  <div className="feature-content">
                    <h3>My Applications</h3>
                    <p>Track your job applications and status updates</p>
                    <div className="applications-preview">
                      {stats.applications === 0 ? (
                        <div className="no-applications">
                          <p>No applications yet</p>
                          <small>Apply to jobs to track progress</small>
                        </div>
                      ) : (
                        <div className="applications-stats">
                          <div className="app-stat pending">Pending: 0</div>
                          <div className="app-stat reviewed">Reviewed: 0</div>
                          <div className="app-stat accepted">Accepted: 0</div>
                        </div>
                      )}
                    </div>
                    <button className="feature-btn">View Applications →</button>
                  </div>
                </div>

                {/* AI Recommendations Card */}
                <div
                  className="feature-card"
                  onClick={() => navigate("/recommendations")}
                >
                  <div className="feature-icon">🤖</div>
                  <div className="feature-content">
                    <h3>AI Recommendations</h3>
                    <p>Get personalized job matches based on your skills</p>
                    <div className="ai-preview">
                      <div className="ai-benefits">
                        <span className="benefit">🎯 Personalized</span>
                        <span className="benefit">⚡ Instant</span>
                        <span className="benefit">📈 Smart matches</span>
                      </div>
                    </div>
                    <button className="feature-btn">View Matches →</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions-section">
              <h2 className="section-title">Quick Actions</h2>
              <div className="action-buttons">
                <button
                  className="action-btn primary"
                  onClick={() => navigate("/skills")}
                >
                  <span className="action-icon">➕</span>
                  Add New Skill
                </button>
                <button
                  className="action-btn"
                  onClick={() => navigate("/jobs")}
                >
                  <span className="action-icon">🔍</span>
                  Search Jobs
                </button>
                <button
                  className="action-btn"
                  onClick={() => navigate("/profile")}
                >
                  <span className="action-icon">👤</span>
                  Update Profile
                </button>
                <button
                  className="action-btn"
                  onClick={() => navigate("/resume")}
                >
                  <span className="action-icon">📄</span>
                  Upload Resume
                </button>
                <button
                  className="action-btn"
                  onClick={() => navigate("/portfolio")}
                >
                  <span className="action-icon">🎨</span>
                  Upload Portfolio
                </button>
                <button
                  className="action-btn"
                  onClick={() => navigate("/settings")}
                >
                  <span className="action-icon">⚙️</span>
                  Settings
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="recent-activity">
              <h2 className="section-title">Recent Activity</h2>
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-icon">🎯</div>
                  <div className="activity-content">
                    <p>
                      <strong>Complete your profile</strong> to get better job
                      recommendations
                    </p>
                    <span className="activity-time">Just now</span>
                  </div>
                  <button
                    className="activity-action"
                    onClick={() => navigate("/profile")}
                  >
                    Complete
                  </button>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">💼</div>
                  <div className="activity-content">
                    <p>
                      <strong>Add your first skill</strong> to start matching
                      with jobs
                    </p>
                    <span className="activity-time">Pending</span>
                  </div>
                  <button
                    className="activity-action"
                    onClick={() => navigate("/skills")}
                  >
                    Add Skill
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Recruiter Dashboard */}
        {user.role === "recruiter" && (
          <>
            <div className="dashboard-section">
              <h2 className="section-title">Recruiter Hub</h2>
              <p className="section-subtitle">
                Find and connect with talented students
              </p>

              {/* Debug info */}
              <div className="debug-info">
                <p>
                  User ID: {user.id} | Total jobs in system: {jobs.length} |
                  Your jobs: {recruiterJobs.length}
                </p>
              </div>

              <div className="feature-grid">
                <div
                  className="feature-card"
                  onClick={() => navigate("/post-job")}
                >
                  <div className="feature-icon">📝</div>
                  <div className="feature-content">
                    <h3>Post Job</h3>
                    <p>Create new job listings to find talented students</p>
                    <div className="job-form-preview">
                      <div className="form-step active">1. Details</div>
                      <div className="form-step">2. Requirements</div>
                      <div className="form-step">3. Skills</div>
                    </div>
                    <button className="feature-btn">Post Job →</button>
                  </div>
                </div>

                <div
                  className="feature-card"
                  onClick={() => navigate("/applicants")}
                >
                  <div className="feature-icon">👥</div>
                  <div className="feature-content">
                    <h3>View Applicants</h3>
                    <p>Review and manage job applications</p>
                    <div className="applicants-preview">
                      <div className="applicant-stat">
                        <span className="stat-label">Total:</span>
                        <span className="stat-value">0</span>
                      </div>
                      <div className="applicant-stat">
                        <span className="stat-label">New:</span>
                        <span className="stat-value">0</span>
                      </div>
                      <div className="applicant-stat">
                        <span className="stat-label">Reviewed:</span>
                        <span className="stat-value">0</span>
                      </div>
                    </div>
                    <button className="feature-btn">View Applicants →</button>
                  </div>
                </div>

                <div
                  className="feature-card"
                  onClick={() => navigate("/messages")}
                >
                  <div className="feature-icon">💬</div>
                  <div className="feature-content">
                    <h3>Chat with Students</h3>
                    <p>Communicate with potential candidates</p>
                    <div className="chat-preview">
                      <div className="chat-stats">
                        <span className="chat-stat">Active: 0</span>
                        <span className="chat-stat">Unread: 0</span>
                        <span className="chat-stat">Total: 0</span>
                      </div>
                    </div>
                    <button className="feature-btn">Open Chat →</button>
                  </div>
                </div>

                <div
                  className="feature-card"
                  onClick={() => navigate("/manage-hires")}
                >
                  <div className="feature-icon">✅</div>
                  <div className="feature-content">
                    <h3>Manage Hires</h3>
                    <p>Track and manage your hiring process</p>
                    <div className="hires-preview">
                      <div className="hires-stats">
                        <span className="hire-stage offered">Offered: 0</span>
                        <span className="hire-stage accepted">Accepted: 0</span>
                        <span className="hire-stage completed">
                          Completed: 0
                        </span>
                      </div>
                    </div>
                    <button className="feature-btn">Manage →</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Recruiter Quick Actions */}
            <div className="quick-actions-section">
              <h2 className="section-title">Quick Actions</h2>
              <div className="action-buttons">
                <button
                  className="action-btn primary"
                  onClick={() => navigate("/post-job")}
                >
                  <span className="action-icon">📝</span>
                  Post New Job
                </button>
                <button
                  className="action-btn"
                  onClick={() => navigate("/applicants")}
                >
                  <span className="action-icon">👥</span>
                  View Applicants
                </button>
                <button
                  className="action-btn"
                  onClick={() => navigate("/search-students")}
                >
                  <span className="action-icon">🔍</span>
                  Search Students
                </button>
                <button
                  className="action-btn"
                  onClick={() => navigate("/analytics")}
                >
                  <span className="action-icon">📊</span>
                  View Analytics
                </button>
                <button
                  className="action-btn"
                  onClick={() => navigate("/company-profile")}
                >
                  <span className="action-icon">🏢</span>
                  Company Profile
                </button>
                <button
                  className="action-btn"
                  onClick={() => navigate("/settings")}
                >
                  <span className="action-icon">⚙️</span>
                  Settings
                </button>
              </div>
            </div>

            {/* Recent Job Posts */}
            <div className="recent-jobs">
              <h2 className="section-title">
                Your Posted Jobs ({recruiterJobs.length})
              </h2>
              <div className="jobs-list">
                {recruiterJobs.length === 0 ? (
                  <div className="no-jobs">
                    <div className="no-jobs-icon">📭</div>
                    <h3>No jobs posted yet</h3>
                    <p>
                      Create your first job posting to find talented students
                    </p>
                    <button
                      className="post-first-job"
                      onClick={() => navigate("/post-job")}
                    >
                      Post Your First Job
                    </button>
                  </div>
                ) : (
                  recruiterJobs.map((job) => (
                    <div
                      key={job.id}
                      className="job-item"
                      onClick={() => navigate(`/jobs/${job.id}`)}
                    >
                      <div className="job-item-header">
                        <h4>{job.title}</h4>
                        <span className="job-badge">{job.job_type}</span>
                      </div>
                      <div className="job-item-details">
                        <span>📍 {job.location || "Remote"}</span>
                        <span>💰 ${job.budget}</span>
                        <span>
                          📅 {new Date(job.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="job-item-description">
                        {job.description?.substring(0, 100)}...
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="dashboard-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>SkillBridge</h4>
            <p>Connecting Talent with Opportunities</p>
            <p className="copyright">
              © 2024 SkillBridge. All rights reserved.
            </p>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li>
                <button
                  className="footer-link"
                  onClick={() => navigate("/help")}
                >
                  Help Center
                </button>
              </li>
              <li>
                <button
                  className="footer-link"
                  onClick={() => navigate("/contact")}
                >
                  Contact Support
                </button>
              </li>
              <li>
                <button
                  className="footer-link"
                  onClick={() => navigate("/privacy")}
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  className="footer-link"
                  onClick={() => navigate("/terms")}
                >
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Contact Us</h4>
            <p>Email: support@skillbridge.com</p>
            <p>Phone: (123) 456-7890</p>
            <div className="social-links">
              <button
                className="social-link"
                onClick={() => window.open("https://facebook.com", "_blank")}
              >
                📘
              </button>
              <button
                className="social-link"
                onClick={() => window.open("https://twitter.com", "_blank")}
              >
                🐦
              </button>
              <button
                className="social-link"
                onClick={() => window.open("https://linkedin.com", "_blank")}
              >
                💼
              </button>
              <button
                className="social-link"
                onClick={() => window.open("https://instagram.com", "_blank")}
              >
                📸
              </button>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            Logged in as: <strong>{user.name}</strong> ({user.email}) | Role:{" "}
            <strong>{user.role}</strong> |
            {user.role === "recruiter" && ` Your Jobs: ${recruiterJobs.length}`}
            <button
              className="debug-btn"
              onClick={() => {
                console.log("=== DEBUG INFO ===");
                console.log("User:", user);
                console.log("Skills:", userSkills);
                console.log("All jobs:", jobs);
                console.log("Recruiter jobs:", recruiterJobs);
                console.log("Stats:", stats);
              }}
            >
              Debug Info
            </button>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Dashboard;
