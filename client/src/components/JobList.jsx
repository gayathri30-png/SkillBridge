import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./JobList.css";

function JobList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    job_type: "",
    experience_level: "",
    location: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5001/api/jobs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(response.data);
    } catch (err) {
      setError("Failed to load jobs");
      console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleJobClick = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const filteredJobs = jobs.filter((job) => {
    return (
      (!filters.job_type || job.job_type === filters.job_type) &&
      (!filters.experience_level ||
        job.experience_level === filters.experience_level) &&
      (!filters.location ||
        job.location?.toLowerCase().includes(filters.location.toLowerCase()))
    );
  });

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

  const formatBudget = (budget) => {
    if (budget >= 1000) {
      return `$${(budget / 1000).toFixed(1)}k`;
    }
    return `$${budget}`;
  };

  if (loading) {
    return (
      <div className="job-list-container">
        <div className="job-list-header">
          <h1>Available Jobs</h1>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="job-list-container">
      <header className="job-list-header">
        <div className="header-content">
          <h1>Available Jobs</h1>
          <button className="back-btn" onClick={() => navigate("/dashboard")}>
            ← Back to Dashboard
          </button>
        </div>
      </header>

      <main className="job-list-main">
        {/* Filters */}
        <div className="filters-section">
          <div className="filters-grid">
            <div className="filter-group">
              <label>Job Type</label>
              <select
                name="job_type"
                value={filters.job_type}
                onChange={handleFilterChange}
              >
                <option value="">All Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
                <option value="Freelance">Freelance</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Experience Level</label>
              <select
                name="experience_level"
                value={filters.experience_level}
                onChange={handleFilterChange}
              >
                <option value="">All Levels</option>
                <option value="Entry">Entry Level</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Senior">Senior</option>
                <option value="Executive">Executive</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Location</label>
              <input
                type="text"
                name="location"
                placeholder="Search location..."
                value={filters.location}
                onChange={handleFilterChange}
              />
            </div>

            <div className="filter-group">
              <button
                className="clear-filters"
                onClick={() =>
                  setFilters({
                    job_type: "",
                    experience_level: "",
                    location: "",
                  })
                }
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Job Count */}
        <div className="job-count">
          <p>
            Showing <strong>{filteredJobs.length}</strong> of{" "}
            <strong>{jobs.length}</strong> jobs
          </p>
        </div>

        {/* Error Message */}
        {error && <div className="error-message">{error}</div>}

        {/* Job Grid */}
        <div className="job-grid">
          {filteredJobs.length === 0 ? (
            <div className="no-jobs">
              <div className="no-jobs-icon">📭</div>
              <h3>No jobs found</h3>
              <p>Try adjusting your filters or check back later.</p>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div
                key={job.id}
                className="job-card"
                onClick={() => handleJobClick(job.id)}
              >
                <div className="job-card-header">
                  <div
                    className="job-type-badge"
                    style={{ backgroundColor: getJobTypeColor(job.job_type) }}
                  >
                    {job.job_type}
                  </div>
                  <div
                    className="job-experience-badge"
                    style={{
                      backgroundColor: getExperienceColor(job.experience_level),
                    }}
                  >
                    {job.experience_level}
                  </div>
                </div>

                <div className="job-card-body">
                  <h3 className="job-title">{job.title}</h3>

                  <div className="job-company">
                    <span className="company-icon">🏢</span>
                    <span>{job.recruiter_name || "Company"}</span>
                  </div>

                  <div className="job-details">
                    <div className="job-detail">
                      <span className="detail-icon">📍</span>
                      <span>{job.location || "Remote"}</span>
                    </div>
                    <div className="job-detail">
                      <span className="detail-icon">💰</span>
                      <span>{formatBudget(job.budget)}</span>
                    </div>
                    <div className="job-detail">
                      <span className="detail-icon">⏱️</span>
                      <span>{job.duration || "Not specified"}</span>
                    </div>
                  </div>

                  <p className="job-description">
                    {job.description.length > 150
                      ? `${job.description.substring(0, 150)}...`
                      : job.description}
                  </p>

                  <div className="job-skills">
                    <span className="skills-label">Skills:</span>
                    <div className="skills-tags">
                      {job.skills ? (
                        job.skills.slice(0, 3).map((skill, index) => (
                          <span key={index} className="skill-tag">
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="no-skills">No skills specified</span>
                      )}
                      {job.skills && job.skills.length > 3 && (
                        <span className="skill-tag more-tag">
                          +{job.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="job-card-footer">
                  <div className="job-posted">
                    Posted: {new Date(job.created_at).toLocaleDateString()}
                  </div>
                  <button className="view-details-btn">View Details →</button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default JobList;
