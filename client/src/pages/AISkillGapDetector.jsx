import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Target, ChevronLeft, Search, CheckCircle, 
  XOutline, AlertCircle, BookOpen, Clock, 
  TrendingUp, ArrowRight
} from 'lucide-react';
import axios from 'axios';

const AISkillGapDetector = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedRole, setSelectedRole] = useState('Frontend Developer');
  const [jobs, setJobs] = useState([]);
  const [results, setResults] = useState(null);

  const roles = ['Frontend Developer', 'Full Stack Developer', 'Backend Developer', 'UI/UX Designer', 'Product Manager'];

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/ai/summary', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.skillGaps && res.data.skillGaps.length > 0) {
        const latest = res.data.skillGaps[0];
        // Automatically generate fresh pathways for the last known target role
        handleAnalyze(latest.job_title);
      }
    } catch (err) {
      console.error('Failed to fetch skill gap history');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async (role) => {
    setAnalyzing(true);
    setSelectedRole(role);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`/api/ai/skill-gap/pathways?jobTitle=${role}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResults(res.data);
    } catch (err) {
      console.error(err);
      alert('Analysis failed');
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
          <p className="text-slate-500">Select a target role to see how your current skills match up and get a personalized learning plan.</p>
        </header>

        {/* ROLE SELECTION */}
        <div className="flex flex-wrap gap-3 mb-12">
            {roles.map(role => (
                <button 
                    key={role}
                    onClick={() => handleAnalyze(role)}
                    className={`px-6 py-3 rounded-2xl font-bold transition-all ${selectedRole === role ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                    {role}
                </button>
            ))}
        </div>

        {analyzing ? (
            <div className="py-20 text-center">
                <div className="animate-bounce mb-4 text-emerald-500">
                    <Target size={48} className="mx-auto" />
                </div>
                <p className="text-slate-500 font-bold">Scanning market requirements...</p>
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
                                        <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${pw.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                            {pw.difficulty}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                                        <span className="flex items-center gap-1"><Clock size={14} /> {pw.estimated_time}</span>
                                        <span className="flex items-center gap-1 text-emerald-600"><TrendingUp size={14} /> +{pw.impact}% match impact</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        ) : (
            <div className="text-center py-20">
                <p className="text-slate-400 font-medium">Select a role above to start your AI gap analysis.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default AISkillGapDetector;
