import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, SlidersHorizontal, Sparkles, 
  MapPin, Briefcase, IndianRupee, Clock, 
  ChevronRight, Heart, Zap, LayoutGrid, 
  List, AlertCircle, CheckCircle2, X,
  Code, Palette, Globe, Terminal, Cpu, Database
} from 'lucide-react';
import './JobList.css';
import JobApplyModal from './JobApplyModal';

const getJobIcon = (title) => {
  const t = title.toLowerCase();
  if (t.includes('backend') || t.includes('node') || t.includes('python') || t.includes('java')) return <Database size={24} />;
  if (t.includes('frontend') || t.includes('react') || t.includes('web')) return <Globe size={24} />;
  if (t.includes('ui') || t.includes('ux') || t.includes('design')) return <Palette size={24} />;
  if (t.includes('full') || t.includes('stack')) return <Terminal size={24} />;
  if (t.includes('ai') || t.includes('ml') || t.includes('data')) return <Cpu size={24} />;
  return <Code size={24} />;
};

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    location: "",
    job_type: [],
    experience_level: [],
    salary_range: 500000 
  });
  const [userSkills, setUserSkills] = useState([]);
  const [sortBy, setSortBy] = useState("match");
  const [showFilters, setShowFilters] = useState(window.innerWidth > 1024);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  
  const [savedJobIds, setSavedJobIds] = useState(new Set());
  const [filterTopMatches, setFilterTopMatches] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserSkills();
    fetchSavedJobs();
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [searchTerm, filters]);

  const fetchUserSkills = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserSkills(res.data.skills || []);
    } catch (error) {
      console.error('Error fetching user skills:', error);
    }
  };

  const fetchSavedJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/jobs/saved', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSavedJobIds(new Set(res.data.map(j => j.id)));
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
    }
  };

  const toggleSave = async (jobId, e) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`/api/jobs/save/${jobId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const newSavedIds = new Set(savedJobIds);
      if (res.data.saved) {
        newSavedIds.add(jobId);
      } else {
        newSavedIds.delete(jobId);
      }
      setSavedJobIds(newSavedIds);
    } catch (error) {
      console.error('Error toggling save:', error);
    }
  };

  const calculateMatch = (jobSkills) => {
    if (!jobSkills || jobSkills.length === 0 || userSkills.length === 0) return 0;
    
    // Normalize user skills into a Set for O(1) lookup
    const userSkillSet = new Set(userSkills.map(s => s.skill_name.toLowerCase()));
    const jobSkillNames = jobSkills.map(s => s.toLowerCase());
    
    let matches = 0;
    jobSkillNames.forEach(skill => {
      if (userSkillSet.has(skill)) matches++;
    });
    
    return Math.round((matches / jobSkillNames.length) * 100);
  };

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filters.location) params.append('location', filters.location);
      if (filters.job_type.length > 0) params.append('type', filters.job_type[0]); 
      if (filters.experience_level.length > 0) params.append('experience', filters.experience_level[0]);

      const response = await axios.get(`/api/jobs?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const jobsWithScores = useMemo(() => {
    return jobs.map(job => ({
      ...job,
      company: job.recruiter_name || "SkillBridge Partner",
      matchScore: calculateMatch(job.skills_required || [])
    }));
  }, [jobs, userSkills]);

  const sortedJobs = useMemo(() => {
    let sorted = jobsWithScores.filter(j => {
      if (filterTopMatches) return j.matchScore >= 85;
      return true;
    });

    if (sortBy === "match") {
      sorted.sort((a, b) => b.matchScore - a.matchScore);
    } else if (sortBy === "salary") {
      sorted.sort((a, b) => {
        const getVal = (s) => parseInt(s?.replace(/[^0-9]/g, '') || 0);
        return getVal(b.salary_range) - getVal(a.salary_range);
      });
    } else {
      sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
    return sorted;
  }, [jobs, sortBy, filterTopMatches]);

  const matchStats = useMemo(() => {
    const excellent = jobs.filter(j => j.matchScore >= 85).length;
    const great = jobs.filter(j => j.matchScore >= 70 && j.matchScore < 85).length;
    return { excellent, great, total: jobs.length };
  }, [jobs]);

  const handleCheckboxChange = (category, value) => {
    setFilters(prev => {
      const current = prev[category];
      const updated = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value];
      return { ...prev, [category]: updated };
    });
  };

  const openApplyModal = (job, e) => {
    e.stopPropagation();
    setSelectedJob(job);
    setIsApplyModalOpen(true);
  };

  if (loading && jobs.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="loader-premium"></div>
      </div>
    );
  }

  return (
    <div className="job-explorer-v2 fade-in">
      {/* Search and Header Section */}
      <div className="explorer-header-section">
        <div className="header-breadcrumbs">
          <span>Home</span>
          <ChevronRight size={14} />
          <span className="active">Find Jobs</span>
        </div>
        
        <div className="flex-between explorer-top">
          <div className="title-group">
            <h1 className="font-[Outfit] text-3xl font-extrabold text-slate-900 m-0">Job Explorer</h1>
            <p className="text-slate-500 mt-1">Discover opportunities customized for your skill set</p>
          </div>
          <div className="view-switcher-group">
            <button 
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid size={18} />
            </button>
            <button 
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <List size={18} />
            </button>
          </div>
        </div>

        <div className="search-bar-premium">
          <div className="search-input-wrapper">
            <Search className="search-icon" size={20} />
            <input 
              type="text" 
              placeholder="Search job titles, skills, or companies..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchJobs()}
            />
          </div>
          <button className="search-btn-premium" onClick={fetchJobs}>Search Jobs</button>
        </div>
        
        <div className="quick-location-filters">
           <span className="text-xs font-bold text-slate-400 mr-2 uppercase tracking-widest">Quick Filter:</span>
           {['Remote', 'Bangalore', 'Mumbai', 'Pune', 'Hyderabad'].map(loc => (
             <button 
              key={loc} 
              className={`location-chip ${filters.location === loc ? 'active' : ''}`}
              onClick={() => setFilters(prev => ({...prev, location: prev.location === loc ? "" : loc}))}
             >
               {loc}
             </button>
           ))}
        </div>
      </div>

      {/* AI Match Summary Banner */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`ai-summary-banner ${filterTopMatches ? 'filtering' : ''}`}
        onClick={() => setFilterTopMatches(!filterTopMatches)}
        style={{ cursor: 'pointer' }}
      >
        <div className="ai-summary-content">
          <div className="ai-icon-pulse">
            <Sparkles size={24} />
          </div>
          <div className="ai-text">
            <h4>AI Intelligence Hub {filterTopMatches && <span className="text-xs bg-white/20 px-2 py-0.5 rounded ml-2">Filtering Top Matches</span>}</h4>
            <p>We found <strong>{matchStats.excellent} Excellent Matches</strong> (&gt;85%) based on your {userSkills.length} skills.</p>
          </div>
        </div>
        <div className="ai-skills-tags">
          {userSkills.slice(0, 4).map(s => (
            <span key={s.id} className="user-skill-tag">{s.skill_name}</span>
          ))}
          {userSkills.length > 4 && <span className="user-skill-more">+{userSkills.length - 4} more</span>}
        </div>
        <div className="click-hint">Click to filter Top Matches</div>
      </motion.div>

      <div className="explorer-layout">
        {/* Advanced Filters Sidebar */}
        <AnimatePresence>
          {showFilters && (
            <motion.aside 
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              className="filters-sidebar-v2"
            >
              <div className="filters-container-v2">
                <div className="flex-between filter-header">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal size={18} className="text-primary" />
                    <h3 className="m-0 text-sm font-extrabold uppercase tracking-wider text-slate-800">Advanced Filters</h3>
                  </div>
                  <button 
                    className="clear-all-btn"
                    onClick={() => setFilters({ job_type: [], experience_level: [], location: "", salary_range: 500000 })}
                  >
                    Clear All
                  </button>
                </div>

                <div className="filter-group-v2">
                  <label>Location</label>
                  <div className="relative">
                    <Search className="input-icon" size={16} />
                    <input 
                      type="text" 
                      placeholder="Search location..." 
                      value={filters.location}
                      onChange={(e) => setFilters({...filters, location: e.target.value})}
                    />
                  </div>
                </div>

                <div className="filter-group-v2">
                  <label>Job Type</label>
                  <div className="checkbox-grid">
                    {['Full-time', 'Internship', 'Freelance', 'Contract'].map(type => (
                      <label key={type} className="checkbox-premium-v3">
                        <input 
                          type="checkbox" 
                          checked={filters.job_type.includes(type)}
                          onChange={() => handleCheckboxChange('job_type', type)}
                        />
                        <span className="checkmark-v3"></span>
                        <span className="label-text">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="filter-group-v2">
                  <label>Experience Level</label>
                  <div className="checkbox-grid">
                    {['Entry', 'Intermediate', 'Senior'].map(level => (
                      <label key={level} className="checkbox-premium-v3">
                        <input 
                          type="checkbox" 
                          checked={filters.experience_level.includes(level)}
                          onChange={() => handleCheckboxChange('experience_level', level)}
                        />
                        <span className="checkmark-v3"></span>
                        <span className="label-text">{level}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="filter-group-v2">
                  <label>Sort By</label>
                  <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    className="premium-select"
                  >
                    <option value="match">AI Match Score</option>
                    <option value="recent">Date Posted: Newest</option>
                    <option value="salary">Salary: High to Low</option>
                  </select>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <main className="explorer-main">
          {/* Active Filter Chips */}
          <div className="active-chips">
             {filters.job_type.map(t => (
               <span key={t} className="filter-chip">
                 {t} <X size={12} onClick={() => handleCheckboxChange('job_type', t)} />
               </span>
             ))}
             {filters.experience_level.map(l => (
               <span key={l} className="filter-chip">
                 {l} <X size={12} onClick={() => handleCheckboxChange('experience_level', l)} />
               </span>
             ))}
          </div>

          <motion.div 
            className={viewMode === 'grid' ? 'jobs-grid' : 'jobs-list'}
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            initial="hidden"
            animate="show"
          >
            {sortedJobs.length > 0 ? sortedJobs.map((job) => (
              <motion.div 
                key={job.id}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  show: { opacity: 1, y: 0 }
                }}
                className={`job-card-premium ${job.matchScore >= 85 ? 'top-match' : ''}`}
                onClick={() => navigate(`/jobs/${job.id}`)}
              >
                {job.matchScore >= 85 && (
                  <div className="top-match-badge">
                    <Sparkles size={12} /> TOP MATCH
                  </div>
                )}
                
                <div className="card-top">
                  <div className={`company-logo-placeholder ${job.title.toLowerCase().includes('backend') ? 'backend' : job.title.toLowerCase().includes('frontend') ? 'frontend' : 'default'}`}>
                    {getJobIcon(job.title)}
                  </div>
                  <div className="match-gauge">
                    <svg viewBox="0 0 36 36" className="circular-chart">
                      <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      <path className={`circle ${job.matchScore >= 75 ? 'high' : job.matchScore >= 50 ? 'mid' : 'low'}`} 
                        strokeDasharray={`${job.matchScore}, 100`} 
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      <text x="18" y="20.35" className="percentage">{job.matchScore}%</text>
                    </svg>
                  </div>
                </div>

                <div className="card-info">
                  <h3 className="job-title-premium">{job.title}</h3>
                  <p className="company-name-premium">{job.company}</p>
                </div>

                <div className="job-meta-premium">
                  <div className="meta-row">
                    <span><MapPin size={14} /> {job.location}</span>
                    <span><Briefcase size={14} /> {job.job_type}</span>
                  </div>
                  <div className="meta-row mt-2">
                    <span className="text-primary font-bold"><IndianRupee size={14} /> {job.salary_range || 'Competitive'}</span>
                    <span><Clock size={14} /> 2 days ago</span>
                  </div>
                </div>

                <div className="skills-preview">
                   {job.skills_required?.slice(0, 3).map(skill => {
                     const isMatched = userSkills.some(us => us.skill_name.toLowerCase() === skill.toLowerCase());
                     return (
                       <span key={skill} className={`skill-tag-preview ${isMatched ? 'matched' : ''}`}>
                         {isMatched && <CheckCircle2 size={10} />} {skill}
                       </span>
                     );
                   })}
                   {job.skills_required?.length > 3 && <span className="skill-tag-more">+{job.skills_required.length - 3}</span>}
                </div>

                <div className="card-actions-premium">
                   <button 
                    className={`save-btn ${savedJobIds.has(job.id) ? 'saved' : ''}`} 
                    onClick={(e) => toggleSave(job.id, e)}
                   >
                     <Heart size={18} fill={savedJobIds.has(job.id) ? "currentColor" : "none"} />
                   </button>
                   <button 
                    className="apply-btn-premium"
                    onClick={(e) => openApplyModal(job, e)}
                   >
                     <Zap size={16} /> Quick Apply
                   </button>
                </div>
              </motion.div>
            )) : (
              <div className="empty-state-premium">
                <div className="empty-icon-box">
                  <Search size={48} />
                </div>
                <h2>No matches found</h2>
                <p>Try adjusting your search terms or filters to find more opportunities.</p>
                <button 
                  className="btn-reset-filters"
                  onClick={() => setFilters({ job_type: [], experience_level: [], location: "", salary_range: 500000 })}
                >
                  Reset all filters
                </button>
              </div>
            )}
          </motion.div>
        </main>
      </div>

      <JobApplyModal 
        isOpen={isApplyModalOpen} 
        onClose={(success) => {
          setIsApplyModalOpen(false);
          if (success) fetchJobs(); // Refresh if applied
        }} 
        job={selectedJob}
        userSkills={userSkills}
      />
    </div>
  );
};

export default JobList;
