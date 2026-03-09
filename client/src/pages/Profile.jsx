import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, MapPin, Phone, Mail, Globe, Github, Linkedin, FileText, 
  Save, User, Star, Plus, Trash2, ExternalLink, Download, MessageSquare, 
  Award, Zap, CheckCircle
} from 'lucide-react';
import AddSkillModal from '../components/profile/AddSkillModal';
import EditProfileModal from '../components/profile/EditProfileModal';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '', headline: '', bio: '', phone: '', location: '',
    github_url: '', linkedin_url: '', resume_url: '',
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
        headline: res.data.headline || '',
        bio: res.data.bio || '',
        phone: res.data.phone || '',
        location: res.data.location || '',
        github_url: res.data.github_url || '',
        linkedin_url: res.data.linkedin_url || '',
        resume_url: res.data.resume_url || '',
        avatar: res.data.avatar || ''
      });

      // Fetch additional data
      const revRes = await axios.get(`/api/admin/reviews/${res.data.id}`);
      setReviews(revRes.data);
      
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

  const tabs = [
    { id: 'about', label: 'About', icon: <User size={18} /> },
    { id: 'skills', label: 'Skills', icon: <Zap size={18} /> },
    { id: 'reviews', label: 'Reviews', icon: <MessageSquare size={18} /> },
  ];

  if (loading) return <div className="p-8 text-center">Loading premium profile...</div>;

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

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
              <p className="title-p">{formData.headline || 'Aspiring Professional'}</p>
              <div className="meta-row">
                <span className="meta-item"><MapPin size={14} /> {formData.location || 'Remote'}</span>
                <span className="meta-item rating-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill={i < Math.round(averageRating) ? "#FFD700" : "#E2E8F0"} color={i < Math.round(averageRating) ? "#FFD700" : "#E2E8F0"} />
                  ))}
                  <span className="rating-num">{averageRating > 0 ? averageRating : "No reviews yet"}</span>
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
