import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import InterviewScheduler from "./InterviewScheduler";
import { 
  Brain, X, Search, Filter, ChevronDown, ChevronUp, 
  Star, MessageSquare, Calendar, CheckCircle, 
  XCircle, Filter as FilterIcon, ExternalLink, Download,
  TrendingUp, Zap,  MoreVertical, Send, Menu, Sparkles, Trash2, 
  Target, Clock, Tags, Settings
} from "lucide-react";
import HireConfirmationModal from "./profile/HireConfirmationModal";
import "./RecruiterApplicants.css"; 

const RecruiterApplicants = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [jobDetails, setJobDetails] = useState(null);

  const [showAIInsights, setShowAIInsights] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [schedulingApplicant, setSchedulingApplicant] = useState(null);
  const [aiFilter, setAiFilter] = useState(null);
  const [visibleCount, setVisibleCount] = useState(10);
  const [sortBy, setSortBy] = useState("match");
  const [hiringApplicant, setHiringApplicant] = useState(null);

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
        `/api/applications/job/${jobId}/smart-sort`, 
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
    } catch (err) {
        console.error("Error updating status:", err);
        alert("Failed to update status");
    }
  };

  const filteredApplicants = applicants.filter(app => {
    const matchesSearch = app.student_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || app.status === filterStatus;
    
    let matchesAi = true;
    if (aiFilter === 'top_match') matchesAi = Number(app.ai_match_score) >= 90;
    if (aiFilter === 'small_gap') matchesAi = Number(app.ai_match_score) >= 75 && Number(app.ai_match_score) < 90;

    return matchesSearch && matchesStatus && matchesAi;
  });

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
                    <option value="match">Suitability Score</option>
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
            <span className="filter-label">Smart Filters:</span>
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
              <Brain size={14} /> Low Skill Gap
            </button>
        </div>
      </div>

      <div className="list-header">
        <div className="bulk-actions">
            <span className="text-sm font-medium text-slate-600">Applicant List</span>
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
                    className="applicant-card"
                >
                    <div className="card-avatar-section">
                        <div className="applicant-avatar">
                            {app.student_name.charAt(0)}
                        </div>
                    </div>

                    <div className="applicant-details">
                        <div className="applicant-main-info flex items-center justify-between">
                            <div className="flex items-center">
                                <h3>{app.student_name}</h3>
                                <div className="applicant-match-badge-v2">
                                    <span className={`match-score-pill-v2 ${app.ai_match_score >= 75 ? 'high' : app.ai_match_score >= 50 ? 'mid' : 'low'}`}>
                                        {app.ai_match_score}% Match
                                    </span>
                                    {app.interview_status && (
                                        <span className={`status-pill ml-2 ${app.interview_status === 'accepted' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                            Interview: {app.interview_status.toUpperCase()}
                                        </span>
                                    )}
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
                        </div>
                    </div>

                    <div className="applicant-actions">
                        <div className="flex flex-col gap-2 w-full">
                            <select 
                                value={app.status || 'pending'}
                                onChange={(e) => {
                                    if(e.target.value === 'hired') {
                                        setHiringApplicant(app);
                                    } else {
                                        handleStatusUpdate(app.application_id, e.target.value);
                                    }
                                }}
                                className="action-select status-dropdown"
                            >
                                <option value="pending">Pending</option>
                                <option value="accepted">Shortlisted</option>
                                <option value="rejected">Rejected</option>
                                <option value="hired">Hired</option>
                            </select>
                            
                            <div className="card-btns">
                                <button className="btn btn-outline btn-sm py-1.5" onClick={() => navigate(`/evaluation/${app.application_id}`, { state: { application: app } })}>View Profile</button>
                                <button className="btn btn-primary btn-sm py-1.5" title="Message Applicant" onClick={async () => { try { const token = localStorage.getItem('token'); const res = await axios.post('/api/chat/rooms', { application_id: app.application_id }, { headers: { Authorization: `Bearer ${token}` } }); navigate(`/chat/${res.data.room_id}`); } catch(e) { alert('Could not open chat'); } }}><MessageSquare size={14} /></button>
                            </div>
                        </div>

                        <div className="quick-actions-row">
                            {app.status === 'accepted' && (
                                <button 
                                    className="quick-btn hire"
                                    onClick={() => setHiringApplicant(app)}
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

      {schedulingApplicant && (
          <InterviewScheduler 
            application={schedulingApplicant}
            onClose={() => setSchedulingApplicant(null)}
          />
      )}

      {hiringApplicant && (
          <HireConfirmationModal 
            application={hiringApplicant}
            onClose={() => setHiringApplicant(null)}
            onConfirm={() => {
                setHiringApplicant(null);
                fetchApplicants(); // Refresh list to show 'hired' status
            }}
          />
      )}
    </div>
  );
};


export default RecruiterApplicants;

