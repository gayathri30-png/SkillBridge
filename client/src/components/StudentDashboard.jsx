import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Bell, Settings, TrendingUp, 
  Briefcase, Target, Zap, ChevronRight,
  Clock, ArrowUpRight, AlertCircle,
  Lightbulb, Sparkles, MessageSquare, 
  Calendar, FileText, CheckCircle2,
  ExternalLink, Plus, Filter, RotateCcw,
  Code, Palette, Globe, Database, ChevronsRight
} from 'lucide-react';
import axios from "axios";
import "./StudentDashboard.css";

const StudentDashboard = ({ user }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    profileStrength: 75,
    appsSent: 0,
    matchScoreAvg: 0,
    skillGap: 0,
    pendingInterviews: 0
  });
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [userSkills, setUserSkills] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [messages, setMessages] = useState([]);
  const [skillGaps, setSkillGaps] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [portfolioInsights, setPortfolioInsights] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const triggerAIAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const token = localStorage.getItem('token');
      // Pass a default jobTitle to ensure the backend detector mode works flawlessly
      await axios.get('/api/ai/skill-gap/pathways?jobTitle=Frontend Developer', { headers: { Authorization: `Bearer ${token}` } });
      const summaryRes = await axios.get('/api/ai/summary', { headers: { Authorization: `Bearer ${token}` } });
      setSkillGaps(summaryRes.data.skillGaps || []);
    } catch (err) {
      console.error("AI Analysis Failed", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        // 1. Fetch AI Summary (Stats & Insights)
        const summaryRes = await axios.get('/api/ai/summary', { headers });
        const summary = summaryRes.data;
        
        setStats({
          profileStrength: summary.portfolio.overall_score || 75,
          appsSent: summary.application_count || 0,
          matchScoreAvg: summary.match_score_avg || 0,
          skillGap: summary.skillGaps?.length > 0 ? 100 - (summary.skillGaps[0].match_percentage || 0) : 0,
          pendingInterviews: summary.interview_count || 0
        });

        setSkillGaps(summary.skillGaps || []);
        setPortfolioInsights(summary.portfolio);

        // 2. Fetch Recommended Jobs (Real DB Jobs)
        const [jobsRes, profileRes] = await Promise.all([
          axios.get('/api/jobs', { headers }),
          axios.get('/api/users/profile', { headers })
        ]);

        const currentSkills = profileRes.data.skills || [];
        setUserSkills(currentSkills);
        
        const jobs = jobsRes.data.slice(0, 4);
        const userSkillSet = new Set(currentSkills.map(s => s.skill_name.toLowerCase()));

        const enrichedJobs = jobs.map(j => {
          const jobSkills = j.skills_required || [];
          let matches = 0;
          if (jobSkills.length > 0) {
            jobSkills.forEach(s => {
              if (userSkillSet.has(s.toLowerCase())) matches++;
            });
          }
          const score = jobSkills.length > 0 ? Math.round((matches / jobSkills.length) * 100) : 0;
          return { ...j, matchScore: score };
        });

        setRecommendedJobs(enrichedJobs);

        // Update stats average to reflect current recommendations
        if (enrichedJobs.length > 0) {
          const avg = Math.round(enrichedJobs.reduce((sum, j) => sum + j.matchScore, 0) / enrichedJobs.length);
          setStats(prev => ({ ...prev, matchScoreAvg: avg }));
        }

        // 3. Fetch Recent Applications (Real DB Data)
        const appsRes = await axios.get('/api/applications/student', { headers });
        setRecentApplications(appsRes.data.slice(0, 5));

        // 4. Fetch Recent Messages
        const roomsRes = await axios.get('/api/chat/rooms', { headers });
        setMessages(roomsRes.data.slice(0, 3));

      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 bg-slate-50">
        <motion.div 
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1],
            borderRadius: ["20%", "50%", "20%"]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-xl"
        />
        <p className="text-slate-500 font-black tracking-widest uppercase text-xs animate-pulse">Initializing Career Intelligence...</p>
      </div>
    );
  }

  // Animation variants
  const containerVars = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <motion.div 
      className="dashboard-wrapper"
      variants={containerVars}
      initial="hidden"
      animate="show"
    >
      {/* --- 1. WELCOME & SEARCH --- */}
      <motion.header className="welcome-header" variants={itemVars}>
        <div className="welcome-text">
          <h1 className="font-outfit">
            Welcome back, {user.name.split(' ')[0]}! 👋
          </h1>
          <div className="ai-insight-banner intelligence-glow">
            <Sparkles size={18} className="text-blue-600 animate-pulse" />
            <p>
              {stats.matchScoreAvg > 80 
                ? `Intelligence Active: You're in the top 2% for ${recommendedJobs.length} real-world roles. Optimizing...` 
                : "AI analysis complete. Refine your portfolio to unlock 15+ more high-match opportunities."}
            </p>
          </div>
        </div>
        <div className="profile-badge-interactive" onClick={() => navigate('/profile')}>
           <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
             {user.name.charAt(0)}
           </div>
           <div className="hidden md:block">
             <p className="text-sm font-bold text-slate-900 mb-0">{user.name}</p>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{user.role}</p>
           </div>
        </div>
      </motion.header>

      {/* --- 2. STATS GRID --- */}
       <section className="stats-grid mb-12">
        <StatCard 
          icon={<div className="holographic-icon-layer"><TrendingUp size={24} /></div>} 
          label="Profile Strength" 
          value={`${stats.profileStrength}%`} 
          color="blue" 
          onClick={() => navigate('/profile')}
          actionText="Analyze"
          delay={0.1}
        />
        <StatCard 
          icon={<div className="holographic-icon-layer"><FileText size={24} /></div>} 
          label="Applications Sent" 
          value={stats.appsSent} 
          color="purple" 
          onClick={() => navigate('/applications')}
          actionText="View All"
          delay={0.2}
        />
        <StatCard 
          icon={<div className="holographic-icon-layer"><Sparkles size={24} /></div>} 
          label="AI Match Avg" 
          value={`${stats.matchScoreAvg}%`} 
          color="amber" 
          onClick={() => navigate('/ai/skill-gap')}
          actionText="Optimize"
          delay={0.3}
        />
        <StatCard 
          icon={<div className="holographic-icon-layer"><Calendar size={24} /></div>} 
          label="Interviews" 
          value={stats.pendingInterviews} 
          color="rose" 
          onClick={() => navigate('/applications')}
          actionText="Attend"
          delay={0.4}
        />
      </section>

      {/* --- 3. RECOMMENDED JOBS --- */}
      <section>
        <div className="section-header">
           <h2 className="flex items-center gap-3">
             <Sparkles size={24} style={{ color: 'var(--neon-blue)' }} /> AI Recommendations
           </h2>
            <Link to="/jobs" className="text-sm font-black flex items-center gap-2 hover:translate-x-2 transition-all tracking-wider uppercase" style={{ color: 'var(--neon-blue)' }}>
              Explore All <ChevronsRight size={18} className="symbol-glow" />
            </Link>
        </div>
        <div className="jobs-grid">
          {recommendedJobs.map((job, idx) => (
            <motion.div 
              key={job.id || idx}
              className="job-premium-card cursor-pointer"
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * idx }}
              onClick={() => navigate(`/jobs/${job.id}`)}
            >
              <div className="flex justify-between items-start relative z-10 w-full">
                 <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black ${job.title.toLowerCase().includes('backend') ? 'text-emerald-400 bg-emerald-400/10' : job.title.toLowerCase().includes('frontend') ? 'text-blue-400 bg-blue-400/10' : 'text-purple-400 bg-purple-400/10'} text-xl shadow-lg border border-white/5 backdrop-blur-md`}>
                    <div className="holographic-icon-layer">
                      {job.title.toLowerCase().includes('backend') ? <Database size={24} /> : 
                        job.title.toLowerCase().includes('frontend') ? <Globe size={24} /> : 
                        job.title.toLowerCase().includes('design') ? <Palette size={24} /> : <Code size={24} />}
                    </div>
                 </div>
                 <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-amber-400 flex items-center gap-2 backdrop-blur-sm shadow-xl">
                   <Zap size={14} className="symbol-glow" /> {job.matchScore}% Match
                 </div>
              </div>
              
              <div className="relative z-10 w-full mt-2">
                <h3 className="text-xl font-bold mb-3 text-white leading-tight">{job.title}</h3>
                <p className="text-slate-400 font-medium text-sm flex items-center gap-2">
                  <Briefcase size={16} className="text-slate-500" /> {job.company_name} • {job.location}
                </p>
              </div>
              
              <div className="w-full space-y-4 relative z-10">
                 <div className="p-5 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm w-full">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3 text-blue-400">
                      <span>Match Quality</span>
                      <span className="text-white/40">High Potential</span>
                    </div>
                    <div className="match-bar-container cyber-scanner mt-3">
                       <motion.div 
                         className={`match-bar ${job.matchScore >= 80 ? 'high' : job.matchScore >= 50 ? 'mid' : 'low'}`} 
                         initial={{ width: 0 }}
                         animate={{ width: `${job.matchScore}%` }}
                         transition={{ duration: 1, delay: 0.5 }}
                       />
                    </div>
                 </div>

                 <div className="flex justify-between items-center w-full mt-2">
                    <button 
                     onClick={(e) => {
                       e.stopPropagation();
                       navigate(`/jobs/${job.id}`);
                     }}
                     className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-[20px] font-black text-xs uppercase tracking-widest transition-all shadow-2xl shadow-blue-900/40 flex items-center justify-center gap-3 border border-blue-500/50"
                    >
                      Apply Now <Sparkles size={16} />
                    </button>
                 </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- 4. MODULES GRID --- */}
      <div className="modules-grid">
        {/* Recent Applications (REPLACED PLACEHOLDER COLOR/TEXT) */}
        <motion.div className="module-card col-span-1 lg:col-span-2" variants={itemVars}>
          <div className="flex justify-between items-center mb-8">
            <h3 className="!mb-0 flex items-center gap-3">
              <div className="holographic-icon-layer"><Clock size={24} className="text-blue-500" /></div> Recent Applications
            </h3>
            <button onClick={() => navigate('/applications')} className="text-[10px] font-black text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-lg">Full History</button>
          </div>
          <div className="overflow-x-auto">
             <table className="premium-table w-full">
               <thead>
                 <tr>
                    <th className="text-left">Position</th>
                    <th className="text-left">Status</th>
                    <th className="text-left">AI Match</th>
                    <th className="text-left">Applied</th>
                 </tr>
               </thead>
               <tbody>
                 {recentApplications.map((app, i) => (
                   <tr key={app.id || i} className="group cursor-pointer" onClick={() => navigate('/applications')}>
                      <td>
                        <div className="font-bold text-slate-800">{app.title}</div>
                        <div className="text-xs text-slate-400 font-semibold">{app.company_name}</div>
                      </td>
                      <td>
                        <span className={`status-tag ${app.status?.toLowerCase() || 'pending'}`}>
                          {app.status || 'Pending'}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-3">
                           <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                           <span className="text-sm font-bold">{app.ai_match_score || 85}%</span>
                        </div>
                      </td>
                      <td className="text-xs text-slate-400 font-black uppercase tracking-tighter">
                        {new Date(app.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </td>
                   </tr>
                 ))}
                 {recentApplications.length === 0 && (
                   <tr>
                     <td colSpan="4" className="text-center py-12 text-slate-400 italic font-medium">No active applications found.</td>
                   </tr>
                 )}
               </tbody>
             </table>
          </div>
        </motion.div>

        {/* AI Proposal Engine (DYNAMIC DATA) */}
        <motion.div className="module-card bg-slate-900 border-none relative overflow-hidden group" variants={itemVars}>
           <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/20 blur-[100px] group-hover:bg-blue-600/30 transition-all" />
           <div className="relative z-10">
             <div className="flex items-center gap-3 mb-4">
                <Zap size={24} className="text-amber-400" />
                <h3 className="!text-white !mb-0 font-outfit">AI Proposal Engine</h3>
             </div>
             <p className="text-slate-400 text-sm mb-8 leading-relaxed font-medium">Tailor your profile to any job in seconds using our advanced predictive AI models.</p>
             
             <div className="space-y-4">
                <div className="p-5 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
                   <label className="text-[10px] font-black uppercase text-blue-400 tracking-widest mb-3 block">Target Job Context</label>
                   <select className="quick-generate-select w-full font-bold outline-none">
                      {recommendedJobs.length > 0 ? recommendedJobs.map(j => (
                        <option key={j.id} value={j.id}>{j.title} @ {j.company_name}</option>
                      )) : (
                        <option>Choose a recommended job</option>
                      )}
                   </select>
                </div>
                <button 
                  onClick={() => navigate('/ai')}
                  className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-3xl font-black text-xs uppercase tracking-widest transition-all shadow-2xl shadow-blue-900/40 flex items-center justify-center gap-3"
                >
                  Boost Match Score <Sparkles size={16} />
                </button>
             </div>
           </div>
        </motion.div>

        {/* Skill Gap focus (REAL DATA) */}
        <motion.div className="module-card" variants={itemVars}>
           <h3 className="flex items-center gap-3">
             <div className="holographic-icon-layer"><Target size={24} className="text-rose-500" /></div> Priority Upskilling
           </h3>
           <div className="space-y-4">
              {skillGaps.length > 0 ? skillGaps.slice(0, 2).map((gap, i) => {
                const words = gap.job_title ? gap.job_title.split(' ') : ['New', 'Role'];
                const firstPart = words[0];
                const restPart = words.slice(1).join(' ');
                // Logic based on actual database data
                const isUrgent = gap.match_percentage < 60;
                
                return (
                 <div key={i} className="priority-item glass-morphic-item flex items-center justify-between !py-6 !px-8">
                    <div className="flex items-center gap-6">
                       <div className="flex items-center gap-3">
                         <span className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest ${isUrgent ? 'bg-rose-100/80 text-[#334155]' : 'bg-[#fef3c7] text-[#92400e]'}`}>
                           {isUrgent ? 'Urgent' : 'Suggested'}
                         </span>
                         <div className="symbol-glow"><Lightbulb size={18} className="text-amber-400 opacity-90" /></div>
                       </div>
                       <h4 className="font-extrabold text-[#1e293b] text-[15px] leading-snug">
                         {firstPart}<br/>{restPart}
                       </h4>
                    </div>
                    <button 
                      onClick={() => navigate('/ai/skill-gap')}
                      className="px-6 py-3 glass-neon-btn text-white rounded-[20px] text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all w-36 shadow-lg"
                    >
                      Analyse Skill Gap
                    </button>
                 </div>
                );
              }) : (
                <div className="py-12 bg-slate-50/30 rounded-[40px] border border-dashed border-slate-200 text-center glass-morphic-item">
                   <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100">
                     <RotateCcw size={28} className={`text-blue-500 symbol-glow ${isAnalyzing ? 'animate-spin' : ''}`} />
                   </div>
                   <p className="text-[11px] text-[#1e293b] font-black uppercase tracking-widest mb-4">Profile Analysis Pending</p>
                   <button 
                     onClick={triggerAIAnalysis}
                     className="glass-action-btn px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest"
                     disabled={isAnalyzing}
                   >
                     {isAnalyzing ? "Running AI..." : "Analyze Profile Now"}
                   </button>
                </div>
              )}
          </div>
        </motion.div>

        {/* Interviews - REAL STATUS CHECK */}
        <motion.div className="module-card" variants={itemVars}>
            <div className="flex justify-between items-center mb-8">
               <h3 className="!mb-0 flex items-center gap-3">
                 <div className="holographic-icon-layer"><Calendar size={24} className="text-purple-500" /></div> Upcoming
               </h3>
               <div className="w-10 h-10 glass-icon-box rounded-xl flex items-center justify-center text-slate-400 cursor-pointer hover:text-slate-900 transition-all">
                 <Plus size={20} />
               </div>
            </div>
           <div className="space-y-5 w-full">
              {recentApplications.filter(a => ['shortlist', 'interview', 'offered'].includes(a.status?.toLowerCase())).length > 0 ? (
                recentApplications.filter(a => ['shortlist', 'interview', 'offered'].includes(a.status?.toLowerCase())).slice(0, 2).map((app, i) => (
                  <div key={app.id || i} className="p-6 border-l-4 border-indigo-500 bg-indigo-50/30 rounded-r-3xl backdrop-blur-sm">
                     <div className="flex justify-between items-start mb-3">
                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{app.status === 'interview' ? 'Final Round' : 'Screening Round'}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Confirmed</span>
                     </div>
                     <h4 className="font-bold text-slate-800 mb-1">Interview @ {app.company_name}</h4>
                     <p className="text-xs text-slate-500 font-medium mb-5">{app.title}</p>
                      <button 
                       onClick={() => navigate('/applications')}
                       className="w-full py-4 glass-action-btn rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all mt-4"
                      >
                         Prepare With AI <Sparkles size={14} className="ml-2 inline symbol-glow" />
                      </button>
                  </div>
                ))
              ) : (
                 <div className="py-16 text-center glass-morphic-item rounded-[40px]">
                    <div className="relative mb-6">
                      <Clock size={48} className="mx-auto text-slate-100/50" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-blue-500/5 blur-xl animate-pulse"></div>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-300 font-black uppercase tracking-widest">No Scheduled Interviews</p>
                 </div>
              )}
           </div>
        </motion.div>

        {/* Messages */}
         <motion.div className="module-card" variants={itemVars}>
           <h3 className="flex items-center gap-3">
             <div className="holographic-icon-layer"><MessageSquare size={24} className="text-emerald-500" /></div> Networking
           </h3>
          <div className="space-y-4">
            {messages.map((room, i) => (
              <div 
                key={room.id} 
                className="flex items-center gap-5 p-4 rounded-3xl hover:bg-slate-50 transition-all cursor-pointer group border border-transparent hover:border-slate-100"
                onClick={() => navigate(`/chat`)}
              >
                 <div className="w-12 h-12 bg-gradient-to-tr from-blue-50 to-indigo-50 rounded-2xl flex items-center justify-center font-bold text-blue-600 border border-blue-100 shadow-sm">
                    {room.recruiter_name?.charAt(0) || 'R'}
                 </div>
                 <div className="flex-1 overflow-hidden">
                    <div className="flex justify-between items-center mb-1">
                       <h4 className="font-bold text-sm tracking-tight text-slate-800">{room.recruiter_name || "Recruiter"}</h4>
                       <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">
                         {room.last_message_at ? new Date(room.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'ACTIVE'}
                       </span>
                    </div>
                    <p className="text-xs text-slate-400 font-medium line-clamp-1 group-hover:text-slate-600 transition-colors italic">
                      {room.last_message || "Profile connection established."}
                    </p>
                 </div>
              </div>
            ))}
             {messages.length === 0 && (
               <div className="py-16 text-center glass-morphic-item rounded-[40px] mb-6">
                 <MessageSquare size={48} className="mx-auto text-slate-100/50 mb-6" />
                 <p className="text-[10px] text-slate-300 font-black uppercase tracking-widest">No active career chats</p>
               </div>
             )}
             <button 
               onClick={() => navigate('/chat')}
               className="w-full py-4 glass-action-btn rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
             >
               Open Inbox <ChevronsRight size={14} className="ml-2 inline symbol-glow" />
             </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Sub-component for Stats
const StatCard = ({ icon, label, value, color, onClick, actionText, delay }) => {
  const colorMap = {
    blue: "glass-icon-blue",
    purple: "glass-icon-purple",
    amber: "glass-icon-amber",
    rose: "glass-icon-rose"
  };

  const itemVars = {
    hidden: { opacity: 0, scale: 0.9, y: 30 },
    show: { opacity: 1, scale: 1, y: 0, transition: { delay, type: "spring", bounce: 0.4 } }
  };

  return (
    <motion.div 
      className="stat-card cursor-pointer"
      variants={itemVars}
      whileHover={{ y: -10, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15)" }}
      onClick={onClick}
    >
      <div className={`stat-icon-wrapper ${colorMap[color]}`}>
        {icon}
      </div>
      <div className="stat-info">
        <span className="label">{label}</span>
        <span className="value">{value}</span>
      </div>
      <button className="stat-action-btn font-black uppercase tracking-widest text-[10px]" onClick={onClick}>
        {actionText} <ChevronsRight size={14} className="symbol-glow" />
      </button>
    </motion.div>
  );
};

export default StudentDashboard;
