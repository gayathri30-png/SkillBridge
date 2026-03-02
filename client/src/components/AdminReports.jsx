import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../pages/AdminDashboard.css";

const AdminReports = () => {
    const [reports, setReports] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const response = await axios.get("/api/reports", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setReports(response.data);
        } catch (error) {
            console.error("Error fetching reports:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-white">Generating system insights...</div>;
    if (!reports) return <div className="p-8 text-white">No report data available.</div>;

    return (
        <div className="admin-view fade-in p-8">
            <header className="mb-10">
                <button onClick={() => navigate("/admin")} className="back-link-btn mb-4">
                    ← Back to Overview
                </button>
                <h1 className="mb-2">System Analytics</h1>
                <p className="text-slate-500">Comprehensive overview of platform performance and growth.</p>
            </header>

            <div className="grid grid-cols-2 gap-8">
                <div className="card p-6">
                    <h3 className="mb-4">Role Distribution</h3>
                    <div className="flex flex-col gap-2">
                        {reports.roleDistribution?.map(row => (
                            <div key={row.role} className="flex justify-between items-center p-2 border-b">
                                <span className="capitalize font-medium">{row.role}s</span>
                                <span className="text-xl font-bold text-primary">{row.count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card p-6">
                    <h3 className="mb-4">Job Status Overview</h3>
                    <div className="flex flex-col gap-2">
                        {reports.jobStats?.map(row => (
                            <div key={row.status} className="flex justify-between items-center p-2 border-b">
                                <span className="capitalize font-medium">{row.status} Jobs</span>
                                <span className="text-xl font-bold text-info">{row.count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card p-6">
                    <h3 className="mb-4">Application Outcomes</h3>
                    <div className="flex flex-col gap-2">
                        {reports.applicationStats?.map(row => (
                            <div key={row.status} className="flex justify-between items-center p-2 border-b">
                                <span className="capitalize font-medium">{row.status}</span>
                                <span className="text-xl font-bold text-success">{row.count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card p-6">
                    <h3 className="mb-4">Recent User Growth</h3>
                    <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
                        {reports.userGrowth?.map(row => (
                            <div key={row.date} className="flex justify-between items-center p-2 border-b">
                                <span className="text-xs">{new Date(row.date).toLocaleDateString()}</span>
                                <span className="font-bold">+{row.count} new</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminReports;
