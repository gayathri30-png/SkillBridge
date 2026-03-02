import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Building2, MapPin, Clock, 
  Sparkles, CheckCircle2, XCircle, Info,
  Zap, Share2, Heart, ExternalLink,
  BrainCircuit, LayoutGrid, Target, GraduationCap
} from "lucide-react";
import "./JobDetails.css";
import JobApplyModal from "./JobApplyModal";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [existingApplication, setExistingApplication] = useState(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  
  // AI State
  const [aiMatch, setAiMatch] = useState(null);

  const fetchJobDetails = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      const [jobRes, aiRes, appRes] = await Promise.all([
        axios.get(`/api/jobs/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`/api/ai/match/${id}`, { headers: { Authorization: `Bearer ${token}` } }).catch(e => null),
        axios.get(`/api/applications/student`, { headers: { Authorization: `Bearer ${token}` } }).catch(e => ({ data: [] }))
      ]);

      setJob(jobRes.data);
      if (aiRes) setAiMatch(aiRes.data);
      
      if (appRes && Array.isArray(appRes.data)) {
        const found = appRes.data.find(a => Number(a.job_id) === Number(id));
        setExistingApplication(found);
      }

    } catch (err) {
      setError("Failed to load job details");
      console.error("Error fetching details:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchJobDetails();
  }, [fetchJobDetails]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
       <div className="loader-premium"></div>
    </div>
  );

  if (error || !job) return (
    <div className="p-8 text-center max-w-lg mx-auto mt-20">
      <div className="bg-red-50 p-8 rounded-3xl border border-red-100">
        <XCircle className="mx-auto text-red-500 mb-4" size={48} />
        <h3 className="text-xl font-bold text-slate-900 mb-2">{error || "Job not found"}</h3>
        <p className="text-slate-500 mb-6">This opportunity might have been filled or the link has expired.</p>
        <button className="btn-primary w-full" onClick={() => navigate("/jobs")}>Back to Explore</button>
      </div>
    </div>
  );

  return (
    <div className="job-details-premium fade-in">
      {/* Top Navigation */}
      <div className="details-nav max-w-7xl mx-auto px-8">
        <button className="back-btn-premium" onClick={() => navigate("/jobs")}>
          <ArrowLeft size={18} /> Back to Job Explorer
        </button>
        <div className="flex gap-4">
          <button className="action-btn-circle"><Share2 size={18} /></button>
          <button className="action-btn-circle"><Heart size={18} /></button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 pb-20">
        <div className="details-layout">
          {/* Main Content */}
          <div className="details-main-content">
            <header className="job-hero-premium">
              <div className="hero-main-info flex items-start justify-between">
                <div className="flex-1">
                   <div className="flex gap-3 mb-6">
                      <span className="badge-premium">{job.job_type}</span>
                      <span className="badge-premium success">{job.experience_level}</span>
                      {job.remote && <span className="badge-premium info">Remote</span>}
                   </div>
                   <h1 className="hero-title">{job.title}</h1>
                   <div className="hero-meta">
                      <div className="meta-item"><Building2 size={18} className="text-indigo-400" /> {job.company}</div>
                      <div className="meta-item"><MapPin size={18} className="text-indigo-400" /> {job.location || 'Distributed'}</div>
                      <div className="meta-item"><Clock size={18} className="text-indigo-400" /> Posted {new Date(job.created_at).toLocaleDateString()}</div>
                   </div>
                </div>
                <div className="budget-display">
                   <p className="budget-label">Project Budget</p>
                   <h2 className="budget-amount">{job.salary_range || 'Competitive'}</h2>
                   <p className="budget-label">LPA / Fixed Price</p>
                </div>
              </div>
            </header>

            <section className="details-section">
              <h3 className="section-title"><Info size={20} className="text-indigo-400" /> The Opportunity</h3>
              <div className="description-text prose max-w-none">
                {job.description.split('\n').map((p, i) => (
                  <p key={i} className="mb-4">{p}</p>
                ))}
              </div>
            </section>

            {/* Company & Recruiter Profile */}
            <div className="grid grid-cols-2 gap-6 mb-8">
               <section className="details-section mb-0">
                  <h3 className="section-title"><Building2 size={20} className="text-indigo-400" /> Company Spotlight</h3>
                  <div className="info-card-futuristic">
                     <div className="info-icon-wrapper">
                        <Building2 size={24} />
                     </div>
                     <div>
                        <h4 className="text-lg font-bold text-white mb-1">{job.company}</h4>
                        <p className="text-sm text-slate-400 leading-relaxed">
                           {job.company_bio || "A forward-thinking organization dedicated to innovation and excellence in the modern technical landscape."}
                        </p>
                     </div>
                  </div>
               </section>

               <section className="details-section mb-0">
                  <h3 className="section-title"><Target size={20} className="text-indigo-400" /> Hiring Context</h3>
                  <div className="info-card-futuristic">
                     <div className="info-icon-wrapper">
                        <GraduationCap size={24} />
                     </div>
                     <div>
                        <h4 className="text-lg font-bold text-white mb-1">Recruiter Lead</h4>
                        <p className="text-sm text-indigo-300 font-semibold mb-1">{job.recruiter_name}</p>
                        <p className="text-xs text-slate-500">{job.recruiter_email}</p>
                        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-[10px] font-black uppercase tracking-wider">
                           <CheckCircle2 size={10} /> Verified Partner
                        </div>
                     </div>
                  </div>
               </section>
            </div>

            <section className="details-section">
              <h3 className="section-title"><LayoutGrid size={20} className="text-indigo-400" /> Technical Ecosystem</h3>
              <div className="flex flex-wrap gap-4">
                {job.skills_required?.map(s => (
                  <div key={s} className="ecosystem-chip">
                    <span className="text-indigo-400 font-black">#</span>
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar Area */}
          <aside className="details-sidebar">
             {/* AI Match Deep Dive Card */}
             {aiMatch && (
               <div className="ai-deep-dive-card">
                  <div className="card-header-premium">
                    <Sparkles size={18} className="text-amber-500" />
                    <h4 className="m-0 font-[Outfit] font-extrabold uppercase tracking-wider text-sm text-white">Match Intelligence</h4>
                  </div>
                  
                  <div className="match-visual-center py-6 flex justify-center">
                     <div className="match-ring-outer">
                        <svg viewBox="0 0 100 100" className="w-32 h-32">
                          <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                          <motion.circle 
                            cx="50" cy="50" r="45" fill="none" 
                            stroke={aiMatch.score >= 80 ? '#10b981' : aiMatch.score >= 50 ? '#f59e0b' : '#ef4444'} 
                            strokeWidth="8" strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: aiMatch.score / 100 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            style={{ transformOrigin: 'center', transform: 'rotate(-90deg)' }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                           <span className="text-2xl font-black text-white">{aiMatch.score}%</span>
                           <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-tighter">Match</span>
                        </div>
                     </div>
                  </div>

                  <div className="ai-feedback-box">
                     <p className="text-sm text-slate-300 italic leading-relaxed">
                       " {aiMatch.feedback} "
                     </p>
                  </div>

                  <div className="skill-alignment-list">
                     <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Skill Matrix</span>
                        <BrainCircuit size={14} className="text-indigo-400" />
                     </div>
                     <div className="space-y-3 mb-6">
                         {aiMatch.matched_skills?.slice(0, 4).map(s => (
                           <div key={s.name} className="alignment-row">
                              <span className="text-xs font-semibold text-slate-300">{s.name}</span>
                              <span className="text-[9px] font-black uppercase text-green-400">Match</span>
                           </div>
                         ))}
                         {aiMatch.missing_skills?.slice(0, 3).map(s => (
                            <div key={s} className="alignment-row">
                               <span className="text-xs font-semibold text-slate-500">{s}</span>
                               <span className="text-[9px] font-black uppercase text-amber-500">Gap</span>
                            </div>
                         ))}
                     </div>
                  </div>

                  <div className="w-full mt-2 relative z-10">
                      <button 
                        className="btn btn-primary w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold transform transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-indigo-500/20 active:scale-[0.98]"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            navigate(`/skill-gap/${job.id}`);
                        }}
                      >
                         <Sparkles size={16} /> Deep-dive Analysis
                      </button>
                  </div>
               </div>
             )}

             {/* Application Card */}
             <div className="application-status-card">
               {existingApplication ? (
                 <div className="status-container">
                    <div className={`status-banner ${existingApplication.status}`}>
                       {existingApplication.status === 'accepted' ? <CheckCircle2 size={16} /> : 
                        existingApplication.status === 'rejected' ? <XCircle size={16} /> : <Clock size={16} />}
                       <span>{existingApplication.status.toUpperCase()}</span>
                    </div>
                    <p className="text-sm text-slate-400 mt-4 leading-relaxed">
                      Application submitted on <strong>{new Date(existingApplication.created_at).toLocaleDateString()}</strong>.
                    </p>
                    <button className="apply-btn-xl mt-6" onClick={() => navigate('/applications')}>Manage Application</button>
                 </div>
               ) : (
                 <div className="apply-cta-container">
                    <h4 className="text-lg font-extrabold text-white mb-2">Ready to contribute?</h4>
                    <p className="text-sm text-slate-400 mb-6 font-medium">Elevate your application with our AI pitch generation system.</p>
                    <button className="apply-btn-xl" onClick={() => setIsApplyModalOpen(true)}>
                       Apply for Role <Target size={18} />
                    </button>
                 </div>
               )}
             </div>
          </aside>
        </div>
      </div>

      <JobApplyModal 
        isOpen={isApplyModalOpen}
        onClose={(success) => {
          setIsApplyModalOpen(false);
          if (success) fetchJobDetails();
        }}
        job={job}
      />
    </div>
  );
};

export default JobDetails;
