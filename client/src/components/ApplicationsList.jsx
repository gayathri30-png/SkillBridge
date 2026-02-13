import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ApplicationsList.css";

const ApplicationsList = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/applications/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(response.data);
    } catch (err) {
      console.error("Error fetching applications:", err);
      setError("Failed to load applications");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  if (loading) return <div className="p-8 text-slate-500 text-center">Tracking your journey...</div>;

  return (
    <div className="applications-view fade-in p-8">
      <header className="mb-10">
        <h1 className="mb-2">My Applications</h1>
        <p className="text-slate-500">Keep track of your active proposals and AI suitability scores.</p>
      </header>
      
      {error && <div className="p-4 bg-error-soft text-error rounded-xl mb-6">{error}</div>}

      {applications.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📫</div>
          <h3>The list is empty</h3>
          <p className="text-slate-500 mb-6">You haven't submitted any proposals yet. Start exploring jobs!</p>
          <button onClick={() => navigate("/jobs")} className="btn btn-primary">
            Explore Opportunities
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((app) => (
            <div key={app.id} className="card card-hover p-6 flex flex-col border-left-3" style={{ borderLeftColor: app.status === 'accepted' ? 'var(--success)' : 'transparent' }}>
               <div className="flex-between mb-4">
                  <span className={`status-chip ${app.status.toLowerCase()}`}>{app.status}</span>
                  <span className="text-xs text-slate-400">{new Date(app.created_at).toLocaleDateString()}</span>
               </div>
               
               <h3 className="text-lg font-bold mb-1 truncate">{app.job_title}</h3>
               <p className="text-sm text-slate-500 mb-6">🏢 {app.company_name || "Premium Partner"}</p>

               <div className="mt-auto space-y-4">
                  <div className="bg-slate-50 p-4 rounded-xl">
                      <div className="flex-between mb-2">
                         <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">AI Match Score</span>
                         <span className={`font-bold ${app.ai_match_score > 75 ? 'text-success' : app.ai_match_score > 40 ? 'text-warning' : 'text-slate-400'}`}>
                            {app.ai_match_score}%
                         </span>
                      </div>
                      <div className="score-progress">
                         <div 
                            className="score-fill"
                            style={{ 
                                width: `${app.ai_match_score}%`,
                                backgroundColor: app.ai_match_score > 75 ? 'var(--success)' : app.ai_match_score > 40 ? 'var(--warning)' : 'var(--slate-300)'
                            }}
                         ></div>
                      </div>
                  </div>
                  
                  <button className="btn btn-outline w-full py-2 text-xs" onClick={() => navigate(`/jobs/${app.job_id}`)}>
                      View Listing
                  </button>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicationsList;

