import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Dashboard.css";
import { 
  Users, Briefcase, FileText, CheckCircle, 
  Activity, Shield, Sidebar as SidebarIcon, AlertCircle 
} from "lucide-react";

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/admin/reports", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-12 text-center text-slate-500 fade-in">Initializing administrative oversight...</div>;
  if (!data) return (
    <div className="p-12 text-center text-red-500 fade-in">
      <div className="text-4xl mb-4">⚠️</div>
      <h2 className="text-xl font-bold mb-2">Platform Connection Error</h2>
      <p className="mb-4">Unable to retrieve system statistics. Please verify the backend service is running.</p>
      <button onClick={fetchStats} className="px-6 py-2 bg-slate-800 text-white rounded-lg font-bold">Retry Connection</button>
    </div>
  );

  const stats = [
    { label: "Total Users", value: data.totalUsers, icon: <Users size={20} />, color: "bg-blue-50 text-blue-600" },
    { label: "Students", value: data.users.student || 0, icon: <Users size={20} />, color: "bg-indigo-50 text-indigo-600" },
    { label: "Recruiters", value: data.users.recruiter || 0, icon: <SidebarIcon size={20} />, color: "bg-purple-50 text-purple-600" },
    { label: "Jobs", value: data.totalJobs, icon: <Briefcase size={20} />, color: "bg-green-50 text-green-600" },
    { label: "Apps", value: data.totalApplications, icon: <FileText size={20} />, color: "bg-orange-50 text-orange-600" },
    { label: "Hired", value: data.totalHired || 0, icon: <CheckCircle size={20} />, color: "bg-emerald-50 text-emerald-600" },
  ];

  return (
    <div className="dashboard-container fade-in">
      <div className="dashboard-header mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Admin Dashboard</h2>
        <p className="text-slate-500">Live monitoring of system activity and performance.</p>
      </div>

      {/* Stats Cards - 6 across */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {stats.map((s, i) => (
          <div key={i} className="stat-card p-4 rounded-xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center mb-3`}>
              {s.icon}
            </div>
            <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{s.label}</div>
            <div className="text-2xl font-bold text-slate-800 mt-1">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* RECENT ACTIVITY */}
        <div className="lg:col-span-2 space-y-8">
          <section className="card p-6 bg-white border border-slate-200 rounded-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Activity size={20} className="text-indigo-600" /> Recent Activity
              </h3>
              <button onClick={() => navigate('/admin/reports')} className="text-xs text-indigo-600 font-bold hover:underline">View All</button>
            </div>
            <div className="overflow-hidden border border-slate-100 rounded-lg">
              <table className="w-full text-left">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="p-3 text-xs font-bold text-slate-500 uppercase">Type</th>
                    <th className="p-3 text-xs font-bold text-slate-500 uppercase">Detail</th>
                    <th className="p-3 text-xs font-bold text-slate-500 uppercase">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {data.recentActivity.map((act, i) => (
                    <tr key={i} className="hover:bg-slate-50/50">
                      <td className="p-3">
                         <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            act.type === 'signup' ? 'bg-blue-50 text-blue-600' : 
                            act.type === 'job' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                         }`}>
                            {act.type}
                         </span>
                      </td>
                      <td className="p-3 text-sm text-slate-700">{act.detail}</td>
                      <td className="p-3 text-xs text-slate-400">{new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* VERIFICATION QUEUE */}
          <section className="card p-6 bg-white border border-slate-200 rounded-xl">
             <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Shield size={20} className="text-amber-500" /> Verification Queue
              </h3>
              <button onClick={() => navigate('/admin/verify')} className="text-xs text-indigo-600 font-bold hover:underline">Manage Queue</button>
            </div>
            <div className="space-y-4">
               {data.verificationQueue.length === 0 ? (
                 <p className="text-sm text-slate-400 italic text-center py-4">Verification queue is empty.</p>
               ) : (
                 data.verificationQueue.map(rec => (
                   <div key={rec.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold">
                           {rec.name.charAt(0)}
                        </div>
                        <div>
                           <div className="text-sm font-bold text-slate-800">{rec.name}</div>
                           <div className="text-xs text-slate-500">{rec.email}</div>
                        </div>
                     </div>
                     <button 
                        onClick={() => navigate('/admin/verify')}
                        className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-colors"
                     >
                        Review
                     </button>
                   </div>
                 ))
               )}
            </div>
          </section>
        </div>

        {/* SYSTEM HEALTH SIDEBAR */}
        <aside className="space-y-6">
           <section className="card p-6 bg-slate-900 text-white rounded-xl shadow-lg border border-slate-800 overflow-hidden relative">
              <div className="relative z-10">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                   <Activity size={20} className="text-green-400" /> System Health
                </h3>
                <div className="space-y-6">
                   <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-sm">Server Status</span>
                      <span className="text-green-400 text-sm font-bold flex items-center gap-1.5">
                         <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span> Operational
                      </span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-sm">API Latency</span>
                      <span className="text-white text-sm font-bold">42ms</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-sm">Error Rate</span>
                      <span className="text-white text-sm font-bold">0.02%</span>
                   </div>
                   <div className="flex justify-between items-center border-t border-slate-800 pt-6">
                      <span className="text-slate-400 text-sm">Database</span>
                      <span className="text-green-400 text-sm font-bold">Healthy</span>
                   </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl"></div>
           </section>

           <section className="card p-6 bg-white border border-slate-200 rounded-xl">
              <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                 <AlertCircle size={16} className="text-red-500" /> Quick Tasks
              </h3>
              <div className="space-y-3">
                 <button onClick={() => navigate('/admin/users')} className="w-full p-3 text-left text-xs font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors border border-slate-100">
                    🔍 Search Users
                 </button>
                 <button onClick={() => navigate('/admin/jobs')} className="w-full p-3 text-left text-xs font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors border border-slate-100">
                    🗳️ Audit Open Jobs
                 </button>
              </div>
           </section>
        </aside>

      </div>
    </div>
  );
};

export default AdminDashboard;
