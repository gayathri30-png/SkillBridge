import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminTable.css";

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/admin/applications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(response.data);
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-slate-500">Loading platform applications...</div>;

  return (
    <div className="admin-container fade-in">
      <header className="page-header">
        <button onClick={() => navigate("/admin")} className="back-link-btn mb-4">
           ← Back to Overview
        </button>
        <h1 className="page-title">Application Monitor</h1>
        <p className="page-subtitle">Oversee all student applications for transparency and audit.</p>
      </header>

      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Opportunity</th>
              <th>Student</th>
              <th>Recruiter</th>
              <th>Match</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id}>
                <td>
                  <div className="font-bold text-slate-800">{app.job_title}</div>
                </td>
                <td>{app.student_name}</td>
                <td>{app.recruiter_name}</td>
                <td>
                   <span className="font-bold text-indigo-600">{app.ai_match_score}%</span>
                </td>
                <td>
                  <span className={`status-chip ${app.status}`}>
                    {app.status}
                  </span>
                </td>
                <td className="text-xs text-slate-400">
                  {new Date(app.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminApplications;
