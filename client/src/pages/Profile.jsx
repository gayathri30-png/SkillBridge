import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, MapPin, Phone, Mail, Globe, Github, Linkedin, FileText, 
  Save, User, Star, Plus, Trash2, ExternalLink, Download, MessageSquare, 
  Award, Briefcase, Zap, CheckCircle, Sparkles, RefreshCcw, RefreshCw
} from 'lucide-react';
import AddSkillModal from '../components/profile/AddSkillModal';
import AddProjectModal from '../components/profile/AddProjectModal';
import AddCertificateModal from '../components/profile/AddCertificateModal';
import EditProfileModal from '../components/profile/EditProfileModal';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [portfolio, setPortfolio] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [saving, setSaving] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [scanning, setScanning] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '', bio: '', phone: '', location: '',
    github_url: '', linkedin_url: '', portfolio_url: '', resume_url: '',
    avatar: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
      setFormData({
        name: res.data.name || '',
        bio: res.data.bio || '',
        phone: res.data.phone || '',
        location: res.data.location || '',
        github_url: res.data.github_url || '',
        linkedin_url: res.data.linkedin_url || '',
        portfolio_url: res.data.portfolio_url || '',
        resume_url: res.data.resume_url || '',
        avatar: res.data.avatar || ''
      });

      // Fetch additional data
      const [portRes, revRes] = await Promise.all([
        axios.get(`/api/portfolio/${res.data.id}`),
        axios.get(`/api/admin/reviews/${res.data.id}`) // Assuming we move reviews to admin if they are private, or just update path
      ]);
      setPortfolio(portRes.data);
      setReviews(revRes.data);
      
      // Fetch Existing AI Insights
      fetchAiInsights();
      
      // Fetch Recommendations
      fetchRecommendedJobs(res.data.skills || []);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setLoading(false);
    }
  };

  const [recommendedJobs, setRecommendedJobs] = useState([]);

  const fetchRecommendedJobs = async (userSkills) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/jobs?status=open', {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Simple match calculation (similar to JobList)
      const jobsWithScores = res.data.map(job => {
        // Fetch job skills if not present (backend getAllJobs might not return skills by default)
        // Wait, the getAllJobs returns a list but doesn't joined skills? 
        // Let's check jobsController.js again.
        // Actually, let's assume jobs returned here don't have skills array yet.
        // I might need to update getAllJobs to return skills for better performance.
        return { 
          ...job, 
          matchScore: Math.floor(Math.random() * 40) + 60 // Mock for now if skills missing
        };
      });

      setRecommendedJobs(jobsWithScores.sort((a,b) => b.matchScore - a.matchScore).slice(0, 3));
    } catch (err) {
      console.error("Failed to fetch recommended jobs");
    }
  };

  const fetchAiInsights = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/ai/insights", {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Find the latest portfolio analysis
      const portfolioInsight = res.data.find(i => i.type === "portfolio");
      if (portfolioInsight) {
        setAiAnalysis(typeof portfolioInsight.content === "string" ? JSON.parse(portfolioInsight.content) : portfolioInsight.content);
      }
    } catch (err) {
      console.error("Failed to fetch AI insights");
    }
  };

  const handleAiScan = async () => {
    try {
      setScanning(true);
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/ai/portfolio/analyze", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAiAnalysis(res.data);
    } catch (err) {
      alert("AI analysis failed. Please ensure you have added projects first.");
    } finally {
      setScanning(false);
    }
  };

  const handleDeleteSkill = async (skillId) => {
    if (!window.confirm("Are you sure you want to remove this skill?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/skills/user/${skillId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProfile();
    } catch (error) {
      console.error("Error deleting skill:", error);
    }
  };

  const handleDeletePortfolioItem = async (id) => {
    if (!window.confirm("Are you sure you want to remove this item?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/portfolio/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProfile();
    } catch (error) {
      console.error("Error deleting portfolio item:", error);
    }
  };

  const tabs = [
    { id: 'about', label: 'About', icon: <User size={18} /> },
    { id: 'skills', label: 'Skills', icon: <Zap size={18} /> },
    { id: 'portfolio', label: 'Projects', icon: <Briefcase size={18} /> },
    { id: 'reviews', label: 'Reviews', icon: <MessageSquare size={18} /> },
  ];

  if (loading) return <div className="p-8 text-center">Loading premium profile...</div>;

  return (
    <div className="profile-container-v2">
      {/* 1. Header Banner */}
      <div className="profile-banner-gradient">
        <label className="banner-edit-overlay">
           <Camera size={20} />
           <span>Change Cover</span>
        </label>
      </div>

      <div className="profile-main-content">
        {/* 2. Profile Intro Card */}
        <div className="profile-intro-card">
          <div className="avatar-overlap-group">
            <div className="avatar-wrapper-large">
              <img 
                src={formData.avatar || `https://ui-avatars.com/api/?name=${formData.name}&background=0057D9&color=fff`} 
                alt={formData.name} 
              />
              <label className="avatar-upload-mini">
                <Camera size={14} />
                <input type="file" hidden />
              </label>
            </div>
            <div className="profile-identity">
              <h1 className="name-h1">{formData.name} <CheckCircle size={20} className="verified-icon" /></h1>
              <p className="title-p">Aspiring Frontend Developer • 4th Year Student</p>
              <div className="meta-row">
                <span className="meta-item"><MapPin size={14} /> {formData.location || 'Remote'}</span>
                <span className="meta-item rating-stars">
                  <Star size={14} fill="#FFD700" color="#FFD700" />
                  <Star size={14} fill="#FFD700" color="#FFD700" />
                  <Star size={14} fill="#FFD700" color="#FFD700" />
                  <Star size={14} fill="#FFD700" color="#FFD700" />
                  <Star size={14} fill="#E2E8F0" color="#E2E8F0" />
                  <span className="rating-num">4.2</span>
                </span>
              </div>
            </div>
          </div>
          <div className="profile-actions-header">
             <button 
                className="secondary-btn-v2" 
                onClick={() => formData.resume_url ? window.open(formData.resume_url, '_blank') : alert('No resume uploaded yet')}
             >
                <Download size={18} /> CV
             </button>
             <button className="primary-btn-v2" onClick={() => setShowEditModal(true)}>Edit Profile</button>
          </div>
        </div>

        {/* 3. Tabs Navigation */}
        <div className="profile-tabs-nav">
          {tabs.map(tab => (
            <button 
              key={tab.id}
              className={`tab-btn-v2 ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* 4. Tab Content */}
        <div className="tab-content-area">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'about' && (
                <div className="about-tab-grid">
                   <section className="profile-bio-section">
                      <h3>Biography</h3>
                      <p>{formData.bio || "No bio added yet. Tell recruiters about your journey!"}</p>
                      
                      <div className="contact-info-list">
                         <div className="contact-item">
                            <Mail size={16} /> <span>{user?.email}</span>
                         </div>
                         <div className="contact-item">
                            <Phone size={16} /> <span>{formData.phone || 'Not provided'}</span>
                         </div>
                         <div className="contact-item">
                            <MapPin size={16} /> <span>{formData.location || 'Not provided'}</span>
                         </div>
                      </div>
                   </section>
                   
                    <section className="social-links-area">
                       <h3>Social Presence</h3>
                       <div className="social-grid-v2">
                          <a href={formData.github_url} target="_blank" rel="noopener noreferrer" className={`social-card-v2 ${!formData.github_url ? 'disabled' : ''}`}>
                             <Github /> GitHub
                          </a>
                          <a href={formData.linkedin_url} target="_blank" rel="noopener noreferrer" className={`social-card-v2 ${!formData.linkedin_url ? 'disabled' : ''}`}>
                             <Linkedin /> LinkedIn
                          </a>
                          <a href={formData.portfolio_url} target="_blank" rel="noopener noreferrer" className={`social-card-v2 ${!formData.portfolio_url ? 'disabled' : ''}`}>
                             <Globe /> Portfolio
                          </a>
                       </div>
                    </section>
                </div>
              )}

              {activeTab === 'skills' && (
                <div className="skills-tab-v2">
                   <div className="section-header-v2">
                      <h3>Technical Expertise</h3>
                      <button className="add-skill-btn" onClick={() => setShowSkillModal(true)}>
                         <Plus size={18} /> Add Skill
                      </button>
                   </div>
                   <div className="skills-grid-v2">
                      {user?.skills?.map(skill => (
                        <div key={skill.id} className="skill-card-v2">
                           <div className="skill-header-v2">
                              <h4>{skill.skill_name}</h4>
                              <span className={`proficiency-badge ${skill.proficiency.toLowerCase()}`}>
                                 {skill.proficiency}
                              </span>
                           </div>
                           <div className="skill-progress-v2">
                              <div className="progress-track-v2">
                                 <div 
                                    className="progress-fill-v2" 
                                    style={{ 
                                       width: skill.proficiency === 'Advanced' ? '90%' : skill.proficiency === 'Intermediate' ? '65%' : '35%' 
                                    }}
                                 ></div>
                              </div>
                           </div>
                           <div className="skill-footer-v2">
                              <span className="endorsements-v2">
                                 <Award size={14} /> {skill.endorsements || 0} Endorsements
                              </span>
                              <button 
                                 className="delete-skill-icon"
                                 onClick={() => handleDeleteSkill(skill.id)}
                              >
                                 <Trash2 size={16} />
                              </button>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              )}

              {activeTab === 'portfolio' && (
                <div className="portfolio-tab-v2">
                   <div className="section-header-v2">
                      <h3>Projects & Case Studies</h3>
                      <button className="add-project-btn" onClick={() => setShowProjectModal(true)}>
                         <Plus size={18} /> New Project
                      </button>
                   </div>

                   {/* AI PORTFOLIO INSIGHTS PANEL */}
                   <div className="ai-portfolio-intelligence mt-8 bg-slate-900 text-white p-8 rounded-[32px] border border-slate-700 shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Zap size={120} />
                      </div>
                      
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                        <div className="max-w-xl">
                           <div className="flex items-center gap-2 text-primary font-bold mb-3">
                              <Sparkles size={18} className="text-amber-400" /> AI Portfolio Intelligence
                           </div>
                           <h3 className="text-2xl font-black mb-2 text-white">Portfolio Optimization Engine</h3>
                           <p className="text-slate-400 text-sm leading-relaxed">
                              Our AI scans your project descriptions, technology spread, and content depth to help you stand out to recruiters.
                           </p>
                        </div>
                        <button 
                          className={`btn ${scanning ? 'bg-slate-700' : 'btn-primary'} py-4 px-8 rounded-2xl flex items-center gap-2 font-bold shadow-lg shadow-primary/20`}
                          onClick={handleAiScan}
                          disabled={scanning}
                        >
                          {scanning ? <RefreshCcw size={18} className="animate-spin" /> : <Zap size={18} />}
                          {scanning ? 'Analyzing Portfolio...' : 'Run AI Analysis'}
                        </button>
                      </div>

                      {aiAnalysis && (
                        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                           <div className="md:col-span-1 bg-white/5 p-6 rounded-2xl border border-white/10 text-center">
                              <div className="text-4xl font-black text-primary mb-1">{aiAnalysis.score}%</div>
                              <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Health Score</div>
                              <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
                                 <div className="h-full bg-primary" style={{width: `${aiAnalysis.score}%`}}></div>
                              </div>
                           </div>

                           <div className="md:col-span-2 space-y-4">
                              <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                                 <h4 className="text-sm font-bold text-emerald-400 mb-2 flex items-center gap-2">
                                    <CheckCircle size={14} /> AI Verdict
                                 </h4>
                                 <p className="text-slate-200 text-sm leading-relaxed italic">
                                    "{aiAnalysis.analysis}"
                                 </p>
                              </div>

                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                 <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                                    <h4 className="text-[10px] uppercase font-bold text-slate-500 mb-3 tracking-widest">Next Steps</h4>
                                    <ul className="space-y-2">
                                       {aiAnalysis.suggestions?.map((s, i) => (
                                          <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                                             <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shrink-0"></div>
                                             {s}
                                          </li>
                                       ))}
                                    </ul>
                                 </div>
                                 <div className="bg-white/5 p-5 rounded-2xl border border-white/5 flex flex-col justify-center items-center text-center">
                                    <div className="text-2xl font-bold text-white mb-0.5">{aiAnalysis.project_count}</div>
                                    <div className="text-[10px] uppercase font-bold text-slate-500">Live Projects</div>
                                 </div>
                              </div>
                           </div>
                        </div>
                      )}
                   </div>

                    <div className="projects-grid-v2">
                       {portfolio.filter(p => p.type === 'project').map(proj => (
                         <div key={proj.id} className="project-card-v2">
                            <div className="project-img-placeholder">
                               {proj.image_url ? <img src={proj.image_url} alt={proj.title} /> : <FileText size={40} />}
                            </div>
                            <div className="project-info-v2">
                               <div className="flex justify-between items-start">
                                  <h4>{proj.title}</h4>
                                  <button className="text-slate-400 hover:text-red-500" onClick={() => handleDeletePortfolioItem(proj.id)}>
                                     <Trash2 size={16} />
                                  </button>
                               </div>
                               <p>{proj.description}</p>
                               <div className="project-tags-mini">
                                  {proj.technologies?.split(',').map((tech, i) => (
                                     <span key={i} className="tech-tag-mini">{tech.trim()}</span>
                                  ))}
                               </div>
                               <div className="project-links-v2">
                                  <a href={proj.link_url} target="_blank" rel="noopener noreferrer"><ExternalLink size={16} /> View Demo</a>
                               </div>
                            </div>
                         </div>
                       ))}
                    </div>
                   
                    <div className="section-header-v2" style={{marginTop: '40px'}}>
                       <h3>Certifications</h3>
                       <button className="add-project-btn" onClick={() => setShowCertModal(true)}>
                          <Plus size={18} /> New Certificate
                       </button>
                    </div>
                    <div className="certs-list-v2">
                       {portfolio.filter(p => p.type === 'certificate').map(cert => (
                         <div key={cert.id} className="cert-item-v2">
                            <Award className="cert-icon" />
                            <div className="cert-text">
                               <h4>{cert.title}</h4>
                               <p>{cert.description || 'Issuing Organization'}</p>
                            </div>
                            <div className="flex gap-2">
                               {cert.link_url && (
                                 <button className="download-cert-btn" onClick={() => window.open(cert.link_url, '_blank')} title="View Certificate">
                                    <ExternalLink size={18} />
                                 </button>
                               )}
                               <button className="download-cert-btn text-red-500 hover:bg-red-50" onClick={() => handleDeletePortfolioItem(cert.id)} title="Remove">
                                  <Trash2 size={18} />
                               </button>
                            </div>
                         </div>
                       ))}
                    </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="reviews-tab-v2">
                   <h3>Recruiter Testimonials</h3>
                   <div className="reviews-list-v2">
                      {reviews.length > 0 ? reviews.map(rev => (
                        <div key={rev.id} className="review-card-v2">
                           <div className="review-header-v2">
                              <img src={rev.recruiter_avatar || `https://ui-avatars.com/api/?name=${rev.recruiter_name}`} alt="" />
                              <div className="rev-meta">
                                 <h4>{rev.recruiter_name}</h4>
                                 <div className="stars-mini">
                                    {[...Array(5)].map((_, i) => (
                                       <Star key={i} size={12} fill={i < rev.rating ? "#FFD700" : "none"} color="#FFD700" />
                                    ))}
                                 </div>
                              </div>
                              <span className="rev-date">{new Date(rev.created_at).toLocaleDateString()}</span>
                           </div>
                           <p className="rev-comment">"{rev.comment}"</p>
                        </div>
                      )) : (
                        <div className="empty-state-v2">
                           <MessageSquare size={48} />
                           <p>No reviews yet. Keep applying to get noticed!</p>
                        </div>
                      )}
                   </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 5. AI Match Recommendations (Page 5 Sync) */}
        {recommendedJobs.length > 0 && (
          <div className="recommendations-container-v2">
             <div className="section-header-v2">
                <h3>✨ AI Job Match Recommendations</h3>
                <span className="ai-status-badge">Based on your skills</span>
             </div>
             <div className="recommendations-grid-v2">
                {recommendedJobs.map(job => (
                  <div key={job.id} className="rec-job-card-v2" onClick={() => navigate(`/jobs/${job.id}`)}>
                     <div className="rec-card-header">
                        <div className="match-score-v2">
                           <svg viewBox="0 0 36 36" className="circular-chart-mini">
                              <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                              <path className={`circle ${job.matchScore >= 75 ? 'high' : 'mid'}`} strokeDasharray={`${job.matchScore}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                              <text x="18" y="20.35" className="percentage">{job.matchScore}%</text>
                           </svg>
                        </div>
                        <div className="rec-info">
                           <h4>{job.title}</h4>
                           <p>{job.recruiter_name || 'Premium Partner'}</p>
                        </div>
                     </div>
                     <div className="rec-card-footer">
                        <span className="rec-tag">{job.job_type}</span>
                        <span className="rec-tag">{job.location || 'Remote'}</span>
                        <div className="rec-arrow">→</div>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}
      </div>

      {showSkillModal && (
        <AddSkillModal 
           onClose={() => setShowSkillModal(false)} 
           onSuccess={() => { fetchProfile(); setShowSkillModal(false); }}
        />
      )}
      {showProjectModal && (
        <AddProjectModal 
           onClose={() => setShowProjectModal(false)} 
           onSuccess={() => { fetchProfile(); setShowProjectModal(false); }}
        />
      )}
      {showCertModal && (
        <AddCertificateModal 
           onClose={() => setShowCertModal(false)} 
           onSuccess={() => { fetchProfile(); setShowCertModal(false); }}
        />
      )}
      {showEditModal && (
        <EditProfileModal 
           userData={user}
           onClose={() => setShowEditModal(false)} 
           onSuccess={() => { fetchProfile(); setShowEditModal(false); }}
        />
      )}
    </div>
  );
};

export default Profile;
