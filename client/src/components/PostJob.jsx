import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "./PostJob.css";

function PostJob() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);

  const [jobData, setJobData] = useState({
    title: "",
    description: "",
    job_type: "Full-time",
    budget: "",
    duration: "",
    location: "",
    experience_level: "Entry",
    skills: [],
  });

  const [errors, setErrors] = useState({});

  const location = useLocation();
  const editId = new URLSearchParams(location.search).get("edit");

  useEffect(() => {
    fetchSkills();
    if (editId) fetchJobToEdit();
  }, [editId]);

  const fetchJobToEdit = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`/api/jobs/${editId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const job = res.data;
      setJobData({
        title: job.title || "",
        description: job.description || "",
        job_type: job.job_type || "Full-time",
        budget: job.budget || "",
        duration: job.duration || "",
        location: job.location || "",
        experience_level: job.experience_level || "Entry",
        skills: job.skills_required || [],
      });
      if (job.skills_required_ids) {
        setSelectedSkills(job.skills_required_ids);
      }
    } catch (err) {
      console.error("Error fetching job for edit:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSkills = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/skills/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSkills(response.data);
    } catch (error) {
      console.error("Error fetching skills:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setJobData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSkillToggle = (skillId) => {
    setSelectedSkills((prev) => {
      if (prev.includes(skillId)) {
        return prev.filter((id) => id !== skillId);
      } else {
        return [...prev, skillId];
      }
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!jobData.title.trim()) newErrors.title = "Title is required";
    if (!jobData.description.trim())
      newErrors.description = "Description is required";
    if (!jobData.budget) newErrors.budget = "Budget is required";
    if (isNaN(jobData.budget) || jobData.budget <= 0)
      newErrors.budget = "Budget must be a positive number";
    if (!jobData.location.trim()) newErrors.location = "Location is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));

      const dataToSend = {
        ...jobData,
        posted_by: user?.id || user?.user_id || user?._id,
        skills: selectedSkills,
        budget: Number(jobData.budget),
      };

      console.log("Submitting job:", dataToSend);

      const url = editId ? `/api/jobs/${editId}` : "/api/jobs";
      const method = editId ? "put" : "post";

      const response = await axios[method](
        url,
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Job processed:", response.data);
      alert(editId ? "Job updated successfully!" : "Job posted successfully!");
      navigate("/my-jobs");
    } catch (error) {
      console.error("Error posting job:", error);
      alert(
        error.response?.data?.error || "Failed to post job. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const jobTypes = [
  { label: "Full-time", value: "full-time" },
  { label: "Part-time", value: "part-time" },
  { label: "Contract", value: "contract" },
  { label: "Internship", value: "internship" },
  { label: "Freelance", value: "freelance" },
];

const experienceLevels = [
  { label: "Entry", value: "entry" },
  { label: "Intermediate", value: "intermediate" },
  { label: "Senior", value: "senior" },
  { label: "Executive", value: "executive" },
];


  return (
    <div className="post-job-container">
      <header className="post-job-header">
        <div className="header-content">
          <button className="back-btn" onClick={() => navigate("/my-jobs")}>
            ← Back to My Jobs
          </button>
          <h1>{editId ? "Edit Job Posting" : "Post a New Job"}</h1>
          <p className="header-subtitle">
            Fill in the details to create a new job listing
          </p>
        </div>
      </header>

      <main className="post-job-main">
        <form onSubmit={handleSubmit} className="job-form">
          {/* Basic Information */}
          <div className="form-section">
            <h2 className="section-title">Basic Information</h2>

            <div className="form-group">
              <label htmlFor="title">
                Job Title <span className="required">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={jobData.title}
                onChange={handleInputChange}
                placeholder="e.g., Frontend Developer"
                className={errors.title ? "error" : ""}
                disabled={loading}
              />
              {errors.title && (
                <span className="error-message">{errors.title}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="description">
                Job Description <span className="required">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={jobData.description}
                onChange={handleInputChange}
                placeholder="Describe the job responsibilities, requirements, and expectations..."
                rows="5"
                className={errors.description ? "error" : ""}
                disabled={loading}
              />
              {errors.description && (
                <span className="error-message">{errors.description}</span>
              )}
            </div>
          </div>

          {/* Job Details */}
          <div className="form-section">
            <h2 className="section-title">Job Details</h2>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="job_type">
                  Job Type <span className="required">*</span>
                </label>
                <select
                  id="job_type"
                  name="job_type"
                  value={jobData.job_type}
                  onChange={handleInputChange}
                  disabled={loading}
                >
                    {jobTypes.map(t => (
                    <option key={t.value} value={t.value}>
                     {t.label}
                     </option>
                    ))}
                 
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="experience_level">
                  Experience Level <span className="required">*</span>
                </label>
                <select
                  id="experience_level"
                  name="experience_level"
                  value={jobData.experience_level}
                  onChange={handleInputChange}
                  disabled={loading}
                >
                  {experienceLevels.map(e => (
                    <option key={e.value} value={e.value}>
                     {e.label}
                     </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="budget">
                  Budget (USD) <span className="required">*</span>
                </label>
                <input
                  type="number"
                  id="budget"
                  name="budget"
                  value={jobData.budget}
                  onChange={handleInputChange}
                  placeholder="e.g., 5000"
                  min="0"
                  className={errors.budget ? "error" : ""}
                  disabled={loading}
                />
                {errors.budget && (
                  <span className="error-message">{errors.budget}</span>
                )}
                <small className="hint">
                  Enter the total project budget or salary
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="duration">Duration (Optional)</label>
                <input
                  type="text"
                  id="duration"
                  name="duration"
                  value={jobData.duration}
                  onChange={handleInputChange}
                  placeholder="e.g., 3 months, 6 weeks"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="location">
                Location <span className="required">*</span>
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={jobData.location}
                onChange={handleInputChange}
                placeholder="e.g., Remote, New York, Hybrid"
                className={errors.location ? "error" : ""}
                disabled={loading}
              />
              {errors.location && (
                <span className="error-message">{errors.location}</span>
              )}
            </div>
          </div>

          {/* Required Skills */}
          <div className="form-section">
            <h2 className="section-title">Required Skills</h2>
            <p className="section-subtitle">
              Select the skills required for this job
            </p>

            <div className="skills-selection">
              {skills.length === 0 ? (
                <div className="loading-skills">Loading skills...</div>
              ) : (
                <div className="skills-grid">
                  {skills.map((skill) => (
                    <div
                      key={skill.id}
                      className={`skill-chip ${
                        selectedSkills.includes(skill.id) ? "selected" : ""
                      }`}
                      onClick={() => !loading && handleSkillToggle(skill.id)}
                    >
                      {skill.name}
                      {selectedSkills.includes(skill.id) && (
                        <span className="checkmark">✓</span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {selectedSkills.length > 0 && (
                <div className="selected-skills">
                  <h4>Selected Skills ({selectedSkills.length})</h4>
                  <div className="selected-skills-list">
                    {selectedSkills.map((skillId) => {
                      const skill = skills.find((s) => s.id === skillId);
                      return skill ? (
                        <span key={skillId} className="selected-skill-tag">
                          {skill.name}
                          <button
                            type="button"
                            onClick={() => handleSkillToggle(skillId)}
                            className="remove-skill"
                          >
                            ×
                          </button>
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/dashboard")}
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Posting Job...
                </>
              ) : (
                editId ? "Update Job" : "Post Job"
              )}
            </button>
          </div>
        </form>

        {/* Preview Section */}
        <div className="preview-section">
          <h2 className="section-title">Job Preview</h2>
          <div className="preview-card">
            <div className="preview-header">
              <h3>{jobData.title || "Your Job Title"}</h3>
              <div className="preview-badges">
                <span className="badge badge-primary">{jobData.job_type}</span>
                <span className="badge badge-gray">
                  {jobData.experience_level}
                </span>
              </div>
            </div>

            <div className="preview-details">
              <div className="preview-detail">
                <span className="detail-icon">💰</span>
                <span>${jobData.budget || "0"}</span>
              </div>
              <div className="preview-detail">
                <span className="detail-icon">📍</span>
                <span>{jobData.location || "Location"}</span>
              </div>
              {jobData.duration && (
                <div className="preview-detail">
                  <span className="detail-icon">⏱️</span>
                  <span>{jobData.duration}</span>
                </div>
              )}
            </div>

            <div className="preview-description">
              <h4>Description</h4>
              <p>
                {jobData.description || "Job description will appear here..."}
              </p>
            </div>

            {selectedSkills.length > 0 && (
              <div className="preview-skills">
                <h4>Required Skills</h4>
                <div className="preview-skills-list">
                  {selectedSkills.map((skillId) => {
                    const skill = skills.find((s) => s.id === skillId);
                    return skill ? (
                      <span key={skillId} className="preview-skill-tag">
                        {skill.name}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default PostJob;
