import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Search, Bell, User, ChevronDown, Plus, 
  Briefcase, Users, Target, Clock, TrendingUp,
  Zap, Brain, Calendar, MessageSquare, 
  ArrowUpRight, Info, Settings, Download,
  Filter, Star, CheckCircle, AlertCircle,
  MoreVertical, Send, Menu, Sparkles, Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './RecruiterDashboard.css';

const RecruiterDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) setUser(savedUser);

    // Fetch Dashboard Data
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get('/api/jobs/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const [data, setData] = useState({
    stats: { activeJobs: 0, totalApplicants: 0, highMatch: 0, avgResponseTime: '24 hrs' },
    topCandidates: [],
    recentJobs: []
  });

  const handleDeleteJob = async (jobId) => {
    try {
      setIsDeleting(true);
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5001/api/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Refresh Data
      const response = await axios.get('/api/jobs/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(response.data);
    } catch (err) {
      console.error("Failed to delete job", err);
      alert("Failed to delete job. Please try again.");
    } finally {
      setIsDeleting(false);
      setActiveDropdown(null);
    }
  };

  const displayStats = [
    { label: 'JOBS ACTIVE', value: data.stats.activeJobs, trend: '+2', icon: Briefcase, color: 'blue' },
    { label: 'TOTAL APPLICANTS', value: data.stats.totalApplicants, trend: '+18', icon: Users, color: 'purple' },
    { label: 'HIGH MATCH (>85%)', value: data.stats.highMatch, trend: '+8', icon: Target, color: 'amber' },
    { label: 'AVG RESPONSE TIME', value: data.stats.avgResponseTime, trend: '-0.3', icon: Clock, color: 'emerald' },
  ];

  if (!user) return null;

  return (
    <div className="recruiter-dash-container">
      <main className="dash-content">
        {/* Left Column (Main Area) */}
        <motion.div 
          className="main-col"
          initial={{ opacity: 0, x: -25 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* 2. Welcome Section */}
          <section className="welcome-hero">
            <div className="welcome-info">
              <motion.h1 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                👋 Welcome back, {user.name.split(' ')[0]}!
              </motion.h1>
              <motion.p 
                className="welcome-summary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                "You have <strong>{data.stats.totalApplicants} applicants</strong> to review. <strong>{data.stats.highMatch}</strong> are high-match candidates."
              </motion.p>
              <div className="welcome-meta">
                <Calendar size={14} /> <span>Today: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric'})}</span>
                <Clock size={14} /> <span>Last login: Just now</span>
              </div>
            </div>
            <div className="welcome-actions">
               <div className="dropdown-container" 
                   onMouseEnter={() => setShowQuickActions(true)} 
                   onMouseLeave={() => setShowQuickActions(false)}
               >
                 <button className="action-btn-secondary" onClick={(e) => { e.stopPropagation(); setShowQuickActions(!showQuickActions); }}>
                   Quick Actions <ChevronDown size={14} className={`transition-transform duration-200 ${showQuickActions ? 'rotate-180' : ''}`} />
                 </button>
                 <AnimatePresence>
                   {showQuickActions && (
                     <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="quick-actions-dropdown"
                      >
                        <button onClick={(e) => { e.stopPropagation(); navigate('/post-job'); }}><Plus size={14} /> Post New Job</button>
                        <button onClick={(e) => { e.stopPropagation(); navigate('/my-jobs'); }}><Briefcase size={14} /> My Jobs</button>
                        <button onClick={(e) => { e.stopPropagation(); navigate('/chat'); }}><MessageSquare size={14} /> Messages</button>
                      </motion.div>
                   )}
                 </AnimatePresence>
               </div>
               <button className="action-btn-primary" onClick={() => navigate('/post-job')}>Post New Job</button>
            </div>
          </section>

          {/* 3. AI Powered Statistics Cards */}
          <section className="stats-row">
            {displayStats.map((s, i) => (
              <motion.div 
                key={i} 
                className={`stat-card-premium ${s.color}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + (i * 0.1) }}
              >
                <div className="stat-header">
                  <div className="stat-label">{s.label}</div>
                  <div className="stat-icon-box"><s.icon size={20} /></div>
                </div>
                <div className="stat-main">
                  <span className="stat-value">{s.value}</span>
                  <div className={`stat-trend ${s.trend.startsWith('+') ? 'up' : 'down'}`}>
                    {s.trend.startsWith('+') ? <TrendingUp size={12} /> : <TrendingUp size={12} className="rotate-180" />}
                    {s.trend}
                  </div>
                </div>
              </motion.div>
            ))}
          </section>

          {/* 4. AI Insights Dashboard */}
          <motion.section 
            className="ai-insights-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="panel-header">
               <h2><Brain size={18} className="text-primary" /> AI STRATEGIC INSIGHTS</h2>
               <button className="text-link" onClick={() => navigate('/ai')}>View Full Intelligence Report →</button>
            </div>
            <div className="insights-grid">
               <div className="insight-card-main priority">
                  <h3>🎯 TOP PRIORITY ACTIONS</h3>
                  <div className="priority-list">
                    <div className="priority-item">
                       <Zap size={16} className="text-amber-500" />
                       <span><strong>{data.stats.highMatch} high-match citizens</strong> waiting for review</span>
                       <button className="item-btn" onClick={() => navigate('/my-jobs')}>Review Now</button>
                    </div>
                  </div>
               </div>
               <div className="insight-card-main trends">
                  <h3><Brain size={18} className="text-primary" /> AI SUMMARY</h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-meduim bg-white/50 p-4 rounded-xl border border-slate-200 shadow-sm">
                    {data.stats.totalApplicants > 0 
                      ? `Based on recent analytics, your active jobs have attracted ${data.stats.totalApplicants} total candidates. ${data.stats.highMatch} candidates scored above 85% in system matching algorithms. Proceed to your job listings to individually review candidate qualifications and portfolios.` 
                      : "You currently have no applicants across your active jobs. Consider refining your job descriptions or utilizing AI tools to optimize your posting for better reach."}
                  </p>
                  <button className="trends-cta mt-4" onClick={() => navigate('/my-jobs')}>Manage Active Jobs</button>
               </div>
            </div>
          </motion.section>

          {/* 5. Quick Actions Bar */}
          <motion.section 
            className="quick-access-bar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
          >
             <button className="q-btn" onClick={() => navigate('/post-job')}><Plus size={16} /> Post New Job</button>
             <button className="q-btn" onClick={() => navigate('/my-jobs')}><Briefcase size={16} /> Manage Job Postings</button>
             <button className="q-btn premium" onClick={() => navigate('/ai')}><Sparkles size={16} /> AI Automation Rules</button>
          </motion.section>

          {/* 6. AI Recommended Candidates */}
          <section className="recommendations-section">
            <div className="section-header">
               <h2>🔥 TOP MATCH RECOMMENDATIONS</h2>
               <button className="text-link" onClick={() => navigate('/my-jobs')}>View All {data.stats.highMatch} High-Match Candidates →</button>
            </div>
            <div className="candidates-list-vertical">
               {data.topCandidates.length === 0 ? (
                 <div className="empty-state-card text-center py-12 bg-white/50 backdrop-blur rounded-3xl border border-white/60">
                    <Users size={40} className="mx-auto text-slate-300 mb-4" />
                    <h3 className="text-lg font-bold text-slate-700">No Applications Yet</h3>
                    <p className="text-slate-500">When candidates apply to your jobs, AI will automatically rank them here.</p>
                    <button className="mt-6 action-btn-secondary mx-auto" onClick={() => navigate('/post-job')}>Post a Job Now</button>
                 </div>
               ) : data.topCandidates.map((c, i) => (
                 <motion.div 
                    key={i} 
                    className="candidate-card-hifi"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="c-score-badge">
                       <div className="stars">{'★'.repeat(Math.floor(c.rating))}{c.rating % 1 !== 0 ? '☆' : ''}</div>
                       <span className="score-text">{c.match}% Match</span>
                    </div>
                    <div className="c-card-content">
                       <div className="c-left">
                          <div className="c-avatar-large">{c.name.split(' ').map(n=>n[0]).join('')}</div>
                          <div className="c-info">
                             <h4>{c.name}</h4>
                             <p className="c-role">{c.role}</p>
                             <div className="c-meta-row">
                                <span>{c.exp} exp</span>
                                <span className="dot">•</span>
                                <span>{c.location}</span>
                             </div>
                          </div>
                       </div>
                       <div className="c-center">
                          <div className="c-skills">
                             {c.skills.map((s, si) => <span key={si} className="skill-chip">{s}</span>)}
                          </div>
                          <div className="c-tags">
                             {c.tags.map((t, ti) => <span key={ti} className="tag-chip">{t}</span>)}
                          </div>
                       </div>
                       <div className="c-right">
                          <div className="ai-comment">
                             <Brain size={16} />
                             <p>{c.ai}</p>
                          </div>
                          <div className="c-actions">
                             <button className="c-btn view" onClick={() => navigate(`/profile/${c.id}`)}>View Profile</button>
                             <button className="c-btn msg" onClick={() => navigate('/chat')}><MessageSquare size={14} /></button>
                          </div>
                       </div>
                    </div>
                 </motion.div>
               ))}
            </div>
          </section>

          {/* 7. Recent Job Postings */}
          <section className="recent-jobs-section">
             <div className="section-header">
                <h2>📋 RECENT JOB POSTINGS & APPLICANTS</h2>
                <button className="text-link" onClick={() => navigate('/my-jobs')}>View All {data.stats.activeJobs} Active Jobs →</button>
             </div>
             <div className="jobs-grid-dashboard">
                {data.recentJobs.length === 0 ? (
                  <div className="empty-state-card text-center py-12 bg-white/50 backdrop-blur rounded-3xl border border-white/60 col-span-2">
                    <Briefcase size={40} className="mx-auto text-slate-300 mb-4" />
                    <h3 className="text-lg font-bold text-slate-700">No Active Jobs</h3>
                    <p className="text-slate-500">You haven't posted any jobs yet. Get started to attract top talent.</p>
                  </div>
                ) : data.recentJobs.map((j, i) => (
                 <motion.div 
                    key={i} 
                    className={`job-card-dashboard ${j.status === 'closed' ? 'opacity-70 grayscale-[0.3]' : ''}`}
                    whileHover={{ y: -8 }}
                  >
                     <div className="job-card-header">
                        <div>
                           <div className="flex items-center gap-2 mb-1">
                             <h3 className="m-0">{j.title}</h3>
                             {j.status === 'closed' && (
                               <span className="px-2 py-0.5 text-[0.65rem] font-bold bg-slate-200 text-slate-600 rounded-full tracking-wider">CLOSED</span>
                             )}
                           </div>
                           <p className="text-xs text-slate-500">Posted {j.posted} • <strong>{j.applicants} applicants</strong></p>
                        </div>
                        <div style={{position: 'relative'}}>
                          <button className="icon-btn" onClick={() => setActiveDropdown(activeDropdown === j.id ? null : j.id)}>
                             <MoreVertical size={16} />
                          </button>
                          {activeDropdown === j.id && (
                             <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-10 overflow-hidden" style={{ zIndex: 10 }}>
                                <button 
                                  className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 font-semibold transition-colors" 
                                  onClick={() => handleDeleteJob(j.id)}
                                  disabled={isDeleting}
                                >
                                   <Trash2 size={14} /> {isDeleting ? 'Deleting...' : 'Delete Job'}
                                </button>
                             </div>
                          )}
                        </div>
                     </div>
                     <div className="job-ai-brief">
                        <Search size={14} className="text-primary" />
                        <span>AI Summary: "{j.ai}"</span>
                     </div>
                     <div className="job-applicants-preview">
                        <div className="avatar-stack">
                           {j.profiles.map((p, pi) => (
                             <div key={pi} className="stack-avatar">{p}</div>
                           ))}
                           {j.applicants > 3 && (
                             <div className="stack-more">+{j.applicants - 3}</div>
                           )}
                        </div>
                        <button className="view-apps-btn" onClick={() => navigate(`/jobs/${j.id}/applicants`)}>View All Applicants →</button>
                     </div>
                     <div className="job-card-footer">
                        <button className="footer-btn" onClick={() => navigate(`/jobs/${j.id}`)}>View Job</button>
                        <button className="footer-btn" onClick={() => navigate(`/jobs/${j.id}/applicants`)}>View Applicants</button>
                        <button className="footer-btn">Analytics</button>
                     </div>
                  </motion.div>
                ))}
             </div>
          </section>
        </motion.div>
      </main>

      <footer className="dash-footer">
         <div className="footer-top">
            <div className="footer-logo">🔷 SKILLBRIDGE AI</div>
            <div className="footer-links">
               <button>Contact Support</button>
               <button>Tutorials</button>
               <button>Feedback</button>
            </div>
         </div>
         <div className="footer-bottom">
            <span>© 2025 SkillBridge · Privacy · Terms · Settings</span>
         </div>
      </footer>
    </div>
  );
};

export default RecruiterDashboard;
