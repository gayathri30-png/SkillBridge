import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./JobDetails.css";

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:5001/api/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJob(response.data);
    } catch (err) {
      setError("Failed to load job details");
      console.error("Error fetching job details:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    try {
      setApplying(true);
      const token = localStorage.getItem("token");
      // You'll need to create this endpoint
      await axios.post(
        `http://localhost:5001/api/applications/apply`,
        {
          job_id: id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Application submitted successfully!");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to apply");
    } finally {
      setApplying(false);
    }
  };

  const getJobTypeColor = (type) => {
    const colors = {
      "Full-time": "#3498db",
      "Part-time": "#2ecc71",
      Contract: "#e74c3c",
      Internship: "#f39c12",
      Freelance: "#9b59b6",
    };
    return colors[type] || "#95a5a6";
  };

  const getExperienceColor = (level) => {
    const colors = {
      Entry: "#2ecc71",
      Intermediate: "#f39c12",
      Senior: "#e74c3c",
      Executive: "#8e44ad",
    };
    return colors[level] || "#95a5a6";
  };

  if (loading) {
    return (
      <div className="job-details-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="job-details-container">
        <div className="error-container">
          <div className="error-icon">❌</div>
          <h3>{error || "Job not found"}</h3>
          <button className="back-btn" onClick={() => navigate("/jobs")}>
            ← Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="job-details-container">
      <header className="job-details-header">
        <div className="header-content">
          <button className="back-btn" onClick={() => navigate("/jobs")}>
            ← Back to Jobs
          </button>
          <h1>Job Details</h1>
        </div>
      </header>

      <main className="job-details-main">
        <div className="job-details-content">
          <div className="job-header">
            <div className="job-header-left">
              <h1 className="job-title">{job.title}</h1>
              <div className="job-meta">
                <div className="job-badges">
                  <span
                    className="job-type-badge"
                    style={{ backgroundColor: getJobTypeColor(job.job_type) }}
                  >
                    {job.job_type}
                  </span>
                  <span
                    className="job-experience-badge"
                    style={{
                      backgroundColor: getExperienceColor(job.experience_level),
                    }}
                  >
                    {job.experience_level}
                  </span>
                </div>

                <div className="job-company-info">
                  <div className="company-name">
                    <span className="company-icon">🏢</span>
                    <strong>Posted by:</strong>{" "}
                    {job.recruiter_name || "Company"}
                  </div>
                  <div className="job-location">
                    <span className="location-icon">📍</span>
                    {job.location || "Remote"}
                  </div>
                </div>
              </div>
            </div>

            <div className="job-header-right">
              <div className="job-salary">
                <div className="salary-label">Budget</div>
                <div className="salary-amount">${job.budget}</div>
                <div className="salary-period">per project</div>
              </div>
            </div>
          </div>

          <div className="job-details-grid">
            {/* Main Job Info */}
            <div className="job-info-section">
              <h2 className="section-title">Job Description</h2>
              <div className="job-description">
                {job.description.split("\n").map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              <div className="job-requirements">
                <h3 className="subsection-title">Requirements</h3>
                <ul className="requirements-list">
                  <li>Experience level: {job.experience_level}</li>
                  <li>Job type: {job.job_type}</li>
                  {job.duration && <li>Duration: {job.duration}</li>}
                  {job.location && <li>Location: {job.location}</li>}
                </ul>
              </div>
            </div>

            {/* Job Sidebar */}
            <div className="job-sidebar">
              <div className="sidebar-card">
                <h3 className="sidebar-title">Job Overview</h3>
                <div className="overview-list">
                  <div className="overview-item">
                    <span className="overview-label">Job Type</span>
                    <span className="overview-value">{job.job_type}</span>
                  </div>
                  <div className="overview-item">
                    <span className="overview-label">Experience</span>
                    <span className="overview-value">
                      {job.experience_level}
                    </span>
                  </div>
                  <div className="overview-item">
                    <span className="overview-label">Budget</span>
                    <span className="overview-value">${job.budget}</span>
                  </div>
                  {job.duration && (
                    <div className="overview-item">
                      <span className="overview-label">Duration</span>
                      <span className="overview-value">{job.duration}</span>
                    </div>
                  )}
                  {job.location && (
                    <div className="overview-item">
                      <span className="overview-label">Location</span>
                      <span className="overview-value">{job.location}</span>
                    </div>
                  )}
                  <div className="overview-item">
                    <span className="overview-label">Posted</span>
                    <span className="overview-value">
                      {new Date(job.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="sidebar-card">
                <h3 className="sidebar-title">Required Skills</h3>
                <div className="skills-container">
                  {job.skills && job.skills.length > 0 ? (
                    <div className="skills-tags">
                      {job.skills.map((skill, index) => (
                        <span key={index} className="skill-tag">
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="no-skills">No skills specified</p>
                  )}
                </div>
              </div>

              <div className="sidebar-card">
                <h3 className="sidebar-title">Apply Now</h3>
                <div className="apply-section">
                  <p className="apply-description">
                    Interested in this position? Submit your application now!
                  </p>
                  <button
                    className="apply-btn"
                    onClick={handleApply}
                    disabled={applying}
                  >
                    {applying ? "Applying..." : "Apply Now"}
                  </button>
                  <p className="apply-note">
                    Your profile and skills will be shared with the recruiter.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default JobDetails;
