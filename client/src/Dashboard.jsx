import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css"; // We'll create this CSS file

function Dashboard() {
  const [user, setUser] = useState(null);
  const [userSkills, setUserSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (token && savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      fetchUserSkills(token, userData.id);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const fetchUserSkills = async (token, userId) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/api/skills/my-skills`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserSkills(response.data);
    } catch (error) {
      console.error("Error fetching skills:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1>SkillBridge Dashboard</h1>
          <div className="user-info">
            <div className="user-details">
              <span className="user-name">
                Welcome, <strong>{user.name}</strong>
              </span>
              <span className="user-role badge">{user.role}</span>
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
            <h3>Your Skills</h3>
            <p className="stat-number">{loading ? "..." : userSkills.length}</p>
            <p className="stat-label">Total Skills</p>
          </div>
          <div className="stat-card">
            <h3>Profile</h3>
            <p className="stat-number">100%</p>
            <p className="stat-label">Complete</p>
          </div>
          <div className="stat-card">
            <h3>Applications</h3>
            <p className="stat-number">0</p>
            <p className="stat-label">Submitted</p>
          </div>
        </div>

        {/* Student Dashboard */}
        {user.role === "student" && (
          <div className="dashboard-section">
            <h2 className="section-title">Student Features</h2>
            <div className="feature-grid">
              {/* Manage Skills Card */}
              <div className="feature-card" onClick={() => navigate("/skills")}>
                <div className="feature-icon">💼</div>
                <div className="feature-content">
                  <h3>Manage Skills</h3>
                  <p>Add, edit, or remove your skills to attract recruiters</p>
                  <div className="skill-preview">
                    {loading ? (
                      <p>Loading skills...</p>
                    ) : userSkills.length > 0 ? (
                      <div className="skills-list">
                        {userSkills.slice(0, 3).map((skill) => (
                          <span key={skill.id} className="skill-tag">
                            {skill.name}
                          </span>
                        ))}
                        {userSkills.length > 3 && (
                          <span className="skill-tag">
                            +{userSkills.length - 3} more
                          </span>
                        )}
                      </div>
                    ) : (
                      <p className="no-skills">No skills added yet</p>
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
                  <button className="feature-btn">View Matches →</button>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
              <h2 className="section-title">Quick Actions</h2>
              <div className="action-buttons">
                <button
                  className="action-btn"
                  onClick={() => navigate("/skills")}
                >
                  Add New Skill
                </button>
                <button
                  className="action-btn"
                  onClick={() => navigate("/profile")}
                >
                  Update Profile
                </button>
                <button
                  className="action-btn"
                  onClick={() => navigate("/portfolio")}
                >
                  Upload Portfolio
                </button>
                <button
                  className="action-btn"
                  onClick={() => navigate("/resume")}
                >
                  Upload Resume
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Recruiter Dashboard */}
        {user.role === "recruiter" && (
          <div className="dashboard-section">
            <h2 className="section-title">Recruiter Features</h2>
            <div className="feature-grid">
              <div
                className="feature-card"
                onClick={() => navigate("/post-job")}
              >
                <div className="feature-icon">📝</div>
                <div className="feature-content">
                  <h3>Post Job</h3>
                  <p>Create new job listings to find talented students</p>
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
                  <button className="feature-btn">Manage →</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="dashboard-footer">
        <p>SkillBridge © 2024 - Connecting Talent with Opportunities</p>
        <p>
          Need help? <a href="/help">Visit Help Center</a> |
          <a href="/contact"> Contact Support</a>
        </p>
      </footer>
    </div>
  );
}

export default Dashboard;
