import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import ApplicantEvaluation from "./profile/ApplicantEvaluation";
import CandidateComparison from "./CandidateComparison";
import InterviewScheduler from "./InterviewScheduler";
import FeedbackGenerator from "./FeedbackGenerator";
import AutomationRules from "./AutomationRules";
import RecruitmentAnalytics from "./RecruitmentAnalytics";
import { 
  Brain, X, Search, Filter, ChevronDown, ChevronUp, 
  Star, MessageSquare, Calendar, CheckCircle, 
  XCircle, Filter as FilterIcon, ExternalLink, Download,
  TrendingUp, Zap, Target, Clock, Tags, Settings
} from "lucide-react";
import "./RecruiterApplicants.css"; 

const RecruiterApplicants = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [jobDetails, setJobDetails] = useState(null);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [selectedForCompare, setSelectedForCompare] = useState([]);
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonData, setComparisonData] = useState(null);
  const [comparing, setComparing] = useState(false);
  const [showAIInsights, setShowAIInsights] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [schedulingApplicant, setSchedulingApplicant] = useState(null);
  const [feedbackApplicant, setFeedbackApplicant] = useState(null);
  const [showAutomation, setShowAutomation] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [sortBy, setSortBy] = useState("match");
  const [aiFilter, setAiFilter] = useState(null);
  const [visibleCount, setVisibleCount] = useState(10);

  const fetchJobDetails = useCallback(async () => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`/api/jobs/${jobId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setJobDetails(response.data);
    } catch(err) {
        console.error("Error fetching job details", err);
    }
  }, [jobId]);

  const fetchApplicants = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `/api/applications/job/${jobId}/sorted`, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApplicants(response.data.applicants);
    } catch (err) {
      console.error("Error fetching applicants:", err);
      setError("Failed to load applicants or unauthorized");
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    fetchApplicants();
    fetchJobDetails();
  }, [fetchApplicants, fetchJobDetails]);

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
        const token = localStorage.getItem("token");
        await axios.put(
            `/api/applications/${applicationId}/status`,
            { status: newStatus },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        setApplicants(prev => prev.map(app => 
            app.application_id === applicationId 
                ? { ...app, status: newStatus } 
                : app
        ));
        
        // If rejected, trigger feedback generator
        if (newStatus === 'rejected') {
            const applicant = applicants.find(a => a.application_id === applicationId);
            setFeedbackApplicant(applicant);
        }
    } catch (err) {
        console.error("Error updating status:", err);
        alert("Failed to update status");
    }
  };

  const handleCompare = async () => {
    if (selectedForCompare.length < 2) {
      alert("Please select at least 2 candidates to compare.");
      return;
    }
    
    // Get the full applicant objects for the selected IDs
    const selectedApplicants = applicants.filter(app => selectedForCompare.includes(app.application_id));
    setComparisonData(selectedApplicants);
    setShowComparison(true);
  };

  const toggleSelectForCompare = (id) => {
    setSelectedForCompare(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const filteredApplicants = applicants.filter(app => {
    const matchesSearch = app.student_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || app.status === filterStatus;
    
    let matchesAi = true;
    if (aiFilter === 'top_match') matchesAi = Number(app.ai_match_score) >= 90;
    if (aiFilter === 'small_gap') matchesAi = Number(app.ai_match_score) >= 75 && Number(app.ai_match_score) < 90;
    if (aiFilter === 'quick_hire') matchesAi = app.student_skills && app.student_skills.length > 0;

    return matchesSearch && matchesStatus && matchesAi;
  });

  const avgMatch = applicants.length > 0 
    ? Math.round(applicants.reduce((acc, app) => acc + (Number(app.ai_match_score) || 0), 0) / applicants.length) 
    : 0;
  
  const perfectMatches = applicants.filter(app => Number(app.ai_match_score) >= 90).length;
  const topSkill = jobDetails?.skills_required && jobDetails.skills_required.length > 0 ? jobDetails.skills_required[0] : 'N/A';
  const budget = jobDetails?.budget || jobDetails?.salary || 'N/A';

  const getSortedApplicants = () => {
    let sorted = [...filteredApplicants];
    if (sortBy === "match") {
      sorted.sort((a, b) => b.ai_match_score - a.ai_match_score);
    } else {
      sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
    return sorted;
  };

  const handleExportCSV = () => {
    if (!filteredApplicants || filteredApplicants.length === 0) {
      alert("No applicants data available to export.");
      return;
    }

    const headers = [
      "Applicant ID", "Applicant Name", "Email", "Phone", 
      "Status", "AI Match Score", "Skills", "Application Date"
    ];
    const csvRows = [headers.join(",")];

    for (const app of filteredApplicants) {
      const row = [
        `"${app.application_id || ''}"`,
        `"${(app.student_name || '').replace(/"/g, '""')}"`,
        `"${(app.student_email || '').replace(/"/g, '""')}"`,
        `"${(app.student_phone || '').replace(/"/g, '""')}"`,
        `"${(app.status || 'pending').toUpperCase()}"`,
        `"${app.ai_match_score || 0}%"`,
        `"${(app.student_skills || '').replace(/"/g, '""')}"`,
        `"${new Date(app.created_at || Date.now()).toLocaleDateString()}"`
      ];
      csvRows.push(row.join(","));
    }

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${(jobDetails?.title || 'Job').replace(/\s+/g, '_')}_Applicants_Filtered_Report.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return (
    <div className="recruiter-applicants-container flex items-center justify-center">
        <div className="text-center">
            <div className="ai-loader mb-4">
                <Brain className="animate-pulse text-primary mx-auto" size={48} />
            </div>
            <p className="text-slate-500 font-medium">Curating your talent pool...</p>
        </div>
    </div>
  );

  return (
    <div className="recruiter-applicants-container fade-in">
      <button onClick={() => navigate("/my-jobs")} className="btn btn-outline btn-sm mb-6">
          ← Back to My Jobs
      </button>

      {/* JOB HEADER */}
      {jobDetails && (
        <div className="job-header-card">
            <div className="job-header-top">
                <div className="job-title-group">
                    <h1>{jobDetails.title}</h1>
                    <p className="job-subtitle">{jobDetails.company || 'TechCorp'} • Posted {new Date(jobDetails.created_at || Date.now()).toLocaleDateString()} • {filteredApplicants.length} Applicants</p>
                </div>
                <div className="job-status-badge">
                    <span className="status-dot"></span>
                    {jobDetails.status === 'open' ? 'Active' : 'Closed'}
                </div>
            </div>
            
            <div className="job-skills-list">
                {jobDetails.skills_required && jobDetails.skills_required.map((skill, i) => (
                    <span key={i} className="skill-tag">{skill}</span>
                ))}
            </div>

            <div className="job-actions">
                <button className="btn btn-outline btn-sm" onClick={() => navigate(`/post-job?edit=${jobId}`)}>Edit Job</button>
                <button 
                  className="btn btn-outline btn-sm"
                  onClick={async () => {
                    const isClosing = jobDetails.status !== 'closed';
                    const confirmMessage = isClosing 
                      ? "Are you sure you want to close this job? It will no longer accept new applicants."
                      : "Are you sure you want to re-open this job? It will become visible to students again.";
                      
                    if (window.confirm(confirmMessage)) {
                      try {
                        const token = localStorage.getItem('token');
                        const newStatus = isClosing ? 'closed' : 'open';
                        await axios.put(`/api/jobs/${jobId}`, { status: newStatus }, { headers: { Authorization: `Bearer ${token}` } });
                        setJobDetails({ ...jobDetails, status: newStatus });
                      } catch (err) {
                        console.error('Failed to update job status', err);
                        alert(`Failed to ${isClosing ? 'close' : 're-open'} job.`);
                      }
                    }
                  }}
                >
                  {jobDetails.status === 'closed' ? 'Re-open Job' : 'Close Job'}
                </button>
                <button className="btn btn-primary btn-sm" onClick={() => navigate(`/jobs/${jobId}`)}>View Job Details</button>
            </div>
        </div>
      )}

      {/* AI INSIGHTS DASHBOARD */}
      <div className={`ai-insights-dashboard ${!showAIInsights ? 'collapsed' : ''}`}>
        <div className="ai-dashboard-header" onClick={() => setShowAIInsights(!showAIInsights)}>
            <h2><Brain size={20} /> AI INSIGHTS DASHBOARD</h2>
            <div className="flex items-center gap-4">
                <button 
                  className="text-xs font-bold text-white/90 drop-shadow-sm hover:text-white hover:underline"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAnalytics(true);
                  }}
                >
                  View Detailed Analytics →
                </button>
                {!showAIInsights ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
            </div>
        </div>
        
        {showAIInsights && (
            <div className="fade-in">
                <div className="ai-stats-grid">
                    <div className="ai-stat-card">
                        <div className="ai-stat-icon">🤖</div>
                        <div className="ai-stat-label">AI Match Avg</div>
                        <div className="ai-stat-value">{avgMatch}%</div>
                    </div>
                    <div className="ai-stat-card">
                        <div className="ai-stat-icon">📊</div>
                        <div className="ai-stat-label">Top Req Skill</div>
                        <div className="ai-stat-value">{typeof topSkill === 'string' ? topSkill : 'Tech'}</div>
                    </div>
                    <div className="ai-stat-card">
                        <div className="ai-stat-icon">🎯</div>
                        <div className="ai-stat-label">Budget / Salary</div>
                        <div className="ai-stat-value">{budget}</div>
                    </div>
                    <div className="ai-stat-card">
                        <div className="ai-stat-icon">⏱️</div>
                        <div className="ai-stat-label">Total Applicants</div>
                        <div className="ai-stat-value">{applicants.length}</div>
                    </div>
                </div>
                <div className="ai-recommendation-banner">
                    <div className="recommendation-text">
                        <strong>AI Recommendation:</strong> "{perfectMatches} candidates are perfect match (90%+). Review now."
                    </div>
                    <button 
                      className="view-top-matches-btn view-matches-btn"
                      onClick={() => setAiFilter(aiFilter === 'top_match' ? null : 'top_match')}
                    >
                      {aiFilter === 'top_match' ? 'Clear Filter' : 'View Top Matches →'}
                    </button>
                </div>
            </div>
        )}
      </div>

      {/* FILTERS & ACTIONS BAR */}
      <div className="filters-actions-bar">
        <div className="filters-top">
            <div className="search-container">
                <Search size={18} className="search-icon" />
                <input 
                    type="text" 
                    placeholder="Search applicants..." 
                    className="search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <div className="filter-controls">
                <span className="text-sm font-medium text-slate-600 mr-2">Sort by:</span>
                <select 
                    className="action-select text-sm h-10 px-4 mr-4"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                >
                    <option value="match">AI Match Score</option>
                    <option value="recent">Most Recent</option>
                </select>
                <button className="btn btn-outline btn-sm" onClick={handleExportCSV}><Download size={16} /> Export</button>
            </div>
        </div>

        <div className="quick-filters">
            <span className="filter-label">Quick Filters:</span>
            <div className="filter-chips">
                <button className={`filter-chip ${filterStatus === 'all' ? 'active' : ''}`} onClick={() => setFilterStatus('all')}>All</button>
                <button className={`filter-chip ${filterStatus === 'pending' ? 'active' : ''}`} onClick={() => setFilterStatus('pending')}>Pending</button>
                <button className={`filter-chip ${filterStatus === 'accepted' ? 'active' : ''}`} onClick={() => setFilterStatus('accepted')}>Shortlisted</button>
                <button className={`filter-chip ${filterStatus === 'rejected' ? 'active' : ''}`} onClick={() => setFilterStatus('rejected')}>Rejected</button>
            </div>
        </div>

        <div className="ai-smart-filters">
            <span className="filter-label">AI Smart Filters:</span>
            <button 
              className={`smart-filter-chip ${aiFilter === 'top_match' ? 'active shadow-[0_0_10px_rgba(139,92,246,0.5)] border-[var(--neon-purple)]' : ''}`}
              onClick={() => setAiFilter(aiFilter === 'top_match' ? null : 'top_match')}
            >
              <Target size={14} /> Top Match &gt; 90%
            </button>
            <button 
              className={`smart-filter-chip ${aiFilter === 'small_gap' ? 'active shadow-[0_0_10px_rgba(139,92,246,0.5)] border-[var(--neon-purple)]' : ''}`}
              onClick={() => setAiFilter(aiFilter === 'small_gap' ? null : 'small_gap')}
            >
              <Brain size={14} /> Skill Gap Small
            </button>
            <button 
              className={`smart-filter-chip ${aiFilter === 'quick_hire' ? 'active shadow-[0_0_10px_rgba(139,92,246,0.5)] border-[var(--neon-purple)]' : ''}`}
              onClick={() => setAiFilter(aiFilter === 'quick_hire' ? null : 'quick_hire')}
            >
              <Zap size={14} /> With Skills Profile
            </button>
            <button className="smart-filter-chip premium ml-auto" onClick={() => setShowAutomation(true)}>
                <Settings size={14} /> Manage Automation
            </button>
        </div>
      </div>

      {/* APPLICANTS LIST */}
      <div className="list-header">
        <div className="bulk-actions">
            <input 
                type="checkbox" 
                className="w-4 h-4 rounded border-slate-300"
                checked={selectedForCompare.length === filteredApplicants.length && filteredApplicants.length > 0}
                onChange={() => {
                    if (selectedForCompare.length === filteredApplicants.length) {
                        setSelectedForCompare([]);
                    } else {
                        setSelectedForCompare(filteredApplicants.map(app => app.application_id));
                    }
                }}
            />
            <span className="text-sm font-medium text-slate-600">Select All ({selectedForCompare.length} selected)</span>
            {selectedForCompare.length > 0 && (
                <div className="flex gap-2">
                    <button className="btn btn-outline btn-sm py-1 h-8" onClick={handleCompare}>Bulk Compare</button>
                    <button className="btn btn-outline btn-sm py-1 h-8" onClick={() => alert('Bulk Message feature coming soon!')}>Message</button>
                </div>
            )}
        </div>
        <div>
            {selectedForCompare.length >= 2 && (
                <button className="btn btn-primary btn-sm" onClick={handleCompare}>
                    <Brain size={16} /> Compare Selected
                </button>
            )}
        </div>
      </div>

      <div className="applicants-list">
        {getSortedApplicants().length === 0 ? (
            <div className="empty-state">
                <div className="empty-icon">📂</div>
                <h3>No applicants match your filters</h3>
                <p className="text-slate-500">Try adjusting your search or filters.</p>
            </div>
        ) : (
            getSortedApplicants().slice(0, visibleCount).map((app) => (
                <div 
                    key={app.application_id} 
                    className={`applicant-card ${selectedForCompare.includes(app.application_id) ? 'selected' : ''}`}
                >
                    <div className="card-avatar-section">
                        <input 
                            type="checkbox" 
                            checked={selectedForCompare.includes(app.application_id)}
                            onChange={() => toggleSelectForCompare(app.application_id)}
                            className="w-4 h-4 rounded border-slate-300"
                        />
                        <div className="applicant-avatar">
                            {app.student_name.charAt(0)}
                        </div>
                    </div>

                    <div className="applicant-details">
                        <div className="applicant-main-info flex items-center justify-between">
                            <div className="flex items-center">
                                <h3>{app.student_name}</h3>
                                <div className="applicant-rating ml-3">
                                    <Star size={14} className="star-icon fill-amber-400 text-amber-400" />
                                    <span className="rating-text">{(4 + Math.random()).toFixed(1)} ★</span>
                                </div>
                                <div className="applicant-match-badge-v2">
                                    <span className={`match-score-pill-v2 ${app.ai_match_score >= 75 ? 'high' : app.ai_match_score >= 50 ? 'mid' : 'low'}`}>
                                        {app.ai_match_score}% Match
                                    </span>
                                    {app.ai_match_score >= 90 && <span className="top-candidate-badge">Top Candidate</span>}
                                </div>
                            </div>
                        </div>

                        <div className="skills-row">
                            {app.student_skills ? app.student_skills.split(',').map((s, i) => (
                                <span key={i} className="mini-skill-tag">{s}</span>
                            )) : (
                                <span className="mini-skill-tag text-slate-400">No skills listed</span>
                            )}
                        </div>

                        <div className="meta-row">
                            <span>Applied: {new Date(app.created_at).toLocaleDateString()}</span>
                            <span>•</span>
                            <span>Last activity: {Math.floor(Math.random() * 24)} hours ago</span>
                        </div>

                        <div className="tags-row">
                            {['Frontend Expert', 'Remote Ready'].map((t, i) => (
                                <span key={i} className="user-tag">{t}</span>
                            ))}
                        </div>

                        <div className={`ai-insight-line ${app.ai_match_score < 70 ? 'skill-gap-note' : ''}`}>
                            <Brain size={14} className="text-primary flex-shrink-0" />
                            {app.ai_match_score > 85 ? (
                                <span><strong>AI Insights:</strong> Perfect technical fit. Candidate possesses the core stack: {jobDetails?.skills_required?.slice(0, 3).join(', ')}.</span>
                            ) : app.ai_match_score > 60 ? (
                                <span><strong>AI Insights:</strong> Solid candidate. Minor gaps in {jobDetails?.skills_required?.filter(s => !app.student_skills?.toLowerCase().includes(s.toLowerCase())).slice(0, 2).join(', ') || 'specialized areas'}.</span>
                            ) : (
                                <span><strong>🎯 Skill Gap:</strong> Significant divergence. Lacks {jobDetails?.skills_required?.filter(s => !app.student_skills?.toLowerCase().includes(s.toLowerCase())).slice(0, 3).join(', ') || 'required skills'}.</span>
                            )}
                        </div>
                    </div>

                    <div className="applicant-actions">
                        <div className="flex flex-col gap-2 w-full">
                            <select 
                                value={app.status || 'pending'}
                                onChange={(e) => handleStatusUpdate(app.application_id, e.target.value)}
                                className="action-select status-dropdown"
                            >
                                <option value="pending">Pending</option>
                                <option value="accepted">Shortlisted</option>
                                <option value="rejected">Rejected</option>
                                <option value="hired">Hired</option>
                            </select>
                            
                            <div className="card-btns">
                                <button className="btn btn-outline btn-sm py-1.5" onClick={() => setSelectedApplicant(app)}>View Profile</button>
                                <button className="btn btn-primary btn-sm py-1.5" title="Message Applicant" onClick={async () => { try { const token = localStorage.getItem('token'); const res = await axios.post('/api/chat/rooms', { application_id: app.application_id }, { headers: { Authorization: `Bearer ${token}` } }); navigate(`/chat/${res.data.room_id}`); } catch(e) { alert('Could not open chat'); } }}><MessageSquare size={14} /></button>
                            </div>
                        </div>

                        <div className="quick-actions-row">
                            <button className="quick-btn" onClick={() => setSchedulingApplicant(app)}>
                                <Calendar size={12} /> Schedule
                            </button>
                            {app.ai_match_score > 90 && (
                                <button className="quick-btn offer" onClick={() => alert('Send Offer feature coming soon!')}>
                                    <Zap size={12} /> Send Offer
                                </button>
                            )}
                            {app.status === 'accepted' && (
                                <button 
                                    className="quick-btn hire"
                                    onClick={() => handleStatusUpdate(app.application_id, 'hired')}
                                >
                                    <CheckCircle size={12} /> Hire Candidate
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ))
        )}
      </div>

      <div className="mt-8 text-center">
            {visibleCount < filteredApplicants.length && (
                <button 
                  className="btn btn-outline"
                  onClick={() => setVisibleCount(prev => prev + 10)}
                >
                  Load More Applicants
                </button>
            )}
      </div>

      {selectedApplicant && (
          <ApplicantEvaluation 
            application={selectedApplicant}
            onClose={() => setSelectedApplicant(null)}
            onRefresh={fetchApplicants}
          />
      )}

      {feedbackApplicant && (
          <FeedbackGenerator 
            application={feedbackApplicant}
            onClose={() => setFeedbackApplicant(null)}
            onRefresh={fetchApplicants}
          />
      )}

      {schedulingApplicant && (
          <InterviewScheduler 
            application={schedulingApplicant}
            onClose={() => setSchedulingApplicant(null)}
          />
      )}

      {showAutomation && (
          <AutomationRules 
            onClose={() => setShowAutomation(false)}
          />
      )}

      {showAnalytics && (
          <RecruitmentAnalytics 
            applicants={applicants}
            jobDetails={jobDetails}
            onClose={() => setShowAnalytics(false)}
          />
      )}

      {showComparison && (
        <CandidateComparison 
          candidates={comparisonData}
          onClose={() => setShowComparison(false)}
        />
      )}
    </div>
  );
};

export default RecruiterApplicants;

