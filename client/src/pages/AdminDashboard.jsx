import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  Users, Briefcase, FileText, CheckCircle, 
  Activity, Shield, Sidebar as SidebarIcon, Search, LayoutDashboard
} from "lucide-react";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/admin/reports", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
      <div className="flex flex-col items-center justify-center h-[80vh] w-full fade-in">
          <div className="relative w-24 h-24 flex items-center justify-center">
              <div className="absolute inset-0 border-4 border-indigo-200 rounded-full animate-ping opacity-20"></div>
              <div className="absolute inset-2 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
              <LayoutDashboard size={24} className="text-indigo-600 animate-pulse" />
          </div>
          <p className="mt-6 text-slate-500 font-mono tracking-widest text-sm uppercase">Initializing Command Center...</p>
      </div>
  );

  if (!data) return (
    <div className="flex flex-col items-center justify-center h-[80vh] w-full text-red-500 fade-in">
      <div className="text-5xl mb-4">⚠️</div>
      <h2 className="text-2xl font-bold mb-2 text-slate-800">Connection Interrupted</h2>
      <p className="mb-6 text-slate-500">Unable to establish secure uplink with backend telemetry services.</p>
      <button onClick={fetchData} className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all shadow-lg active:scale-95">Re-Establish Connection</button>
    </div>
  );

  const stats = [
    { label: "Total Users", value: data.totalUsers, icon: <Users size={20} />, gradient: "from-blue-500 to-cyan-400" },
    { label: "Students", value: data.users?.student || 0, icon: <Users size={20} />, gradient: "from-indigo-500 to-purple-500" },
    { label: "Recruiters", value: data.users?.recruiter || 0, icon: <SidebarIcon size={20} />, gradient: "from-purple-500 to-pink-500" },
    { label: "Jobs", value: data.totalJobs, icon: <Briefcase size={20} />, gradient: "from-emerald-400 to-teal-500" },
    { label: "Apps", value: data.totalApplications, icon: <FileText size={20} />, gradient: "from-amber-400 to-orange-500" },
    { label: "Hired", value: data.totalHired || 0, icon: <CheckCircle size={20} />, gradient: "from-green-500 to-emerald-600" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8 fade-in flex flex-col gap-8 relative overflow-hidden">
      {/* Background Futuristic Grid/Glow */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-slate-900/5 to-transparent pointer-events-none"></div>
      <div className="absolute top-40 -right-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute -bottom-40 left-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 tracking-tight mb-1">Command Center</h2>
          <p className="text-slate-500 font-medium">Live monitoring and administrative control matrix.</p>
        </div>
        <div className="flex gap-3">
             <button onClick={() => navigate('/admin/users')} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-600 rounded-xl text-sm font-bold shadow-sm transition-all">
                <Search size={16} /> Audit Users
             </button>
        </div>
      </div>

      {/* Stats Cards - Futuristic Glassmorphism layout */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 relative z-10">
        {stats.map((s, i) => (
          <div key={i} className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-xl shadow-slate-200/50 rounded-2xl p-5 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${s.gradient} opacity-10 rounded-bl-full`}></div>
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.gradient} text-white flex items-center justify-center mb-4 shadow-lg shadow-${s.gradient.split('-')[1]}-500/30 group-hover:scale-110 transition-transform`}>
              {s.icon}
            </div>
            <div className="flex flex-col gap-1 relative z-10">
                <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{s.label}</div>
                <div className="text-3xl font-black text-slate-800 tracking-tight">{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-8 relative z-10 w-full mb-12">
        {/* MAIN ACTIVITY & QUEUE SECTION */}
        <div className="w-full space-y-8">

          {/* VERIFICATION QUEUE */}
          <section className="bg-slate-900 border border-slate-800 shadow-2xl rounded-2xl p-6 relative overflow-hidden group">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
             <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] pointer-events-none"></div>
             
             <div className="flex justify-between items-center mb-6 relative z-10">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Shield size={20} className="text-amber-400" /> Verification Protocol
              </h3>
              <button onClick={() => navigate('/admin/verify')} className="px-4 py-1.5 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 rounded-lg text-xs font-bold border border-amber-500/20 transition-colors">Process Queue</button>
            </div>
            
            <div className="space-y-3 relative z-10">
               {!data.verificationQueue || data.verificationQueue.length === 0 ? (
                 <div className="p-8 border border-dashed border-slate-700 rounded-xl text-center text-slate-500 font-mono text-sm">
                     System secure. No pending verifications detected.
                 </div>
               ) : (
                 data.verificationQueue.map(rec => (
                   <div key={rec.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:bg-slate-800 transition-colors">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold shadow-lg shadow-amber-500/20">
                           {rec.name.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                           <div className="text-sm font-bold text-slate-200">{rec.name}</div>
                           <div className="text-xs text-slate-400 font-mono">{rec.email}</div>
                        </div>
                     </div>
                     <button 
                        onClick={() => navigate('/admin/verify')}
                        className="px-4 py-2 bg-indigo-600/20 text-indigo-400 text-xs font-bold rounded-lg border border-indigo-500/30 hover:bg-indigo-600 hover:text-white transition-all"
                     >
                        Evaluate
                     </button>
                   </div>
                 ))
               )}
            </div>
          </section>

          {/* RECENT ACTIVITY */}
          <section className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-xl shadow-slate-200/50 rounded-2xl p-6 relative overflow-hidden group">
            <div className="flex justify-between items-center mb-6 relative z-10">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Activity size={20} className="text-indigo-600" /> Event Stream
              </h3>
              <button 
                  onClick={() => navigate('/admin/reports')} 
                  className="text-xs font-bold uppercase tracking-wider text-indigo-600 hover:text-indigo-800 hover:underline"
                >
                    View Telemetry
                </button>
            </div>
            <div className="overflow-hidden border border-slate-100 rounded-xl relative z-10 bg-white shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-slate-50/80">
                  <tr>
                    <th className="p-4 text-xs font-black text-slate-400 uppercase tracking-widest">Type</th>
                    <th className="p-4 text-xs font-black text-slate-400 uppercase tracking-widest">Detail</th>
                    <th className="p-4 text-xs font-black text-slate-400 uppercase tracking-widest">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/50">
                  {data.recentActivity && data.recentActivity.map((act, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4">
                         <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                            act.type === 'signup' ? 'bg-blue-50 text-blue-600 border border-blue-200' : 
                            act.type === 'job' ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-orange-50 text-orange-600 border border-orange-200'
                         }`}>
                            {act.type}
                         </span>
                      </td>
                      <td className="p-4 text-sm font-medium text-slate-700">{act.detail}</td>
                      <td className="p-4 text-xs text-slate-400 font-mono">
                          {new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </td>
                    </tr>
                  ))}
                  {(!data.recentActivity || data.recentActivity.length === 0) && (
                      <tr><td colSpan="3" className="p-8 text-center text-slate-400 italic font-mono text-sm">No recent events tracked.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
