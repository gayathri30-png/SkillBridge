import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [data, setData] = useState({
    stats: { users: 0, students: 0, recruiters: 0, jobs: 0, apps: 0, skills: 0 },
    pendingVerifications: [],
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const [reportsRes, healthRes] = await Promise.all([
        axios.get("/api/reports", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("/api/health", { headers: { Authorization: `Bearer ${token}` } })
      ]);

      setData({
        stats: {
          users: reportsRes.data.totalUsers?.[0]?.count || 0,
          students: reportsRes.data.studentCount?.[0]?.count || 0,
          recruiters: reportsRes.data.recruiterCount?.[0]?.count || 0,
          jobs: reportsRes.data.totalJobs?.[0]?.count || 0,
          apps: reportsRes.data.totalApps?.[0]?.count || 0,
          hired: reportsRes.data.hiredCount?.[0]?.count || 0,
          skills: reportsRes.data.skillsCount?.[0]?.count || 0
        },
        pendingVerifications: reportsRes.data.pendingVerifications || [],
        recentActivity: reportsRes.data.recentActivity || [],
        health: healthRes.data
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`/api/users/${id}/verify`, { is_verified: status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData(); // Refresh list
    } catch (error) {
      console.error("Error updating verification:", error);
    }
  };

  if (loading) return <div className="p-8 text-slate-500">Loading Admin Dashboard...</div>;

  return (
    <div className="admin-dashboard-container">
      <h2 className="dashboard-title">Admin Dashboard</h2>

      {/* STATS CARDS (6 across) */}
      <div className="stats-grid-row">
        {[
          { label: 'Total Users', value: data.stats.users, color: 'primary' },
          { label: 'Students', value: data.stats.students, color: 'info' },
          { label: 'Recruiters', value: data.stats.recruiters, color: 'success' },
          { label: 'Jobs', value: data.stats.jobs, color: 'warning' },
          { label: 'Apps', value: data.stats.apps, color: 'danger' },
          { label: 'Hired', value: data.stats.hired, color: 'secondary' }
        ].map((stat, i) => (
          <div key={i} className={`stat-pill ${stat.color}`}>
            <span className="label text-xs uppercase font-bold">{stat.label}</span>
            <span className="value text-lg font-bold">{stat.value.toLocaleString()}</span>
          </div>
        ))}
      </div>

      <div className="dashboard-grid-main mt-8">
        {/* RECENT ACTIVITY TABLE */}
        <div className="dashboard-section">
          <h3 className="flex items-center gap-2"><span>🕒</span> Recent Activity</h3>
          <table className="dashboard-table-mini">
            <thead>
              <tr>
                <th>Type</th>
                <th>Detail</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {data.recentActivity.map((activity, i) => (
                <tr key={i}>
                  <td className="capitalize font-bold">{activity.type}</td>
                  <td>{activity.detail}</td>
                  <td className="text-slate-400 text-xs">{new Date(activity.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* VERIFICATION QUEUE */}
        <div className="dashboard-section">
          <h3 className="flex items-center gap-2"><span>🛡️</span> Verification Queue</h3>
          <div className="verification-list">
            {data.pendingVerifications.length > 0 ? data.pendingVerifications.map((item) => (
              <div key={item.id} className="verification-item">
                <div className="verification-info">
                  <h5>{item.name}</h5>
                  <p>{item.email}</p>
                </div>
                <div className="action-btns">
                  <button className="btn-approve" onClick={() => handleVerify(item.id, true)}>Approve</button>
                  <button className="btn-reject" onClick={() => handleVerify(item.id, false)}>Reject</button>
                </div>
              </div>
            )) : (
              <p className="text-slate-400 italic p-4 text-center">No recruiters waiting.</p>
            )}
          </div>
        </div>
      </div>

      {/* SYSTEM HEALTH */}
      <section className="dashboard-section mt-8">
        <h3>System Health</h3>
        <div className="health-metrics-row">
          <div className="health-metric">
            <span className="dot online"></span>
            <span className="label">Server Status:</span>
            <span className="val">{data.health?.api || 'Running'}</span>
          </div>
          <div className="health-metric">
            <span className="label">API Latency:</span>
            <span className="val">{data.health?.responseTime || '0ms'}</span>
          </div>
          <div className="health-metric">
            <span className="label">Active Errors:</span>
            <span className="val text-danger">{data.health?.errorCount || 0}</span>
          </div>
          <div className="health-metric">
            <span className="label">Uptime:</span>
            <span className="val">{data.health?.uptime || '0h'}</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
