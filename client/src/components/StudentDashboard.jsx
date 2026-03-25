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
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());
  const [recentApplications, setRecentApplications] = useState([]);
  const [messages, setMessages] = useState([]);
  const [skillGaps, setSkillGaps] = useState([]);
  const [advancedUpskilling, setAdvancedUpskilling] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [aiTargetJob, setAiTargetJob] = useState("");
  const [interviews, setInterviews] = useState([]);

  const triggerAIAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      // Fetch a real job to analyze against
      const jobsRes = await axios.get('/api/ai/skill-gap/jobs', { headers });
      if (jobsRes.data.length > 0) {
        await axios.get(`/api/ai/skill-gap/pathways?jobId=${jobsRes.data[0].id}`, { headers });
      }
      const summaryRes = await axios.get('/api/ai/summary', { headers });
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
          profileStrength: summary.profileStrength || 75,
          appsSent: summary.application_count || 0,
          matchScoreAvg: summary.match_score_avg || 0,
          skillGap: summary.skillGaps?.length > 0 ? 100 - (summary.skillGaps[0].match_percentage || 0) : 0,
          pendingInterviews: summary.interview_count || 0
        });

        setSkillGaps(summary.skillGaps || []);

        // 2. Fetch Recommended Jobs (Real DB Jobs)
        const [jobsRes, profileRes, appsRes] = await Promise.all([
          axios.get('/api/jobs', { headers }),
          axios.get('/api/users/profile', { headers }),
          axios.get('/api/applications/student', { headers })
        ]);

        const currentSkills = profileRes.data.skills || [];
        setUserSkills(currentSkills);
        setAppliedJobIds(new Set(appsRes.data.map(app => app.job_id)));
        setRecentApplications(appsRes.data.slice(0, 5));
        
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
        if (enrichedJobs.length > 0) {
          setAiTargetJob(enrichedJobs[0].id);
        }

        // Update stats average ONLY if current sent match avg is 0 (new student fallback)
        if (enrichedJobs.length > 0 && summary.match_score_avg === 0) {
          const avg = Math.round(enrichedJobs.reduce((sum, j) => sum + j.matchScore, 0) / enrichedJobs.length);
          setStats(prev => ({ ...prev, matchScoreAvg: avg }));
        }

        // 3. Fetch Recent Messages
        try {
          const roomsRes = await axios.get('/api/chat/rooms', { headers });
          setMessages(roomsRes.data.slice(0, 3));
        } catch (msgErr) {
          console.error("Failed to fetch messages:", msgErr);
        }

        // 3.5 Fetch Interviews
        try {
          const interviewsRes = await axios.get('/api/interviews', { headers });
          setInterviews(interviewsRes.data);
          setStats(prev => ({ ...prev, pendingInterviews: interviewsRes.data.filter(i => i.status === 'pending').length }));
        } catch (intErr) {
          console.error("Failed to fetch interviews:", intErr);
        }

        // 4. Fetch Advanced Upskilling Data
        try {
          const upskillingRes = await axios.get('/api/ai/advanced-upskilling', { headers });
          setAdvancedUpskilling(upskillingRes.data);
        } catch (upErr) {
          console.error("Failed to fetch upskilling data:", upErr);
        }

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
                : "AI analysis complete. Refine your skills to unlock 15+ more high-match opportunities."}
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



      {/* --- 3. STATS GRID --- */}
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
              className={`job-premium-card cursor-pointer ${appliedJobIds.has(job.id) ? 'applied' : ''}`}
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * idx }}
              onClick={() => navigate(`/jobs/${job.id}`)}
            >
              {appliedJobIds.has(job.id) && (
                <div className="dashboard-applied-badge">
                  <CheckCircle2 size={12} /> Applied
                </div>
              )}
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
                     className={`w-full py-4 ${appliedJobIds.has(job.id) ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 text-white border-blue-500/50 shadow-blue-900/40'} rounded-[20px] font-black text-xs uppercase tracking-widest transition-all shadow-2xl flex items-center justify-center gap-3 border`}
                     disabled={appliedJobIds.has(job.id)}
                    >
                      {appliedJobIds.has(job.id) ? (
                        <>Already Applied <CheckCircle2 size={16} /></>
                      ) : (
                        <>Apply Now <Sparkles size={16} /></>
                      )}
                    </button>
                 </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- 4. UPCOMING INTERVIEWS --- */}
      {interviews.length > 0 && (
        <section className="mt-12">
            <div className="section-header">
                <h2 className="flex items-center gap-3">
                    <Calendar size={24} className="text-rose-500" /> Upcoming Interviews
                </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {interviews.map((interview, idx) => (
                    <motion.div 
                        key={interview.id}
                        className="p-6 bg-white rounded-[32px] border border-slate-100 shadow-xl hover:shadow-2xl transition-all cursor-pointer group"
                        variants={itemVars}
                        onClick={() => navigate(`/interviews/${interview.id}`)}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                                <Clock size={24} />
                            </div>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                interview.status === 'accepted' ? 'bg-emerald-100 text-emerald-600' : 
                                interview.status === 'declined' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
                            }`}>
                                {interview.status}
                            </span>
                        </div>
                        <h3 className="text-lg font-black text-slate-800 mb-1">{interview.job_title}</h3>
                        <p className="text-slate-500 text-sm font-bold mb-4">{interview.company_name}</p>
                        
                        <div className="pt-4 border-t border-slate-50 space-y-2">
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                                <Calendar size={14} className="text-slate-400" />
                                {new Date(interview.scheduled_at).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                                <Clock size={14} className="text-slate-400" />
                                {new Date(interview.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
      )}

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
          <div className="applications-list-container">
            {recentApplications.map((app, i) => (
              <div 
                key={app.id || i} 
                className="application-premium-card group"
                onClick={() => navigate('/applications')}
              >
                <div className="flex items-center gap-6">
                  <div className="app-company-logo">
                    {app.company_name?.charAt(0) || 'C'}
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 text-lg leading-tight">{app.job_title || app.title}</div>
                    <div className="text-xs text-slate-400 font-semibold mt-1 flex items-center gap-1.5">
                      <Globe size={12} /> {app.company_name}
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <span className={`status-tag-premium ${app.status?.toLowerCase() || 'pending'}`}>
                    {app.status?.toLowerCase() === 'pending' && <Clock size={14} />}
                    {app.status?.toLowerCase() === 'interview' && <Zap size={14} />}
                    {app.status?.toLowerCase() === 'offered' && <CheckCircle2 size={14} />}
                    {app.status || 'Pending'}
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <span className="premium-card-label !mb-1">AI Match</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
                    <span className="text-base font-bold text-slate-800">{app.ai_match_score || 85}%</span>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <span className="premium-card-label !mb-1">Applied</span>
                  <span className="text-sm font-black text-slate-500 uppercase tracking-tight">
                    {new Date(app.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
            ))}
            {recentApplications.length === 0 && (
              <div className="py-16 text-center text-slate-400 italic font-medium bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                No active applications found.
              </div>
            )}
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
                   <select 
                      onChange={(e) => setAiTargetJob(e.target.value)}
                      value={aiTargetJob}
                      className="quick-generate-select w-full font-bold outline-none"
                   >
                      {recommendedJobs.length > 0 ? recommendedJobs.map(j => (
                        <option key={j.id} value={j.id}>{j.title} @ {j.company_name}</option>
                      )) : (
                        <option>Choose a recommended job</option>
                      )}
                   </select>
                </div>
                <button 
                  onClick={() => navigate('/ai/proposals', { state: { jobId: aiTargetJob } })}
                  className="boost-btn-premium w-full mt-4"
                >
                  Boost Match Score <Sparkles size={16} />
                </button>
             </div>
           </div>
        </motion.div>

        {/* --- 5. ADVANCED UPSKILLING CENTER --- */}
        {false && advancedUpskilling && advancedUpskilling.priority_skills.length > 0 && (
          <motion.section 
            className="mt-8 mb-4 w-full col-span-full"
            initial="hidden" animate="show" variants={containerVars}
          >
            <div className="flex flex-col xl:flex-row gap-8">
              {/* LEFT COLUMN: TOP PRIORITY SKILLS */}
              <div className="w-full xl:w-1/2 flex flex-col gap-6">
                <div className="bg-white rounded-3xl p-8 border border-slate-200/50 shadow-[0_8px_30px_rgba(0,0,0,0.04)] h-full">
                  <h3 className="text-sm font-black text-rose-500 uppercase tracking-widest flex items-center gap-2 mb-6">
                    🔥 YOUR TOP PRIORITY SKILLS
                  </h3>
                  
                  <div className="flex flex-col gap-5">
                    {advancedUpskilling.priority_skills.map((skill) => (
                      <motion.div key={skill.id} className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-white transition-all shadow-sm hover:shadow-md group" variants={itemVars}>
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-slate-200/60 rounded-xl flex items-center justify-center font-black text-slate-700 text-lg group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                              #{skill.id}
                            </div>
                            <h4 className="text-xl font-bold text-slate-800">{skill.skill}</h4>
                          </div>
                          <div className="px-3 py-1.5 rounded-full bg-emerald-100/50 text-emerald-700 text-xs font-black tracking-widest flex items-center gap-1">
                            <TrendingUp size={14} /> +{skill.impact}% Impact
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs font-bold text-slate-500">
                            <span>Market Demand</span>
                            <span className="text-slate-700">{skill.demand}% of jobs require this</span>
                          </div>
                          <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500" 
                              initial={{ width: 0 }} 
                              animate={{ width: `${skill.demand}%` }} 
                              transition={{ duration: 1.5, ease: "easeOut" }}
                            />
                          </div>
                        </div>
                        
                        <div className="mt-4 text-xs font-semibold text-slate-500 bg-white p-3 rounded-xl border border-slate-100">
                          <span className="text-rose-500 font-bold">Missing from:</span> {skill.categories || 'Software Engineering'}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: MARKET DEMAND & UNLOCK JOBS */}
              <div className="w-full xl:w-1/2 flex flex-col gap-6">
                
                {/* MARKET DEMAND SECTION */}
                <div className="bg-slate-900 rounded-3xl p-8 shadow-[0_15px_40px_rgba(0,0,0,0.1)] relative overflow-hidden text-white">
                  <div className="absolute -top-32 -right-32 w-64 h-64 bg-blue-500/20 blur-[100px] pointer-events-none" />
                  <h3 className="text-sm font-black text-blue-400 uppercase tracking-widest flex items-center gap-2 mb-2 relative z-10">
                    📈 SKILL MARKET DEMAND
                  </h3>
                  <p className="text-slate-400 text-xs font-semibold mb-6 uppercase tracking-wider relative z-10">What Employers Want</p>
                  
                  <h4 className="text-xs font-black text-amber-400 uppercase tracking-widest flex items-center gap-2 mb-4 relative z-10">
                    🔥 TRENDING SKILLS THIS MONTH
                  </h4>
                  
                  <div className="flex flex-col gap-3 relative z-10">
                    {advancedUpskilling.market_demand.trending.map((trend, idx) => (
                      <div key={idx} className="flex items-center gap-4">
                        <div className="w-24 font-bold text-sm text-slate-200 truncate">{trend.name}</div>
                        <div className="w-16 text-emerald-400 text-xs font-black flex items-center">
                          ▲ +{trend.increase}%
                        </div>
                        <div className="flex-1 right-0 h-1.5 bg-white/10 rounded-full overflow-hidden flex items-center">
                           <div style={{ width: `${trend.demand_percentage}%` }} className={`h-full ${trend.is_gap ? 'bg-amber-400' : 'bg-blue-500'}`} />
                        </div>
                        <div className="w-10 text-right text-xs font-bold text-slate-300">{trend.demand_percentage}%</div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 pt-5 border-t border-white/10 relative z-10 space-y-3">
                    <div className="text-xs leading-relaxed">
                      <span className="text-emerald-400 font-bold">Your Skills:</span> <span className="text-slate-300 font-medium">{advancedUpskilling.market_demand.user_skills.slice(0, 5).join(', ')}...</span>
                    </div>
                    <div className="text-xs leading-relaxed">
                      <span className="text-amber-400 font-bold">Gap Skills:</span> <span className="text-slate-300 font-medium">{advancedUpskilling.market_demand.gap_skills.join(', ') || 'None identified'}</span>
                    </div>
                    <button onClick={() => navigate('/ai/skill-gap')} className="w-full mt-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-black tracking-widest uppercase transition-colors flex items-center justify-center gap-2 text-white">
                      📊 View Full Report
                    </button>
                  </div>
                </div>
                
                {/* JOBS YOU'LL UNLOCK */}
                <div className="bg-blue-50/50 rounded-3xl p-8 border border-blue-100 overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/40 rounded-full blur-[60px]" />
                  <h3 className="text-sm font-black text-blue-600 uppercase tracking-widest flex items-center gap-2 mb-6 relative z-10">
                    🔔 JOBS YOU'LL UNLOCK AFTER LEARNING
                  </h3>
                  
                  <div className="flex flex-col gap-6 relative z-10">
                    {advancedUpskilling.priority_skills.slice(0, 2).map(skill => (
                      <div key={skill.id} className="bg-white rounded-2xl p-5 border border-blue-100 shadow-sm">
                        <div className="font-black text-slate-800 text-sm mb-3 uppercase tracking-wider pb-2 border-b border-slate-100">
                          Learn {skill.skill}
                        </div>
                        <div className="flex flex-col gap-3">
                          {skill.unlockable_jobs.length > 0 ? skill.unlockable_jobs.map((ujob, i) => (
                            <div key={i} className="flex items-center justify-between group cursor-pointer" onClick={() => navigate(`/jobs/${ujob.id}`)}>
                              <div className="flex flex-col">
                                <span className="font-bold text-slate-700 text-sm group-hover:text-blue-600 transition-colors">{ujob.title} @ <span className="text-slate-500 font-medium">{ujob.company}</span></span>
                                <span className="text-emerald-600 text-xs font-black tracking-wider uppercase mt-0.5">{ujob.salary || 'Market Rate'}</span>
                              </div>
                              <div className="text-xs font-black text-blue-500 bg-blue-50 px-2.5 py-1 rounded-lg">
                                {ujob.match}% Match
                              </div>
                            </div>
                          )) : (
                             <div className="text-slate-400 text-xs italic">No immediate listings found.</div>
                          )}
                          
                          {skill.total_unlocks > 0 && (
                            <button onClick={() => navigate(`/jobs?skill=${encodeURIComponent(skill.skill)}`)} className="text-xs font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest text-left mt-1 flex items-center gap-1 transition-colors">
                              <Plus size={12} /> {skill.total_unlocks > 3 ? skill.total_unlocks - 3 : 'View'} more jobs
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
              </div>
            </div>
          </motion.section>
        )}

        {/* --- 6. UPCOMING & NETWORKING (Balanced Grid) --- */}
        <div className="col-span-full grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                        <p className="text-xs text-slate-500 font-medium mb-5">{app.job_title || app.title}</p>
                         <button 
                          onClick={() => navigate('/applications')}
                          className="w-full py-4 boost-btn-premium rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all mt-6"
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
                  className="boost-btn-premium w-full mt-4"
                >
                  Open Inbox <ChevronsRight size={14} className="ml-2 inline symbol-glow" />
                </button>
             </div>
           </motion.div>
        </div>

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
