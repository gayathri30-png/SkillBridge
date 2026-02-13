import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    jobs: 0,
    applications: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const [usersRes, jobsRes, appsRes] = await Promise.all([
        axios.get("/api/users", {
            headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get("/api/jobs", {
            headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get("/api/applications/all", {
            headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setStats({
        users: usersRes.data.length,
        jobs: jobsRes.data.length,
        applications: appsRes.data.count || 0,
      });
    } catch (error) {
      console.error("Error fetching admin stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-slate-500">Loading system stats...</div>;

  return (
    <div className="admin-view fade-in p-8">
      <header className="mb-10">
        <h1 className="mb-2">Admin Control Center</h1>
        <p className="text-slate-500">Real-time system oversight and statistics.</p>
      </header>

      <div className="admin-stats-grid grid-cols-3">
        <div className="card card-hover p-6 cursor-pointer group" onClick={() => navigate("/admin/users")}>
          <div className="flex-between mb-4">
             <div className="w-12 h-12 rounded-lg bg-primary-soft text-primary flex items-center justify-center text-2xl group-hover:bg-primary group-hover:text-white transition-all">👥</div>
             <span className="text-xs font-bold text-success">+12% vs last month</span>
          </div>
          <h4 className="text-slate-500 uppercase tracking-widest text-xs font-bold mb-1">Total Registered Users</h4>
          <h2 className="text-4xl font-bold m-0">{stats.users}</h2>
        </div>

        <div className="card card-hover p-6 cursor-pointer group" onClick={() => navigate("/admin/jobs")}>
          <div className="flex-between mb-4">
             <div className="w-12 h-12 rounded-lg bg-info-soft text-info flex items-center justify-center text-2xl group-hover:bg-info group-hover:text-white transition-all">💼</div>
             <span className="text-xs font-bold text-slate-400">Stable</span>
          </div>
          <h4 className="text-slate-500 uppercase tracking-widest text-xs font-bold mb-1">Active Job Listings</h4>
          <h2 className="text-4xl font-bold m-0">{stats.jobs}</h2>
        </div>

        <div className="card p-6 group">
          <div className="flex-between mb-4">
             <div className="w-12 h-12 rounded-lg bg-success-soft text-success flex items-center justify-center text-2xl group-hover:bg-success group-hover:text-white transition-all">📄</div>
             <span className="text-xs font-bold text-primary">New Peak</span>
          </div>
          <h4 className="text-slate-500 uppercase tracking-widest text-xs font-bold mb-1">Processed Applications</h4>
          <h2 className="text-4xl font-bold m-0">{stats.applications}</h2>
        </div>
      </div>

      <section className="mt-12 bg-slate-900 rounded-3xl p-10 text-white relative overflow-hidden">
         <div className="relative z-10 max-w-lg">
            <h3 className="text-white mb-4">Quick Management</h3>
            <p className="text-slate-400 mb-8">Directly access user verification logs or audit job postings for compliance.</p>
            <div className="flex gap-4">
               <button className="btn btn-primary" onClick={() => navigate('/admin/users')}>Manage Users</button>
               <button className="btn btn-outline border-white text-white hover:bg-white hover:text-slate-900" onClick={() => navigate('/admin/jobs')}>Audit Jobs</button>
            </div>
         </div>
         <div className="absolute right-[-20px] bottom-[-20px] text-[200px] leading-none opacity-5 font-bold">ADM</div>
      </section>
    </div>
  );
};

export default AdminDashboard;

