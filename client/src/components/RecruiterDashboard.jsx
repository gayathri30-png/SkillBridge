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

        // Fetch Interviews separately if not in dashboard payload
        const interviewsRes = await axios.get('/api/interviews', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setInterviews(interviewsRes.data);

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
  const [interviews, setInterviews] = useState([]);

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
    { label: 'PENDING REVIEWS', value: data.stats.pendingReviews || 0, trend: '+4', icon: Clock, color: 'emerald' },
    { label: 'SHORTLISTED', value: data.stats.shortlisted || 0, trend: '+1', icon: Target, color: 'amber' },
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
            </div>
            <div className="welcome-actions">
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

          {/* 5. Quick Actions Bar */}
          <motion.section 
            className="quick-access-bar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
          >
             <button className="q-btn" onClick={() => navigate('/post-job')}><Plus size={16} /> Post New Job</button>
             <button className="q-btn" onClick={() => navigate('/my-jobs')}><Briefcase size={16} /> Manage Job Postings</button>
          </motion.section>

          {/* 7. Recent Job Postings */}
          <section className="recent-jobs-section">
             <div className="section-header">
                <h2>📋 RECENT JOB POSTINGS</h2>
                <button className="text-link" onClick={() => navigate('/my-jobs')}>View All {data.stats.activeJobs} Active Jobs →</button>
             </div>
             <div className="jobs-grid-dashboard">
                {!data.recentJobs || data.recentJobs.length === 0 ? (
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
                           <p className="text-xs text-slate-500">Posted {new Date(j.posted).toLocaleDateString()} • <strong>{j.applicants} applicants</strong></p>
                        </div>
                     </div>
                     <div className="job-applicants-preview mt-4">
                        <p className="text-2xl font-black text-slate-800">{j.applicants}</p>
                        <p className="text-xs font-medium text-slate-500">APPLICANTS</p>
                     </div>
                     <div className="job-card-footer mt-4">
                        <button className="footer-btn" onClick={() => navigate(`/jobs/${j.id}`)}>View Job</button>
                        <button className="footer-btn" onClick={() => navigate(`/jobs/${j.id}/applicants`)}>View Pipeline</button>
                     </div>
                  </motion.div>
                ))}
              </div>
          </section>

          {/* 7.5 UPCOMING INTERVIEWS (Recruiter) */}
          {interviews.length > 0 && (
            <section className="upcoming-interviews-section mt-12">
               <div className="section-header">
                  <h2>📅 UPCOMING INTERVIEWS</h2>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {interviews.map((interview, i) => (
                    <motion.div 
                        key={interview.id} 
                        className="p-6 bg-white rounded-[32px] border border-slate-100 shadow-lg hover:shadow-xl transition-all"
                        whileHover={{ scale: 1.02 }}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                                    <User size={20} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-slate-800 m-0">{interview.student_name}</h4>
                                    <p className="text-[10px] font-bold text-slate-400 m-0 uppercase">{interview.job_title}</p>
                                </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                interview.status === 'accepted' ? 'bg-emerald-100 text-emerald-600' : 
                                interview.status === 'declined' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
                            }`}>
                                {interview.status}
                            </span>
                        </div>
                        <div className="flex items-center gap-6 mt-4 pt-4 border-t border-slate-50">
                            <div className="flex items-center gap-2 text-xs font-black text-slate-600">
                                <Calendar size={14} className="text-slate-400" />
                                {new Date(interview.scheduled_at).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-2 text-xs font-black text-slate-600">
                                <Clock size={14} className="text-slate-400" />
                                {new Date(interview.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    </motion.div>
                  ))}
               </div>
            </section>
          )}

          {/* 8. Recent Applications */}
          <section className="recommendations-section mt-8">
            <div className="section-header">
               <h2>👥 RECENT APPLICATIONS</h2>
            </div>
            <div className="candidates-list-vertical">
               {!data.recentApplications || data.recentApplications.length === 0 ? (
                 <div className="empty-state-card text-center py-12 bg-white/50 backdrop-blur rounded-3xl border border-white/60">
                    <Users size={40} className="mx-auto text-slate-300 mb-4" />
                    <h3 className="text-lg font-bold text-slate-700">No Applications Yet</h3>
                 </div>
               ) : data.recentApplications.map((c, i) => (
                 <motion.div 
                    key={i} 
                    className="candidate-card-hifi"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="c-card-content">
                       <div className="c-left">
                          <div className="c-avatar-large">{c.candidateName.split(' ').map(n=>n[0]).join('').substring(0,2)}</div>
                          <div className="c-info min-w-0">
                             <h4 className="truncate">{c.candidateName}</h4>
                             <div className="text-[0.8rem] font-semibold text-slate-500 flex flex-wrap items-center gap-2 mt-1">
                               <span className="whitespace-nowrap">Applied for:</span>
                               <span className="bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-lg border border-indigo-100 font-bold whitespace-nowrap truncate max-w-[150px]">{c.jobTitle}</span>
                             </div>
                             <span className="text-[10px] text-slate-400 font-medium mt-1 block">
                                {new Date(c.appliedAt).toLocaleDateString()}
                             </span>
                          </div>
                       </div>
                       
                       <div className="c-right">
                          <div className="c-score-badge">
                             <span className="score-text">Match: {c.matchScore}%</span>
                          </div>
                          <div className="c-actions mt-3">
                             <button className="c-btn view flex-1 text-center" onClick={() => navigate(`/evaluation/${c.id}`)}>Review Candidate</button>
                          </div>
                       </div>
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
