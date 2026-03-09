import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Globe, Github, Linkedin, FileText, Calendar, 
  ShieldCheck, Mail, Star, ExternalLink, Award, Briefcase, 
  MessageSquare, Zap, ChevronRight, User as UserIcon
} from 'lucide-react';
import './Profile.css';

const PublicProfile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');

  useEffect(() => {
    fetchPublicData();
  }, [id]);

  const fetchPublicData = async () => {
    try {
      const [profRes, revRes] = await Promise.all([
        axios.get(`/api/users/${id}`),
        axios.get(`/api/users/${id}/reviews`)
      ]);
      setProfile(profRes.data);
      setReviews(revRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching public profile:', error);
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'about', label: 'About', icon: <User size={18} /> },
    { id: 'skills', label: 'Skills', icon: <Zap size={18} /> },
    { id: 'reviews', label: 'Reviews', icon: <MessageSquare size={18} /> },
  ];

  if (loading) return <div className="p-8 text-center">Loading student profile...</div>;
  if (!profile) return <div className="p-8 text-center">Profile not found.</div>;

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  return (
    <div className="profile-container-v2">
      <div className="profile-banner-gradient-public"></div>

      <div className="profile-main-content">
        <div className="profile-intro-card">
          <div className="avatar-overlap-group">
            <div className="avatar-wrapper-large">
              <img 
                src={profile.avatar || `https://ui-avatars.com/api/?name=${profile.name}&background=0057D9&color=fff`} 
                alt={profile.name} 
              />
            </div>
            <div className="profile-identity">
              <h1 className="name-h1">{profile.name} {profile.is_verified && <ShieldCheck size={20} className="verified-icon" />}</h1>
              <p className="title-p">{profile.headline || profile.role?.toUpperCase()}</p>
              <div className="meta-row">
                <span className="meta-item"><MapPin size={14} /> {profile.location || 'Unknown'}</span>
                <span className="meta-item"><Calendar size={14} /> Joined {new Date(profile.created_at).toLocaleDateString()}</span>
                {reviews.length > 0 && (
                  <span className="meta-item rating-stars">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill={i < Math.round(averageRating) ? "#FFD700" : "#E2E8F0"} color={i < Math.round(averageRating) ? "#FFD700" : "#E2E8F0"} />
                    ))}
                    <span className="rating-num">{averageRating}</span>
                  </span>
                )}
              </div>
            </div>
          </div>
          <button className="primary-btn-v2" onClick={() => window.location.href = `mailto:${profile.email}`}>
             <Mail size={18} /> Contact Student
          </button>
        </div>

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

        <div className="tab-content-area">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'about' && (
                <div className="about-tab-grid">
                  <section className="profile-bio-section">
                    <h3>Biography</h3>
                    <p className="text-slate-600 leading-relaxed">{profile.bio || "This student hasn't added a bio yet."}</p>
                  </section>
                  <section className="social-links-area">
                    <h3>Professional Links</h3>
                    <div className="social-grid-v2">
                      {profile.github_url && <a href={profile.github_url} className="social-card-v2"><Github /> GitHub</a>}
                      {profile.linkedin_url && <a href={profile.linkedin_url} className="social-card-v2"><Linkedin /> LinkedIn</a>}

                    </div>
                  </section>
                </div>
              )}

              {activeTab === 'skills' && (
                <div className="skills-grid-v2">
                  {profile.skills?.map(skill => (
                    <div key={skill.id} className="skill-card-v2">
                      <div className="skill-header-v2">
                        <h4>{skill.skill_name}</h4>
                        <span className={`proficiency-badge ${skill.proficiency.toLowerCase()}`}>
                          {skill.proficiency}
                        </span>
                      </div>
                      <div className="endorsements-v2 mt-4">
                        <Award size={14} /> {skill.endorsements || 0} Endorsements
                      </div>
                    </div>
                  ))}
                </div>
              )}



              {activeTab === 'reviews' && (
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
                        </div>
                        <p className="rev-comment">"{rev.comment}"</p>
                     </div>
                   )) : <p>No recruiter reviews yet.</p>}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const User = ({ size }) => <UserIcon size={size} />;

export default PublicProfile;
