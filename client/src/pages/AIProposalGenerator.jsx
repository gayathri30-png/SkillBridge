import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  PenTool, ChevronLeft, Sparkles, Settings2, 
  Copy, Save, Edit3, Send, RefreshCcw, 
  CheckCircle, Clock, Trash2
} from 'lucide-react';
import axios from 'axios';

const AIProposalGenerator = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [proposals, setProposals] = useState([]);
  const [currentProposal, setCurrentProposal] = useState("");
  const [currentProposalId, setCurrentProposalId] = useState(null);
  const [settings, setSettings] = useState({
    tone: 'Professional',
    length: 'Medium',
    includeProjects: true
  });

  const [availableJobs, setAvailableJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState("");

  useEffect(() => {
    fetchSaved();
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      // Fetch actual jobs from the platform to choose what to apply for
      const res = await axios.get('/api/jobs');
      if (res.data && res.data.length > 0) {
        setAvailableJobs(res.data);
        setSelectedJobId(res.data[0].id.toString());
      }
    } catch (err) {
      console.error('Failed to fetch jobs for dropdown');
    }
  };

  const fetchSaved = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/ai/proposals', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProposals(res.data);
    } catch (err) {
      console.error('Failed to fetch saved proposals');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedJobId) {
        alert("Please select a job to apply for first.");
        return;
    }
    setGenerating(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`/api/ai/proposal/advanced/${selectedJobId}`, settings, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCurrentProposal(res.data.proposal);
      setCurrentProposalId(res.data.id);
      fetchSaved(); // Refresh library
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.response?.data?.message || 'Generation failed';
      alert(errorMsg);
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentProposal);
    alert('Copied to clipboard!');
  };

  const handleSave = async () => {
    if (!currentProposalId) return;
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/ai/proposals/${currentProposalId}`, { proposal_text: currentProposal }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Proposal edits saved!');
      fetchSaved();
    } catch (err) {
      alert('Failed to save changes');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this proposal?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/ai/proposals/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (currentProposalId === id) {
          setCurrentProposal("");
          setCurrentProposalId(null);
      }
      fetchSaved();
    } catch (err) {
      alert('Failed to delete proposal');
    }
  };

  const handleDiscard = () => {
     setCurrentProposal("");
     setCurrentProposalId(null);
  };

  if (loading) return <div className="p-10 text-center">Opening Writing Studio...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <button 
        onClick={() => navigate('/ai')}
        className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-900 transition-colors"
      >
        <ChevronLeft size={20} /> Back to Hub
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* SETTINGS & EDITOR */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-[40px] shadow-2xl border border-slate-100">
            <header className="mb-8 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 text-primary font-bold mb-3">
                   <PenTool size={18} className="text-purple-500" /> AI PROPOSAL GENERATOR
                </div>
                <h1 className="text-3xl font-black text-slate-900 mb-2">Write Winning Applications</h1>
                <p className="text-slate-500">Tailor your pitch using AI that understands your portfolio highlights.</p>
              </div>
              <button 
                  onClick={handleDiscard} 
                  className="p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors"
                  title="Clear Writing Studio"
              >
                 <RefreshCcw size={20} className="text-slate-400" />
              </button>
            </header>

            {/* SETTINGS BAR */}
            <div className="bg-slate-50 p-6 rounded-[32px] grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="md:col-span-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2">Target Job</label>
                    <select 
                        value={selectedJobId}
                        onChange={(e) => setSelectedJobId(e.target.value)}
                        className="w-full bg-white border-none rounded-xl p-3 text-sm font-bold shadow-sm"
                    >
                        {availableJobs.map(job => (
                            <option key={job.id} value={job.id}>
                                {job.title} at {job.company_name || 'SkillBridge Partner'}
                            </option>
                        ))}
                        {availableJobs.length === 0 && <option value="">No jobs available</option>}
                    </select>
                </div>
                <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2">Tone</label>
                    <select 
                        value={settings.tone}
                        onChange={(e) => setSettings({...settings, tone: e.target.value})}
                        className="w-full bg-white border-none rounded-xl p-3 text-sm font-bold shadow-sm"
                    >
                        <option>Professional</option>
                        <option>Friendly</option>
                        <option>Confident</option>
                    </select>
                </div>
                <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2">Length</label>
                    <select 
                        value={settings.length}
                        onChange={(e) => setSettings({...settings, length: e.target.value})}
                        className="w-full bg-white border-none rounded-xl p-3 text-sm font-bold shadow-sm"
                    >
                        <option>Short</option>
                        <option>Medium</option>
                        <option>Long</option>
                    </select>
                </div>
                <div className="flex items-end">
                    <button 
                        onClick={handleGenerate}
                        disabled={generating || !selectedJobId}
                        className="w-full btn btn-primary py-3 rounded-xl flex items-center justify-center gap-2 font-bold"
                    >
                        {generating ? <RefreshCcw size={16} className="animate-spin" /> : <Sparkles size={16} />}
                        {generating ? 'Drafting...' : 'Generate AI'}
                    </button>
                </div>
            </div>

            {/* EDITOR AREA */}
            <div className="relative group">
                <textarea 
                    value={currentProposal}
                    onChange={(e) => setCurrentProposal(e.target.value)}
                    placeholder="Generated proposal will appear here..."
                    className="w-full h-96 p-8 bg-slate-900 text-slate-300 rounded-[32px] border-none focus:ring-4 focus:ring-primary/20 transition-all font-mono text-sm leading-relaxed"
                />
                {currentProposal && (
                    <div className="absolute top-4 right-4 flex gap-2">
                        <button onClick={handleCopy} className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all" title="Copy to clipboard"><Copy size={18} /></button>
                        {currentProposalId && (
                            <button onClick={handleSave} className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all" title="Save changes"><Save size={18} /></button>
                        )}
                    </div>
                )}
            </div>

            {currentProposal && (
                <div className="mt-6 flex flex-wrap gap-4">
                    <button 
                        onClick={() => navigate(`/jobs/${selectedJobId}`)}
                        className="flex-1 btn btn-primary py-4 rounded-2xl flex items-center justify-center gap-2 font-bold"
                    >
                        <Send size={18} /> Apply with this Proposal
                    </button>
                    <button onClick={handleDiscard} className="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-colors">
                        Discard
                    </button>
                </div>
            )}
          </div>
        </div>

        {/* SAVED LIBRARY */}
        <div className="space-y-6">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                <Settings2 className="text-slate-400" size={24} /> Saved Proposals
            </h2>
            <div className="space-y-4 overflow-y-auto max-h-[800px] pr-2">
                {proposals.length > 0 ? proposals.map((prop, i) => (
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={prop.id} 
                        className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-all group"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h4 className="font-bold text-slate-900 group-hover:text-primary transition-colors">{prop.job_title}</h4>
                                <p className="text-xs text-slate-500">{prop.company}</p>
                            </div>
                            <span className="text-[10px] font-black uppercase text-slate-300 bg-slate-50 px-2 py-1 rounded-lg">
                                {prop.tone}
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-3 mb-4 italic">
                            "{prop.proposal_text}"
                        </p>
                        <div className="flex gap-4 border-t border-slate-50 pt-4">
                            <button 
                                onClick={() => {
                                    setCurrentProposal(prop.proposal_text);
                                    setCurrentProposalId(prop.id);
                                    if (prop.job_id) setSelectedJobId(prop.job_id.toString());
                                }}
                                className="flex-1 flex items-center justify-center gap-2 text-[10px] font-black text-primary uppercase hover:bg-slate-50 py-2 rounded-xl transition-colors"
                            >
                                <Edit3 size={14} /> Re-Edit
                            </button>
                            <button 
                                onClick={() => handleDelete(prop.id)}
                                className="p-2 text-rose-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </motion.div>
                )) : (
                    <div className="p-10 bg-slate-50 border border-dashed border-slate-200 rounded-[32px] text-center text-slate-400 text-sm italic">
                        No proposals saved yet.
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default AIProposalGenerator;
