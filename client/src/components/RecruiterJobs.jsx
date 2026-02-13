import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
      
      const response = await axios.get("/api/jobs", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const myJobs = response.data.filter(job => 
        job.posted_by === user.id || 
        job.posted_by === user.user_id || 
        Number(job.posted_by) === Number(user.id)
      );
      
      setJobs(myJobs);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError("Failed to load your jobs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyJobs();
  }, [fetchMyJobs]);

  if (loading) return <div className="p-8 text-slate-500">Retrieving your listings...</div>;

  return (
    <div className="recruiter-jobs-view fade-in p-8">
      <header className="flex-between mb-10">
        <div>
            <h1 className="mb-2">Your Listings</h1>
            <p className="text-slate-500">Manage your active job postings and review inbound talent.</p>
        </div>
        <button 
            onClick={() => navigate("/post-job")} 
            className="btn btn-primary"
        >
            + New Posting
        </button>
      </header>
      
      {error && <div className="p-4 bg-error-soft text-error rounded-xl mb-6">{error}</div>}

      {jobs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📢</div>
          <h3>Visibility is zero</h3>
          <p className="text-slate-500 mb-6">Start by posting your first opportunity to the SkillBridge network.</p>
          <button onClick={() => navigate("/post-job")} className="btn btn-primary">
            Create Listing
          </button>
        </div>
      ) : (
        <div className="admin-stats-grid grid-cols-3">
          {jobs.map((job) => (
            <div key={job.id} className="card card-hover flex flex-col overflow-hidden">
               <div className="p-6 flex-1">
                  <div className="flex-between mb-4">
                     <span className="status-chip accepted">Active Listing</span>
                     <span className="text-xs text-slate-400">{new Date(job.created_at).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-xl mb-6">{job.title}</h3>
                  <div className="flex gap-4 text-sm text-slate-500 mb-8">
                     <span className="flex items-center gap-2">📍 {job.location || "Remote"}</span>
                     <span className="flex items-center gap-2">💰 ${job.budget}</span>
                  </div>
               </div>
               <div className="bg-slate-50 p-4 border-top flex-between">
                  <div className="text-xs text-slate-500">
                     <strong className="text-primary">12</strong> applicants
                  </div>
                  <button 
                      onClick={() => navigate(`/jobs/${job.id}/applicants`)} 
                      className="btn btn-outline py-1 px-4 text-xs"
                  >
                      Manage Talent pool
                  </button>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecruiterJobs;

