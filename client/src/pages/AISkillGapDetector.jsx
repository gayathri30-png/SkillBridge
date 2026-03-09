import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Target, ChevronLeft, CheckCircle, 
  AlertCircle, BookOpen, Clock, 
  TrendingUp, ArrowRight, Briefcase, MapPin, Zap
} from 'lucide-react';
import axios from 'axios';

const AISkillGapDetector = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [results, setResults] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/ai/skill-gap/jobs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJobs(res.data);

      // If jobs are available, auto-analyze the first one
      if (res.data.length > 0) {
        handleAnalyze(res.data[0]);
      }
    } catch (err) {
      console.error('Failed to fetch jobs for skill gap:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async (job) => {
    setAnalyzing(true);
    setSelectedJob(job);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`/api/ai/skill-gap/pathways?jobId=${job.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResults(res.data);
    } catch (err) {
      console.error(err);
      alert('Analysis failed. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading Skill Analytics...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <button 
        onClick={() => navigate('/ai')}
        className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-900 transition-colors"
      >
        <ChevronLeft size={20} /> Back to Hub
      </button>

      <div className="bg-white p-10 rounded-[40px] shadow-2xl border border-slate-100">
        <header className="mb-10">
          <div className="flex items-center gap-2 text-primary font-bold mb-3">
             <Target size={18} className="text-emerald-500" /> AI SKILL GAP DETECTOR
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Bridge the Gap to Your Dream Role</h1>
          <p className="text-slate-500">Select a real job posted by recruiters to see how your skills match up and get a personalized learning plan.</p>
        </header>

        {/* JOB SELECTION - Real recruiter-posted jobs */}
        {jobs.length > 0 ? (
          <div className="flex flex-wrap gap-3 mb-12">
            {jobs.map(job => (
              <button 
                key={job.id}
                onClick={() => handleAnalyze(job)}
                className={`px-5 py-3 rounded-2xl font-bold transition-all text-left ${
                  selectedJob?.id === job.id 
                    ? 'bg-slate-900 text-white shadow-lg' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Briefcase size={14} className={selectedJob?.id === job.id ? 'text-emerald-400' : 'text-slate-400'} />
                  <span>{job.title}</span>
                </div>
                <div className={`text-[10px] font-medium mt-1 flex items-center gap-1 ${
                  selectedJob?.id === job.id ? 'text-slate-400' : 'text-slate-400'
                }`}>
                  <MapPin size={10} /> {job.company_name} • {job.skills_required?.length || 0} skills
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="py-16 mb-12 bg-slate-50 rounded-[32px] border border-dashed border-slate-200 text-center">
            <Briefcase size={48} className="mx-auto text-slate-200 mb-4" />
            <h3 className="text-lg font-bold text-slate-600 mb-2">No Jobs Available Yet</h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              Recruiters haven't posted any jobs with skill requirements yet. Check back soon or browse available jobs.
            </p>
            <button 
              onClick={() => navigate('/jobs')}
              className="mt-6 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-colors"
            >
              Browse Jobs
            </button>
          </div>
        )}

        {analyzing ? (
            <div className="py-20 text-center">
                <div className="animate-bounce mb-4 text-emerald-500">
                    <Target size={48} className="mx-auto" />
                </div>
                <p className="text-slate-500 font-bold">Analyzing real job requirements...</p>
            </div>
        ) : results ? (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* MATCH SCORE */}
                <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-[32px] flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-full border-8 border-emerald-200 flex items-center justify-center text-2xl font-black text-emerald-600">
                            {results.match_percentage}%
                        </div>
                        <div>
                            <h3 className="text-emerald-800 font-black text-xl">{results.job_title} Match</h3>
                            <p className="text-emerald-600 font-medium">You have {results.matched_skills.length} out of {results.matched_skills.length + results.missing_skills.length} required skills</p>
                            {selectedJob?.company_name && (
                              <p className="text-emerald-500 text-sm mt-1 flex items-center gap-1">
                                <Briefcase size={12} /> Posted by {selectedJob.company_name}
                              </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* SKILLS BREAKDOWN */}
                    <div className="space-y-8">
                        <div>
                            <h4 className="text-sm font-black text-emerald-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <CheckCircle size={16} /> Skills You Have ({results.matched_skills.length})
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {results.matched_skills.map((s, i) => (
                                    <span key={i} className="bg-white border border-emerald-100 text-emerald-700 px-4 py-2 rounded-xl text-sm font-bold shadow-sm">
                                        {s}
                                    </span>
                                ))}
                                {results.matched_skills.length === 0 && (
                                  <p className="text-slate-400 text-sm italic">None of your current skills match this role.</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-black text-rose-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <AlertCircle size={16} /> Missing Skills ({results.missing_skills.length})
                            </h4>
                            <div className="space-y-4">
                                {results.missing_skills.map((s, i) => (
                                    <div key={i} className="bg-rose-50/30 border border-rose-100 p-4 rounded-2xl flex justify-between items-center">
                                        <div>
                                            <span className="font-bold text-slate-900">{s}</span>
                                            <p className="text-[10px] text-rose-500 font-black uppercase mt-0.5">High Priority</p>
                                        </div>
                                    </div>
                                ))}
                                {results.missing_skills.length === 0 && (
                                  <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl text-center">
                                    <p className="text-emerald-700 font-bold">🎉 You're a perfect match! No missing skills.</p>
                                  </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* PATHWAYS */}
                    <div className="space-y-6">
                        <h4 className="text-xl font-black text-slate-900 flex items-center gap-2">
                            <TrendingUp className="text-emerald-500" /> Quickest Path to 90%
                        </h4>
                        <div className="space-y-4">
                            {results.pathways?.map((pw, i) => (
                                <div key={i} className="bg-white border border-slate-100 p-6 rounded-[32px] shadow-sm space-y-4 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-bold text-slate-900">{pw.skill}</span>
                                        <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${pw.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-700' : pw.difficulty === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>
                                            {pw.difficulty}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                                        <span className="flex items-center gap-1"><Clock size={14} /> {pw.estimated_time}</span>
                                        <span className="flex items-center gap-1 text-emerald-600"><TrendingUp size={14} /> +{pw.impact}% match impact</span>
                                    </div>
                                </div>
                            ))}
                            {(!results.pathways || results.pathways.length === 0) && results.missing_skills.length === 0 && (
                              <div className="py-10 text-center bg-slate-50 rounded-[32px]">
                                <p className="text-slate-400 font-medium">No upskilling needed — you already match all requirements!</p>
                              </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        ) : jobs.length > 0 ? (
            <div className="text-center py-20">
                <p className="text-slate-400 font-medium">Select a job above to start your AI gap analysis.</p>
            </div>
        ) : null}
      </div>
    </div>
  );
};

export default AISkillGapDetector;
