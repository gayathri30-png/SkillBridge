import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
    Users, Briefcase, FileText, TrendingUp, 
    Shield, Activity, Zap, ChevronLeft, Download
} from "lucide-react";

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

    const exportToCSV = () => {
        if (!reports) return;

        // 1. User Summary
        const totalUsers = reports.totalUsers?.[0]?.count || 0;
        const students = reports.studentCount?.[0]?.count || 0;
        const recruiters = reports.recruiterCount?.[0]?.count || 0;
        
        let csvContent = "data:text/csv;charset=utf-8,";
        
        // --- SECTION 1: USER PLATFORM METRICS ---
        csvContent += "PLATFORM USER METRICS\n";
        csvContent += "Metric,Count\n";
        csvContent += `Total Users,${totalUsers}\n`;
        csvContent += `Total Students,${students}\n`;
        csvContent += `Total Recruiters,${recruiters}\n\n`;

        // --- SECTION 2: NEW USER GROWTH ---
        csvContent += "DAILY USER GROWTH (Last 30 Days)\n";
        csvContent += "Date,New Users\n";
        if (reports.userGrowth) {
            reports.userGrowth.forEach(row => {
                const formattedDate = new Date(row.date).toLocaleDateString();
                csvContent += `"${formattedDate}",${row.count}\n`;
            });
        }
        csvContent += "\n";

        // --- SECTION 3: JOB ACTIVITY OVERVIEW ---
        csvContent += "LIFETIME JOB METRICS\n";
        csvContent += "Job Title,Status,Created Date,Total Applicants,Total Hired\n";
        if (reports.detailedJobs) {
            reports.detailedJobs.forEach(job => {
                const formattedDate = new Date(job.created_date).toLocaleDateString();
                csvContent += `"${job.title}","${job.status}","${formattedDate}",${job.applicants || 0},${job.hired || 0}\n`;
            });
        }

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `SkillBridge_Platform_Report_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-[80vh] w-full fade-in">
            <div className="relative w-24 h-24 flex items-center justify-center">
                <div className="absolute inset-0 border-4 border-indigo-200 rounded-full animate-ping opacity-20"></div>
                <div className="absolute inset-2 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
                <Zap size={24} className="text-indigo-600 animate-pulse" />
            </div>
            <p className="mt-6 text-slate-500 font-mono tracking-widest text-sm uppercase">Synthesizing Data Streams...</p>
        </div>
    );
    
    if (!reports) return <div className="p-8 text-center text-slate-500 font-mono">No telemetry data available.</div>;

    // Helper functions for futuristic visuals
    const getRoleColor = (role) => {
        switch(role.toLowerCase()) {
            case 'admin': return 'from-purple-500 to-indigo-600';
            case 'recruiter': return 'from-blue-400 to-cyan-500';
            case 'student': return 'from-emerald-400 to-teal-500';
            default: return 'from-slate-400 to-slate-600';
        }
    };

    const getStatusColor = (status) => {
        switch(status.toLowerCase()) {
            case 'open': return 'bg-emerald-500 shadow-emerald-500/50';
            case 'closed': return 'bg-rose-500 shadow-rose-500/50';
            case 'pending': return 'bg-amber-500 shadow-amber-500/50';
            case 'accepted': return 'bg-cyan-500 shadow-cyan-500/50';
            case 'rejected': return 'bg-red-500 shadow-red-500/50';
            default: return 'bg-slate-500 shadow-slate-500/50';
        }
    };

    const maxRoleCount = Math.max(...(reports.roleDistribution?.map(r => r.count) || [1]));

    return (
        <div className="min-h-screen bg-slate-50 p-8 fade-in flex flex-col gap-8 relative overflow-hidden">
            {/* Background Futuristic Grid/Glow */}
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-900/5 to-transparent pointer-events-none"></div>
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute top-40 -left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none"></div>

            <header className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <button 
                        onClick={() => navigate("/admin")} 
                        className="w-fit flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 hover:text-indigo-800 transition-colors mb-2 bg-indigo-50 px-3 py-1.5 rounded-full"
                    >
                        <ChevronLeft size={14} /> Back to Command Center
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center shadow-lg shadow-indigo-500/30 text-white">
                            <Activity size={24} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 tracking-tight">System Telemetry</h1>
                            <p className="text-slate-500 text-sm font-medium">Real-time analytical overview of platform dynamics.</p>
                        </div>
                    </div>
                </div>
                <button 
                    onClick={exportToCSV}
                    className="flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all shadow-lg shadow-slate-900/20 active:scale-95 group"
                >
                    <Download size={18} className="group-hover:-translate-y-1 transition-transform" />
                    Download CSV Report
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10 w-full">
                
                {/* ROLE DISTRIBUTION (Futuristic Progress Bars) */}
                <div className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-xl shadow-slate-200/50 rounded-2xl p-6 relative overflow-hidden group hover:border-indigo-100 transition-colors">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/5 to-transparent rounded-bl-full pointer-events-none"></div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                        <Users size={16} className="text-indigo-500" /> Identity Matrix
                    </h3>
                    <div className="flex flex-col gap-5">
                        {reports.roleDistribution?.map(row => (
                            <div key={row.role} className="relative">
                                <div className="flex justify-between items-end mb-1.5">
                                    <span className="capitalize font-bold text-slate-700 text-sm">{row.role}s</span>
                                    <span className="font-mono font-bold text-slate-900">{row.count}</span>
                                </div>
                                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full rounded-full bg-gradient-to-r ${getRoleColor(row.role)} transition-all duration-1000 ease-out`}
                                        style={{ width: `${(row.count / maxRoleCount) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* JOB STATUS (Glowing Status Badges) */}
                <div className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-xl shadow-slate-200/50 rounded-2xl p-6 relative overflow-hidden group hover:border-blue-100 transition-colors">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-transparent rounded-bl-full pointer-events-none"></div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                        <Briefcase size={16} className="text-blue-500" /> Marketplace Status
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        {reports.jobStats?.map(row => (
                            <div key={row.status} className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col items-start gap-3 hover:bg-white hover:shadow-md transition-all">
                                <div className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full shadow-lg animate-pulse ${getStatusColor(row.status)}`}></span>
                                    <span className="capitalize font-bold text-slate-600 text-xs tracking-wider">{row.status}</span>
                                </div>
                                <span className="text-3xl font-black text-slate-800">{row.count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* APPLICATION OUTCOMES (Cyberpunk Data List) */}
                <div className="bg-slate-900 border border-slate-800 shadow-2xl rounded-2xl p-6 relative overflow-hidden group">
                    {/* Dark theme card for contrast */}
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"></div>
                    
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2 relative z-10">
                        <FileText size={16} className="text-cyan-400" /> Funnel Metrics
                    </h3>
                    <div className="flex flex-col gap-3 relative z-10">
                        {reports.applicationStats?.map(row => (
                            <div key={row.status} className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:bg-slate-800 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className={`p-1.5 rounded-md bg-slate-900 border ${
                                        row.status === 'accepted' ? 'border-emerald-500/50 text-emerald-400' :
                                        row.status === 'rejected' ? 'border-rose-500/50 text-rose-400' :
                                        'border-amber-500/50 text-amber-400'
                                    }`}>
                                        <Shield size={14} />
                                    </div>
                                    <span className="capitalize font-medium text-slate-200">{row.status}</span>
                                </div>
                                <span className={`text-xl font-bold font-mono ${
                                    row.status === 'accepted' ? 'text-emerald-400' :
                                    row.status === 'rejected' ? 'text-rose-400' :
                                    'text-amber-400'
                                }`}>
                                    {row.count}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RECENT USER GROWTH (Minimalist Timeline) */}
                <div className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-xl shadow-slate-200/50 rounded-2xl p-6 relative overflow-hidden">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                        <TrendingUp size={16} className="text-purple-500" /> Network Expansion
                    </h3>
                    <div className="flex flex-col max-h-[220px] overflow-y-auto pr-2 custom-scrollbar relative">
                        {/* Vertical timeline line */}
                        <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-100 rounded-full"></div>
                        
                        {reports.userGrowth?.map((row, idx) => (
                            <div key={row.date} className="flex items-center gap-6 py-3 relative z-10 group">
                                <div className="w-6 h-6 rounded-full bg-white border-2 border-purple-200 flex items-center justify-center shrink-0 group-hover:border-purple-500 transition-colors shadow-sm">
                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                                </div>
                                <div className="flex-1 flex justify-between items-center bg-slate-50/50 group-hover:bg-purple-50/50 px-4 py-2 rounded-lg transition-colors border border-transparent group-hover:border-purple-100">
                                    <span className="text-xs font-bold text-slate-500 font-mono">
                                        {new Date(row.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </span>
                                    <span className="font-black text-purple-600 flex items-center gap-1">
                                        <TrendingUp size={12} className="text-purple-400" /> +{row.count}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {(!reports.userGrowth || reports.userGrowth.length === 0) && (
                            <p className="text-slate-400 text-sm italic pl-8">No growth data in the specified range.</p>
                        )}
                    </div>
                </div>

            </div>
            
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }
            `}</style>
        </div>
    );
};

export default AdminReports;
