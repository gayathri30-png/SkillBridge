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
            const response = await axios.get("/api/applications/all", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setApplications(response.data);
        } catch (error) {
            console.error("Error fetching applications:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-slate-500">Loading applications...</div>;

    return (
        <div className="admin-container fade-in">
            <header className="page-header">
                <button onClick={() => navigate("/admin")} className="back-link-btn mb-4">
                    ← Back to Overview
                </button>
                <h1 className="page-title">Application Monitoring</h1>
                <p className="page-subtitle">Track all job applications across the platform.</p>
            </header>

            <div className="table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Opportunity</th>
                            <th>Applicant</th>
                            <th>Match Score</th>
                            <th>Status</th>
                            <th>Applied On</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications.map((app) => (
                            <tr key={app.id}>
                                <td>
                                    <div className="font-bold">{app.job_title}</div>
                                </td>
                                <td>
                                    <div>{app.student_name}</div>
                                </td>
                                <td>
                                    <span className="font-bold text-primary">{app.ai_match_score}%</span>
                                </td>
                                <td>
                                    <span className={`status-chip ${app.status}`}>
                                        {app.status}
                                    </span>
                                </td>
                                <td>
                                    <div className="text-xs text-slate-500">
                                        {new Date(app.created_at).toLocaleDateString()}
                                    </div>
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
