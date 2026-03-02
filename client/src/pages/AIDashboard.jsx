import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sparkles, Briefcase, Target, PenTool, 
  ChevronRight, ArrowRight, Zap, Clock,
  AlertCircle, CheckCircle, TrendingUp
} from 'lucide-react';
import axios from 'axios';

const AIDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    portfolio: { overall_score: 0, project_count: 0 },
    skillGaps: [],
    proposals: [],
    recommendations: []
  });

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get('/api/ai/summary');
        setData(res.data);
      } catch (err) {
        console.error('Failed to fetch AI summary');
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading) return <div className="p-10 text-center">Loading AI Intelligence...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Sparkles className="text-amber-500" /> AI HUB
          </h1>
          <p className="text-slate-500 font-medium">Your central control center for AI-powered career growth.</p>
        </div>
      </header>

      {/* TOOLS GRID */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Portfolio Card */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white p-6 rounded-[32px] shadow-xl border border-slate-100 relative overflow-hidden group cursor-pointer"
          onClick={() => navigate('/ai/portfolio')}
        >
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
            <Briefcase size={80} />
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl w-fit mb-6">
            <Briefcase size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Portfolio Analyzer</h3>
          <div className="space-y-1 mb-8">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 font-medium">Health Score</span>
              <span className="text-blue-600 font-black">{data.portfolio.overall_score}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${data.portfolio.overall_score}%` }}
                className="h-full bg-blue-600"
              />
            </div>
            <p className="text-xs text-slate-400">{data.portfolio.project_count} Projects Scanned</p>
          </div>
          <button className="flex items-center gap-2 text-sm font-bold text-blue-600 group-hover:gap-3 transition-all">
            Open Analyzer <ArrowRight size={16} />
          </button>
        </motion.div>

        {/* Skill Gap Card */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white p-6 rounded-[32px] shadow-xl border border-slate-100 relative overflow-hidden group cursor-pointer"
          onClick={() => navigate('/ai/skill-gap')}
        >
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
            <Target size={80} />
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl w-fit mb-6">
            <Target size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Skill Gap Detector</h3>
          <div className="space-y-1 mb-8">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 font-medium">Top Match</span>
              <span className="text-emerald-600 font-black">{data.skillGaps[0]?.match_percentage || 0}%</span>
            </div>
            <p className="text-xs text-slate-400">{data.skillGaps.length > 0 ? `${data.skillGaps[0].job_title}` : 'No jobs checked yet'}</p>
          </div>
          <button className="flex items-center gap-2 text-sm font-bold text-emerald-600 group-hover:gap-3 transition-all">
            View Skill Gaps <ArrowRight size={16} />
          </button>
        </motion.div>

        {/* Proposal Card */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white p-6 rounded-[32px] shadow-xl border border-slate-100 relative overflow-hidden group cursor-pointer"
          onClick={() => navigate('/ai/proposals')}
        >
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
            <PenTool size={80} />
          </div>
          <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl w-fit mb-6">
            <PenTool size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Proposal Generator</h3>
          <div className="space-y-1 mb-8">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 font-medium">Saved Proposals</span>
              <span className="text-purple-600 font-black">{data.proposals.length}</span>
            </div>
            <p className="text-xs text-slate-400">Last generated: {data.proposals[0] ? new Date(data.proposals[0].created_at).toLocaleDateString() : 'N/A'}</p>
          </div>
          <button className="flex items-center gap-2 text-sm font-bold text-purple-600 group-hover:gap-3 transition-all">
            Create Proposal <ArrowRight size={16} />
          </button>
        </motion.div>
      </section>

      {/* RECOMMENDATIONS & HISTORY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recommendations */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Zap className="text-amber-500" size={24} /> Recommended Actions
          </h2>
          <div className="space-y-4">
            {data.recommendations.length > 0 ? data.recommendations.map((rec, idx) => (
              <div key={idx} className="bg-slate-900 text-white p-6 rounded-[32px] flex items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-xl ${rec.priority === 'high' ? 'bg-rose-500' : 'bg-amber-500'}`}>
                    <AlertCircle size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-widest opacity-50">{rec.recommendation_type} Advice</h4>
                    <p className="text-slate-200 font-medium">{rec.recommendation_text}</p>
                  </div>
                </div>
                <button 
                  onClick={() => navigate(rec.recommendation_type === 'portfolio' ? '/ai/portfolio' : '/ai/skill-gap')}
                  className="bg-white/10 hover:bg-white/20 p-3 rounded-2xl transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )) : (
              <div className="bg-slate-50 border border-dashed border-slate-200 rounded-[32px] p-12 text-center text-slate-400">
                You're all caught up! No high-priority AI actions.
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Clock className="text-slate-400" size={24} /> Recent Activity
          </h2>
          <div className="bg-white rounded-[32px] border border-slate-100 p-6 space-y-6 shadow-sm">
            {data.skillGaps.slice(0, 3).map((gap, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
                  <Target size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Skill gap checked</h4>
                  <p className="text-xs text-slate-500">{gap.job_title} • {gap.match_percentage}% match</p>
                  <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold">{new Date(gap.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
            {data.skillGaps.length === 0 && <p className="text-slate-400 text-sm italic">No recent activity detected.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIDashboard;
