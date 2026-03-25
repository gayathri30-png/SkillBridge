import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Brain, TrendingUp, Users, Target, ArrowLeft,
  Activity, BarChart3, ChevronRight 
} from 'lucide-react';
import axios from 'axios';

const RecruiterMarketIntelligence = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    totalCandidates: 0,
    averageMatchScore: 0,
    topSkills: [],
    marketVelocity: 0,
    insights: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/ai/market-intelligence', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch market intelligence', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen text-purple-600 font-bold gap-3">
       <div className="animate-spin md"><Brain size={32} /></div>
       Fetching Market Data...
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <button 
            onClick={() => navigate('/ai')}
            className="text-slate-500 hover:text-purple-600 font-medium mb-4 flex items-center gap-2 transition-colors"
          >
            <ArrowLeft size={16} /> Back to AI Hub
          </button>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Brain className="text-purple-600" /> Market Intelligence
          </h1>
          <p className="text-slate-500 font-medium mt-1">Real-time talent supply & demand analytics.</p>
        </div>
      </header>

      {/* Top Metrics Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 flex items-center gap-6">
           <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Users size={32} />
           </div>
           <div>
              <p className="text-slate-500 font-bold text-sm uppercase tracking-wider mb-1">Active Talent Pool</p>
              <h3 className="text-3xl font-black text-slate-900">{data.totalCandidates}</h3>
           </div>
        </div>

        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 flex items-center gap-6">
           <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Target size={32} />
           </div>
           <div>
              <p className="text-slate-500 font-bold text-sm uppercase tracking-wider mb-1">Avg Platform Match</p>
              <h3 className="text-3xl font-black text-slate-900">{data.averageMatchScore}%</h3>
           </div>
        </div>

        {/* Market Velocity card removed as it was mock-based */}


      </section>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Trending Skills (Placeholder Chart) */}
        <div className="lg:col-span-2 bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm">
           <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-900">
                <TrendingUp className="text-blue-500" /> Platform Skill Demand
              </h2>
           </div>

           {/* Simple Bar Chart Implementation using Tailwind */}
           <div className="space-y-6">
              {data.topSkills.map((skill, index) => {
                 // Calculate percentage relative to highest for width
                 const maxDemand = data.topSkills[0]?.count || 1;
                 const percentage = Math.max(10, (skill.count / maxDemand) * 100);
                 
                 return (
                 <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm font-bold text-slate-700">
                       <span>{skill.name}</span>
                       <span className="text-slate-400 font-medium">{skill.count} Candidates</span>
                    </div>
                    <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${percentage}%` }}
                         transition={{ delay: index * 0.1, duration: 0.8, ease: "easeOut" }}
                         className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                       />
                    </div>
                 </div>
                 );
              })}
              
              {data.topSkills.length === 0 && (
                 <div className="py-10 text-center text-slate-400 italic">Insufficient data to plot demand.</div>
              )}
           </div>
        </div>

        {/* AI Insights Panel */}
        <div className="space-y-6">
           <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-900">
             <BarChart3 className="text-amber-500" /> Executive Summary
           </h2>
           
           <div className="space-y-4">
              {data.insights.map((insight, idx) => (
                 <div key={idx} className="bg-slate-50 p-6 rounded-3xl border border-slate-100 relative group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                       <Brain size={40} />
                    </div>
                    <p className="text-slate-700 leading-relaxed font-medium relative z-10" dangerouslySetInnerHTML={{ __html: insight.replace(/\*\*(.*?)\*\*/g, '<strong class="text-indigo-600">$1</strong>') }} />
                 </div>
              ))}
              
              {data.insights.length === 0 && (
                 <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-center text-slate-400 italic">
                    AI is analyzing global platform data...
                 </div>
              )}
           </div>
           
           <button 
             onClick={() => navigate('/post-job')}
             className="w-full mt-4 bg-slate-900 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors"
           >
             Apply Insights to New Post <ChevronRight size={20} />
           </button>
        </div>

      </div>
    </div>
  );
};

export default RecruiterMarketIntelligence;
