import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminTable.css"; 

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/jobs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(response.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteJob = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete job "${title}"?`)) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Job deleted successfully");
      fetchJobs();
    } catch (error) {
      console.error("Error deleting job:", error);
      alert("Failed to delete job");
    }
  };

  if (loading) return <div className="p-8 text-slate-500">Loading job listings...</div>;

  return (
    <div className="admin-container fade-in">
      <header className="page-header">
         <button onClick={() => navigate("/admin")} className="back-link-btn mb-4">
           ← Back to Overview
        </button>
        <h1 className="page-title">Marketplace Audit</h1>
        <p className="page-subtitle">Review and manage active job postings across the platform.</p>
      </header>

      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Job Opportunity</th>
              <th>Recruiter</th>
              <th>Type</th>
              <th>Budget</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id}>
                <td>
                   <div className="font-bold text-slate-900">{job.title}</div>
                   <div className="text-xs text-slate-400">{job.location || 'Remote'}</div>
                </td>
                <td>
                   <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-xs font-bold">🏢</div>
                      <span>{job.recruiter_name}</span>
                   </div>
                </td>
                <td>
                   <span className="chip chip-info">{job.job_type}</span>
                </td>
                <td>
                   <span className="font-bold text-primary">${job.budget}</span>
                </td>
                <td className="text-right">
                  <button 
                    className="delete-btn" 
                    onClick={() => deleteJob(job.id, job.title)}
                  >
                    Archive
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminJobs;

