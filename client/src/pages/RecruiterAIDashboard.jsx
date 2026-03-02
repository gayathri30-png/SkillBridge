import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sparkles, Users, FileText, Target, 
  ChevronRight, ArrowRight, Zap, Clock,
  AlertCircle, CheckCircle, TrendingUp,
  Brain
} from 'lucide-react';
import axios from 'axios';

const RecruiterAIDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  // High-level aggregate data for Recruiter AI Workspace
  const [data, setData] = useState({
    smartMatches: 0,
    generatedPosts: 0,
    competitiveness: 0,
    recentActivity: [],
    recommendations: []
  });

  useEffect(() => {
    // In a real scenario, this would fetch from /api/ai/recruiter/summary
    // Using aggregate data from existing /api/jobs/dashboard to power the AI workspace for now
    const fetchSummary = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get('/api/jobs/dashboard', {
           headers: { Authorization: `Bearer ${token}` }
        });
        
        // Transform the aggregate job dashboard data into the AI workspace format
        setData({
          smartMatches: res.data.stats?.highMatch || 0,
          generatedPosts: res.data.stats?.activeJobs || 0, // Using active jobs as a proxy for now
          competitiveness: 88, // Mock metric
          recentActivity: [
             { action: 'Candidate Matching Analysis', target: 'Frontend Developer', match: 92, date: new Date() },
             { action: 'Job Post Optimization', target: 'Senior AI Engineer', match: null, date: new Date(Date.now() - 86400000) }
          ],
          recommendations: [
             { type: 'Optimization', text: 'Consider lowering the experience requirement on your Frontend Developer role to increase the talent pool by 40%.', priority: 'medium' },
             { type: 'Talent Match', text: `You have ${res.data.stats?.highMatch || 0} candidates waiting for review with a >90% AI technical match.`, priority: 'high' }
          ]
        });
      } catch (err) {
        console.error('Failed to fetch Recruiter AI summary', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading) return <div className="p-10 text-center text-slate-500 font-bold">Synchronizing Intelligence...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Sparkles className="text-[#0057D9]" /> RECRUITER AI HUB
          </h1>
          <p className="text-slate-500 font-medium">Your intelligent command center for hiring at scale.</p>
        </div>
        <div className="flex gap-4">
           <button 
             onClick={() => navigate('/my-jobs')}
             className="px-6 py-2 rounded-xl bg-white border border-slate-200 shadow-sm text-slate-700 font-bold hover:border-blue-500 transition-colors"
           >
              Review Pipeline
           </button>
           <button 
              onClick={() => navigate('/post-job')}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all hover:-translate-y-0.5"
           >
              + Create Smart Job
           </button>
        </div>
      </header>

      {/* TOOLS GRID */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Talent Match Matrix Card */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white p-6 rounded-[32px] shadow-xl border border-slate-100 relative overflow-hidden group cursor-pointer"
          onClick={() => navigate('/my-jobs')}
        >
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
            <Users size={80} />
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl w-fit mb-6">
            <Users size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Talent Match Matrix</h3>
          <div className="space-y-1 mb-8">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 font-medium">High-Match Profiles</span>
              <span className="text-emerald-600 font-black">{data.smartMatches}</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
               <div className="h-full bg-emerald-500 w-3/4 rounded-full"/>
            </div>
            <p className="text-xs text-slate-400">Scoring based on combined technical heuristics.</p>
          </div>
          <button className="flex items-center gap-2 text-sm font-bold text-emerald-600 group-hover:gap-3 transition-all">
            Review Top Talent <ArrowRight size={16} />
          </button>
        </motion.div>

        {/* Job Post Generator Card */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white p-6 rounded-[32px] shadow-xl border border-slate-100 relative overflow-hidden group cursor-pointer"
          onClick={() => navigate('/post-job')}
        >
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
            <FileText size={80} />
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl w-fit mb-6">
            <FileText size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Smart Job Copilot</h3>
          <div className="space-y-1 mb-8">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 font-medium">Active Optimized Posts</span>
              <span className="text-blue-600 font-black">{data.generatedPosts}</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">Generate high-converting, bias-free job descriptions.</p>
          </div>
          <button className="flex items-center gap-2 text-sm font-bold text-blue-600 group-hover:gap-3 transition-all">
            Draft New Listing <ArrowRight size={16} />
          </button>
        </motion.div>

        {/* Market Intelligence Card */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white p-6 rounded-[32px] shadow-xl border border-slate-100 relative overflow-hidden group cursor-pointer"
          onClick={() => { alert("Market Analytics Dashboard module coming soon!"); }}
        >
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
            <Brain size={80} />
          </div>
          <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl w-fit mb-6">
            <Brain size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Market Intelligence</h3>
          <div className="space-y-1 mb-8">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 font-medium">Role Competitiveness</span>
              <span className="text-purple-600 font-black">{data.competitiveness}/100</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${data.competitiveness}%` }}
                className="h-full bg-purple-600"
              />
            </div>
            <p className="text-xs text-slate-400">Demand velocity vs. available talent pool.</p>
          </div>
          <button className="flex items-center gap-2 text-sm font-bold text-purple-600 group-hover:gap-3 transition-all">
            Unlock Analytics <ArrowRight size={16} />
          </button>
        </motion.div>

      </section>

      {/* RECOMMENDATIONS & HISTORY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recruiter Recommendations */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Zap className="text-amber-500" size={24} /> Hiring Advisor
          </h2>
          <div className="space-y-4">
            {data.recommendations.length > 0 ? data.recommendations.map((rec, idx) => (
              <div key={idx} className="bg-[#0f172a] text-white p-6 rounded-[32px] flex items-center justify-between gap-6 shadow-xl shadow-slate-900/10">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-xl ${rec.priority === 'high' ? 'bg-rose-500' : 'bg-blue-500'}`}>
                    <AlertCircle size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-widest text-slate-400">{rec.type} Alert</h4>
                    <p className="text-slate-200 mt-1 font-medium">{rec.text}</p>
                  </div>
                </div>
                <button 
                  onClick={() => navigate(rec.type === 'Talent Match' ? '/my-jobs' : '/post-job')}
                  className="bg-white/10 hover:bg-white/20 p-3 rounded-2xl transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )) : (
              <div className="bg-slate-50 border border-dashed border-slate-200 rounded-[32px] p-12 text-center text-slate-400">
                Your pipeline is operating efficiently. No optimization alerts.
              </div>
            )}
          </div>
        </div>

        {/* AI Activity Log */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Clock className="text-slate-400" size={24} /> AI Processing Log
          </h2>
          <div className="bg-white rounded-[32px] border border-slate-100 p-6 space-y-6 shadow-sm">
            {data.recentActivity.map((activity, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-10 h-10 bg-slate-50 text-slate-600 rounded-full flex items-center justify-center shrink-0 border border-slate-200">
                  {activity.match ? <Users size={18} /> : <FileText size={18} />}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{activity.action}</h4>
                  <p className="text-xs text-slate-500">{activity.target} {activity.match ? `• ${activity.match}% Match Found` : ''}</p>
                  <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold">{new Date(activity.date).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
            {data.recentActivity.length === 0 && <p className="text-slate-400 text-sm italic">Engine standing by...</p>}
          </div>
        </div>

      </div>
    </div>
  );
};

export default RecruiterAIDashboard;
