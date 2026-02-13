import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./AdminTable.css"; 

const RecruiterApplicants = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [jobTitle, setJobTitle] = useState("");

  const fetchJobDetails = useCallback(async () => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`/api/jobs/${jobId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setJobTitle(response.data.title);
    } catch(err) {
        console.error("Error fetching job details", err);
    }
  }, [jobId]);

  const fetchApplicants = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `/api/applications/job/${jobId}/sorted`, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApplicants(response.data.applicants);
    } catch (err) {
      console.error("Error fetching applicants:", err);
      setError("Failed to load applicants or unauthorized");
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    fetchApplicants();
    fetchJobDetails();
  }, [fetchApplicants, fetchJobDetails]);

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
        const token = localStorage.getItem("token");
        await axios.put(
            `/api/applications/status/${applicationId}`,
            { status: newStatus },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        setApplicants(prev => prev.map(app => 
            app.application_id === applicationId 
                ? { ...app, status: newStatus } 
                : app
        ));
    } catch (err) {
        console.error("Error updating status:", err);
        alert("Failed to update status");
    }
  };

  if (loading) return <div className="p-8 text-slate-500">Curating talent pool...</div>;

  return (
    <div className="admin-container fade-in">
      <header className="page-header">
        <button onClick={() => navigate("/my-jobs")} className="back-link-btn mb-4">
            ← Back to Job Postings
        </button>
        <h1 className="page-title">Candidates for {jobTitle}</h1>
        <p className="page-subtitle">
            AI-Ranked applications based on skill overlap and proposal quality.
        </p>
      </header>
      
      {error && <div className="p-4 bg-error-soft text-error rounded-xl mb-6">{error}</div>}

      {applicants.length === 0 ? (
        <div className="empty-state">
            <div className="empty-icon">📂</div>
            <h3>No applications yet</h3>
            <p className="text-slate-500">Wait for top talent to discover your posting.</p>
        </div>
      ) : (
        <div className="table-wrapper">
            <table className="data-table">
                <thead>
                    <tr>
                        <th>Candidate Profile</th>
                        <th>Applied</th>
                        <th>AI Suitability</th>
                        <th>Proposal Sneak-peek</th>
                        <th>Status</th>
                        <th className="text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {applicants.map((app) => (
                        <tr key={app.application_id}>
                            <td>
                                <div className="candidate-info">
                                    <div className="candidate-avatar">
                                        {app.student_name?.charAt(0) || "S"}
                                    </div>
                                    <div>
                                        <div className="candidate-name">{app.student_name}</div>
                                        <div className="candidate-email">{app.student_email}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="text-slate-500 text-xs">
                                {new Date(app.created_at).toLocaleDateString()}
                            </td>
                            <td>
                                <div className="score-container flex items-center gap-4">
                                    <span className={`font-bold text-sm ${app.ai_match_score > 75 ? 'text-success' : app.ai_match_score > 40 ? 'text-warning' : 'text-slate-400'}`}>
                                        {app.ai_match_score}%
                                    </span>
                                    <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden min-w-[80px]">
                                        <div 
                                            className="h-full transition-all duration-1000"
                                            style={{
                                                width: `${app.ai_match_score}%`,
                                                backgroundColor: app.ai_match_score > 75 ? 'var(--success)' : app.ai_match_score > 40 ? 'var(--warning)' : 'var(--slate-300)'
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div className="proposal-trunc text-slate-500 italic text-xs max-w-[200px] truncate">
                                    "{app.proposal || "No proposal provided"}"
                                </div>
                            </td>
                            <td>
                                <span className={`status-chip ${app.status}`}>
                                    {app.status}
                                </span>
                            </td>
                            <td className="text-right">
                                <select 
                                    value={app.status || 'pending'}
                                    onChange={(e) => handleStatusUpdate(app.application_id, e.target.value)}
                                    className="input-field py-1 px-2 text-xs w-auto"
                                >
                                    <option value="pending">Reviewing</option>
                                    <option value="accepted">Shortlist</option>
                                    <option value="rejected">Archive</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      )}
    </div>
  );
};

export default RecruiterApplicants;

