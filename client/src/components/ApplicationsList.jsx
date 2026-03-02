import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { 
  Trash2, 
  ExternalLink, 
  Calendar, 
  Building2, 
  Zap, 
  MessageSquare, 
  FileText, 
  CheckCircle, 
  MapPin, 
  Search, 
  Clock,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "./ApplicationsList.css";

const ApplicationsList = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/applications/student", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(response.data);
    } catch (err) {
      console.error("Error fetching applications:", err);
      setError("Failed to load applications");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleWithdraw = async (id) => {
    if (!window.confirm("Are you sure you want to withdraw this application? This action cannot be undone.")) return;
    
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/applications/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchApplications();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to withdraw application");
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const filteredApplications = useMemo(() => {
    return applications.filter(app => 
      app.job_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.company_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [applications, searchQuery]);

  if (loading) return (
    <div className="applications-view flex items-center justify-center">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"
      />
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="applications-view"
    >
      <header>
        <motion.h1 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          My Applications
        </motion.h1>
        <motion.p 
          className="text-slate-500 font-medium"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Track your active career journey and AI compatibility in real-time.
        </motion.p>
      </header>
      
      {error && <div className="p-4 bg-red-50 text-red-600 rounded-2xl mb-8 border border-red-100">{error}</div>}

      <div className="search-container">
        <Search className="search-icon" size={20} />
        <input 
          type="text" 
          placeholder="Search by job title or company..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <AnimatePresence mode="popLayout">
        {filteredApplications.length === 0 ? (
          <motion.div 
            key="empty"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="empty-state"
          >
            <div className="empty-icon">📫</div>
            <h3>No matches found</h3>
            <p className="text-slate-500 mb-8">Try adjusting your search or explore new opportunities.</p>
            <button onClick={() => navigate("/jobs")} className="btn btn-primary-glass px-8 py-4">
              Explore All Jobs <ArrowRight size={18} />
            </button>
          </motion.div>
        ) : (
          <div className="grid">
            {filteredApplications.map((app, idx) => (
              <motion.div 
                key={app.id} 
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="application-card"
              >
                 <div className="flex justify-between items-start">
                    <span className={`status-chip ${app.status.toLowerCase()}`}>
                       <Clock size={14} /> {app.status}
                    </span>
                    <span className="text-xs font-black text-slate-300 tracking-tighter uppercase">
                       {new Date(app.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                 </div>
                 
                 <div>
                    <h3 className="app-job_title">{app.job_title}</h3>
                    <div className="app-company">
                       <Building2 size={18} className="text-blue-600" /> {app.company_name}
                    </div>
                    <div className="app-details">
                       <div className="detail-pill">
                          <MapPin size={12} /> {app.location || "Remote"}
                       </div>
                       <div className="detail-pill">
                          <Zap size={12} /> {app.job_type}
                       </div>
                       <div className="detail-pill">
                          <Calendar size={12} /> {app.experience_level}
                       </div>
                    </div>
                 </div>

                 {app.status === 'hired' && (
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="offer-banner"
                    >
                        <h4><CheckCircle size={18} /> Congratulations! You're Hired</h4>
                        <div className="flex gap-2">
                           <button 
                             className="flex-1 bg-white/20 hover:bg-white/30 text-white border-none py-2 rounded-xl text-xs font-bold transition-all"
                             onClick={() => navigate(`/offer/${app.id}`)}
                           >
                             {app.is_offer_accepted ? 'View Offer' : 'Review Offer Letter'}
                           </button>
                           {app.is_offer_accepted === 1 && (
                             <button 
                               className="flex-1 bg-white text-emerald-600 py-2 rounded-xl text-xs font-bold transition-all"
                               onClick={() => navigate(`/onboarding/${app.id}`)}
                             >
                               Onboarding
                             </button>
                           )}
                        </div>
                    </motion.div>
                 )}

                 <div className="score-module">
                    <div className="flex justify-between mb-2">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AI Suitability Score</span>
                       <span className={`text-sm font-black ${app.ai_match_score > 75 ? 'text-emerald-600' : app.ai_match_score > 40 ? 'text-amber-500' : 'text-slate-400'}`}>
                          {app.ai_match_score}%
                       </span>
                    </div>
                    <div className="score-progress">
                       <motion.div 
                          className="score-fill"
                          initial={{ width: 0 }}
                          animate={{ width: `${app.ai_match_score}%` }}
                          transition={{ duration: 1.5, delay: 0.5 }}
                          style={{ 
                              backgroundColor: app.ai_match_score > 75 ? '#10b981' : app.ai_match_score > 40 ? '#f59e0b' : '#94a3b8'
                          }}
                       />
                    </div>
                 </div>
                 
                 <div className="action-hub">
                    <button 
                      className="btn btn-outline-glass flex-1" 
                      onClick={() => navigate(`/jobs/${app.job_id}`)}
                    >
                        <ExternalLink size={16} /> Listing
                    </button>
                    <button
                      className="btn btn-primary-glass flex-1"
                      onClick={async () => {
                        try {
                          const token = localStorage.getItem('token');
                          const res = await axios.post(`/api/chat/rooms`, { application_id: app.id }, { headers: { Authorization: `Bearer ${token}` } });
                          navigate(`/chat/${res.data.room_id}`);
                        } catch (e) { alert('Could not open chat'); }
                      }}
                    >
                      <MessageSquare size={16} /> Chat
                    </button>
                    {app.status === 'pending' && (
                      <motion.button 
                         whileHover={{ scale: 1.1 }}
                         whileTap={{ scale: 0.9 }}
                         className="btn-withdraw"
                         onClick={() => handleWithdraw(app.id)}
                         title="Withdraw Application"
                      >
                         <Trash2 size={18} />
                      </motion.button>
                    )}
                 </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ApplicationsList;

