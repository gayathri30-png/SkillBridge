import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./JobList.css";

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    job_type: [],
    experience_level: [],
    location: "",
  });

  const navigate = useNavigate();

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/jobs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(response.data);
    } catch (err) {
      setError("Failed to load jobs");
      console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleCheckboxChange = (category, value) => {
    setFilters((prev) => {
      const current = prev[category];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [category]: updated };
    });
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filters.job_type.length === 0 || filters.job_type.includes(job.job_type);
    const matchesExperience = filters.experience_level.length === 0 || filters.experience_level.includes(job.experience_level);
    const matchesLocation = !filters.location || job.location?.toLowerCase().includes(filters.location.toLowerCase());

    return matchesSearch && matchesType && matchesExperience && matchesLocation;
  });

  if (loading) return <div className="p-8 text-slate-500">Scanning for opportunities...</div>;

  return (
    <div className="job-explorer fade-in">
      <div className="job-explorer-header card mb-6 p-6 glass">
         <div className="flex-between flex-wrap gap-4">
            <div>
               <h2 className="mb-1">Explore Opportunities</h2>
               <p className="text-sm text-slate-500">Find the perfect match for your career goals.</p>
            </div>
            <div className="flex gap-4 items-center flex-1 max-w-md">
               <div className="search-input-wrapper flex-1">
                  <input 
                    type="text" 
                    placeholder="Search by title or keyword..." 
                    className="input-field" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
               </div>
            </div>
         </div>
      </div>

      <div className="job-explorer-content">
        {/* Filters Sidebar */}
        <aside className="filters-sidebar">
           <div className="card p-6 sticky top-24">
              <div className="flex-between mb-6">
                <h4 className="m-0">Filters</h4>
                <button 
                  className="text-xs text-primary font-bold bg-transparent border-0 cursor-pointer"
                  onClick={() => setFilters({ job_type: [], experience_level: [], location: "" })}
                >
                  Clear All
                </button>
              </div>

              <div className="filter-group mb-6">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 block">Location</label>
                <input 
                  type="text" 
                  placeholder="City or Remote..." 
                  className="input-field text-sm"
                  value={filters.location}
                  onChange={(e) => setFilters({...filters, location: e.target.value})}
                />
              </div>

              <div className="filter-group mb-6">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 block">Job Type</label>
                {['Full-time', 'Part-time', 'Internship', 'Contract'].map(type => (
                  <div key={type} className="flex items-center gap-2 mb-2">
                    <input 
                      type="checkbox" 
                      id={type} 
                      className="w-4 h-4 cursor-pointer"
                      checked={filters.job_type.includes(type)}
                      onChange={() => handleCheckboxChange('job_type', type)}
                    />
                    <label htmlFor={type} className="text-sm text-slate-600 cursor-pointer">{type}</label>
                  </div>
                ))}
              </div>

              <div className="filter-group">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 block">Experience</label>
                {['Entry', 'Intermediate', 'Senior'].map(exp => (
                  <div key={exp} className="flex items-center gap-2 mb-2">
                    <input 
                      type="checkbox" 
                      id={exp}
                      className="w-4 h-4 cursor-pointer"
                      checked={filters.experience_level.includes(exp)}
                      onChange={() => handleCheckboxChange('experience_level', exp)}
                    />
                    <label htmlFor={exp} className="text-sm text-slate-600 cursor-pointer">{exp}</label>
                  </div>
                ))}
              </div>
           </div>
        </aside>

        {/* Job Results Container */}
        <main className="job-results-container">
           <div className="results-info flex-between mb-4 px-2">
              <span className="text-sm text-slate-500">Showing <strong>{filteredJobs.length}</strong> jobs</span>
              <select className="bg-transparent border-0 text-xs font-bold text-slate-600 cursor-pointer outline-none">
                 <option>Newest First</option>
                 <option>Match Score</option>
                 <option>Budget: High to Low</option>
              </select>
           </div>

           <div className="space-y-4">
              {filteredJobs.length > 0 ? filteredJobs.map(job => {
                const randomMatch = Math.floor(Math.random() * 30) + 70; // Mock match score
                return (
                  <div key={job.id} className="card card-hover p-6 flex gap-6 job-card relative" onClick={() => navigate(`/jobs/${job.id}`)}>
                    <div className="job-logo bg-slate-100 w-16 h-16 rounded-xl flex items-center justify-center text-2xl shadow-inner">
                       {job.title.charAt(0)}
                    </div>
                    <div className="flex-1">
                       <div className="flex-between mb-1">
                          <h4 className="m-0 hover:text-primary transition-colors cursor-pointer">{job.title}</h4>
                          <span className="text-xs font-bold text-primary bg-primary-soft px-3 py-1 rounded-full">
                            {job.budget >= 1000 ? `$${(job.budget/1000).toFixed(1)}k` : `$${job.budget}`}
                          </span>
                       </div>
                       <p className="text-sm text-slate-600 mb-3">{job.company_name || "SkillBridge Partner"}</p>
                       
                       <div className="flex gap-4 text-xs text-slate-500 mb-4">
                          <span className="flex items-center gap-1">📍 {job.location || "Remote"}</span>
                          <span className="flex items-center gap-1">⏱️ {job.job_type}</span>
                          <span className="flex items-center gap-1">📊 {job.experience_level}</span>
                       </div>

                       <div className="flex gap-2">
                          <span className="chip chip-outline text-[10px] py-0.5">React</span>
                          <span className="chip chip-outline text-[10px] py-0.5">Node.js</span>
                          <span className="chip chip-outline text-[10px] py-0.5">UI/UX</span>
                       </div>
                    </div>
                    
                    <div className="match-panel flex flex-col items-center justify-center border-left pl-6 min-w-[100px]">
                        <div className="match-ring w-12 h-12 mb-2">
                           <svg viewBox="0 0 36 36" className="w-full h-full">
                              <circle className="bg" cx="18" cy="18" r="16" />
                              <circle 
                                className="progress" 
                                cx="18" cy="18" r="16" 
                                strokeDasharray={`${randomMatch}, 100`}
                                stroke={randomMatch > 85 ? 'var(--success)' : 'var(--warning)'}
                              />
                           </svg>
                           <span className="absolute text-[10px] font-bold text-slate-900">{randomMatch}%</span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Match</span>
                    </div>
                  </div>
                );
              }) : (
                <div className="card p-12 text-center text-slate-400">
                   <div className="text-5xl mb-4">🏜️</div>
                   <h4>No jobs found Matching your criteria.</h4>
                   <p className="text-sm">Try broadening your filters or search terms.</p>
                </div>
              )}
           </div>
        </main>
      </div>
    </div>
  );
};

export default JobList;
