import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Plus, Users, Edit3, XCircle, MapPin, DollarSign, Clock } from "lucide-react";
import "./RecruiterJobs.css";

const RecruiterJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchMyJobs = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      
      const response = await axios.get("/api/jobs/recruiter", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setJobs(response.data);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError("Failed to load your jobs");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCloseJob = async (id) => {
    if (!window.confirm("Are you sure you want to close this job?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.put(`/api/jobs/${id}`, { status: 'closed' }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMyJobs();
    } catch (err) {
      alert("Failed to close job");
    }
  };

  useEffect(() => {
    fetchMyJobs();
  }, [fetchMyJobs]);

  if (loading) return <div className="p-8 text-slate-500">Retrieving your listings...</div>;

  return (
    <div className="rj-container">
      <header className="rj-header">
        <div>
            <h1>Your Listings</h1>
            <p className="rj-subtitle">Manage your active job postings and review inbound talent.</p>
        </div>
        <button 
            onClick={() => navigate("/post-job")} 
            className="rj-btn-primary"
        >
            <Plus size={18} /> New Posting
        </button>
      </header>
      
      {error && <div className="p-4 bg-error-soft text-error rounded-xl mb-6">{error}</div>}

      {jobs.length === 0 ? (
        <div className="rj-empty">
          <div className="rj-empty-icon">📢</div>
          <h3>Visibility is zero</h3>
          <p className="text-slate-500 mb-6">Start by posting your first opportunity to the SkillBridge network.</p>
          <button onClick={() => navigate("/post-job")} className="rj-btn-primary mx-auto">
            Create Listing
          </button>
        </div>
      ) : (
        <div className="rj-grid">
          {jobs.map((job) => (
             <div key={job.id} className={`rj-card ${job.status === 'closed' ? 'closed' : ''}`}>
                <div className="rj-card-content">
                  <div className="flex justify-between items-center mb-4">
                     <span className={`rj-status-badge ${job.status}`}>
                        {job.status === 'open' ? 'Active' : 'Closed'}
                     </span>
                     <span className="rj-date">{new Date(job.created_at).toLocaleDateString()}</span>
                  </div>
                  <h3>{job.title}</h3>
                  <div className="rj-meta">
                     <span><MapPin size={14}/> {job.location || "Remote"}</span>
                     <span><DollarSign size={14}/> {job.budget}</span>
                     <span><Clock size={14}/> {job.duration || 'Flexible'}</span>
                  </div>
                </div>

                <div className="rj-card-footer">
                   <div className="flex justify-between items-center mb-6">
                     <div className="rj-applicant-count">
                        <strong>{job.applicant_count || 0}</strong> <span>Applicants</span>
                     </div>
                     <button 
                         onClick={() => navigate(`/jobs/${job.id}/applicants`)} 
                         className="rj-btn-outline"
                     >
                         <Users size={14}/> View Talent
                     </button>
                   </div>
                   
                   <div className="rj-card-actions">
                      <button 
                         className="rj-btn-action edit"
                         onClick={() => navigate(`/post-job?edit=${job.id}`)}
                      >
                         <Edit3 size={14}/> Edit
                      </button>
                      {job.status === 'open' && (
                        <button 
                           className="rj-btn-action close"
                           onClick={() => handleCloseJob(job.id)}
                        >
                           <XCircle size={14}/> Close
                        </button>
                      )}
                   </div>
                </div>
             </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecruiterJobs;

