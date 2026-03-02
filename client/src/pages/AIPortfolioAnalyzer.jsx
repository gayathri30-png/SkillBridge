import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sparkles, Briefcase, ChevronLeft, RefreshCw, 
  CheckCircle, AlertCircle, Bookmark, Share2, Download
} from 'lucide-react';
import axios from 'axios';

const AIPortfolioAnalyzer = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    fetchLatest();
  }, []);

  const fetchLatest = async () => {
    try {
      const res = await axios.get('/api/ai/summary');
      if (res.data.portfolio && res.data.portfolio.id) {
        setAnalysis({
            ...res.data.portfolio,
            project_scores: typeof res.data.portfolio.project_scores === 'string' ? JSON.parse(res.data.portfolio.project_scores) : res.data.portfolio.project_scores,
            suggestions: typeof res.data.portfolio.suggestions === 'string' ? JSON.parse(res.data.portfolio.suggestions) : res.data.portfolio.suggestions
        });
      }
    } catch (err) {
      console.error('Failed to fetch latest analysis');
    } finally {
      setLoading(false);
    }
  };

  const handleRunAnalysis = async () => {
    setScanning(true);
    try {
      const res = await axios.post('/api/ai/portfolio/analyze');
      setAnalysis(res.data);
    } catch (err) {
      alert('Analysis failed. Make sure you have projects in your profile.');
    } finally {
      setScanning(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading Portfolio Data...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <button 
        onClick={() => navigate('/ai')}
        className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-900 transition-colors"
      >
        <ChevronLeft size={20} /> Back to Hub
      </button>

      <div className="bg-white p-10 rounded-[40px] shadow-2xl border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5">
            <Sparkles size={120} />
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-primary font-bold mb-3">
                <Sparkles size={18} className="text-amber-500" /> AI PORTFOLIO ANALYZER
            </div>
            <h1 className="text-3xl font-black text-slate-900 mb-2">Optimize Your Project Showcase</h1>
            <p className="text-slate-500 max-w-xl">
                Our AI scans your project descriptions, tech stack, and content depth to help you stand out to top recruiters.
            </p>
          </div>
          <div className="flex gap-4">
             <button 
               onClick={handleRunAnalysis}
               disabled={scanning}
               className="btn btn-primary px-8 py-4 rounded-2xl flex items-center gap-2 font-bold shadow-lg shadow-primary/20"
             >
               {scanning ? <RefreshCw className="animate-spin" size={18} /> : <Sparkles size={18} />}
               {scanning ? 'Analyzing...' : 'Analyze My Portfolio'}
             </button>
             <button onClick={fetchLatest} className="p-4 rounded-2xl border border-slate-200 hover:bg-slate-50 transition-colors">
                <RefreshCw size={20} className="text-slate-500" />
             </button>
          </div>
        </div>

        {analysis ? (
          <div className="mt-12 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* OVERALL SCORE */}
            <div className="bg-slate-900 text-white p-8 rounded-[32px] flex items-center justify-between">
                <div>
                    <h3 className="text-slate-400 font-bold text-sm uppercase tracking-widest mb-1">Overall Portfolio Score</h3>
                    <div className="text-5xl font-black text-primary flex items-baseline gap-2">
                        {analysis.overall_score}<span className="text-xl text-slate-500">/100</span>
                    </div>
                </div>
                <div className="w-64 h-3 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${analysis.overall_score}%` }}
                        className="h-full bg-primary shadow-[0_0_20px_rgba(37,99,235,0.5)]" 
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* PROJECT BREAKDOWN */}
                <div className="space-y-6">
                    <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                        <Briefcase className="text-slate-400" /> Project Breakdown
                    </h3>
                    <div className="space-y-4">
                        {analysis.project_scores?.map((p, i) => (
                            <div key={i} className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex justify-between items-center group">
                                <div className="space-y-1">
                                    <h4 className="font-bold text-slate-900 group-hover:text-primary transition-colors">{p.title}</h4>
                                    <div className="flex gap-2">
                                        {p.feedback.map((f, j) => (
                                            <span key={j} className="text-[10px] font-bold uppercase tracking-tight py-1 px-2 rounded-lg bg-white border border-slate-200">
                                                {f}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className={`text-xl font-black ${p.score > 80 ? 'text-emerald-500' : p.score > 50 ? 'text-amber-500' : 'text-rose-500'}`}>
                                    {p.score}%
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* AI SUGGESTIONS */}
                <div className="space-y-6">
                    <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                        <Sparkles className="text-amber-500" /> AI Suggestions
                    </h3>
                    <div className="bg-amber-50/50 border border-amber-100 p-8 rounded-[32px] space-y-4">
                        <p className="text-amber-800 font-medium">Based on your portfolio, here's how to improve:</p>
                        <ul className="space-y-3">
                            {analysis.suggestions?.map((s, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                                    <div className="mt-1.5 w-1.5 h-1.5 bg-amber-500 rounded-full shrink-0" />
                                    {s}
                                </li>
                            ))}
                        </ul>
                        <div className="pt-6 flex gap-3">
                            <button className="text-xs font-bold text-slate-900 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm">View Detailed Report</button>
                            <button className="text-xs font-bold text-slate-900 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm">Export Analysis</button>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        ) : (
          <div className="mt-12 text-center py-20 bg-slate-50 rounded-[40px] border border-dashed border-slate-200">
             <Briefcase size={64} className="mx-auto text-slate-200 mb-6" />
             <h3 className="text-2xl font-bold text-slate-900 mb-2">No Analysis Yet</h3>
             <p className="text-slate-500 mx-auto max-w-sm mb-8">Run your first AI portfolio scan to get deep insights and improvement tips.</p>
             <button onClick={handleRunAnalysis} className="btn btn-primary px-10">Analyze Now</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIPortfolioAnalyzer;
