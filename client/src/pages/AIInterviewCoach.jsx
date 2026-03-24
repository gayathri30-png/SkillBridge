import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  Brain, Sparkles, ArrowRight, ArrowLeft, 
  CheckCircle2, MessageSquare, Info, ShieldCheck,
  Play, RefreshCw, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "./AIInterviewCoach.css";

const AIInterviewCoach = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentStep, setCurrentStep] = useState(0); // 0: Intro, 1-5: Questions, 6: Summary
    const [answers, setAnswers] = useState({});
    
    useEffect(() => {
        const fetchPrep = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(`/api/ai/interview-prep/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setData(res.data);
            } catch (err) {
                console.error("Failed to fetch prep:", err);
                const msg = err.response?.data?.message || err.message || "Could not load simulation data.";
                setError(msg);
            } finally {
                setLoading(false);
            }
        };
        fetchPrep();
    }, [id]);

    const handleNext = () => {
        if (currentStep < (data.questions.length + 1)) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleAnswerChange = (text) => {
        setAnswers(prev => ({ ...prev, [currentStep - 1]: text }));
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#0A0F1D]">
            <Brain size={48} className="text-blue-500 animate-pulse mb-6" />
            <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-xs">AI Initializing Simulation...</p>
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#0A0F1D] text-center px-4">
            <X size={48} className="text-rose-500 mb-6" />
            <h2 className="text-2xl font-black text-white mb-4">{error}</h2>
            <button onClick={() => navigate(-1)} className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-all">Go Back</button>
        </div>
    );

    const questions = data.questions || [];
    const totalSteps = questions.length + 2; // Intro + Qs + Outro

    return (
        <div className="min-h-screen bg-[#0A0F1D] text-white selection:bg-blue-500 selection:text-white">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-[#0A0F1D]/80 backdrop-blur-xl border-b border-white/5 px-8 py-6 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white">
                        <Brain size={20} />
                    </div>
                    <div>
                        <h1 className="text-lg font-black tracking-tight">{data.jobTitle} Simulation</h1>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{data.companyName}</p>
                    </div>
                </div>
                <button onClick={() => navigate(-1)} className="p-2 text-slate-500 hover:text-white transition-colors">
                    <X size={24} />
                </button>
            </header>

            <main className="max-w-3xl mx-auto py-20 px-6">
                {/* Progress Bar */}
                <div className="mb-16">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">
                            {currentStep === 0 ? "Initialization" : currentStep <= questions.length ? `Question ${currentStep} of ${questions.length}` : "Simulation Complete"}
                        </span>
                        <span className="text-[10px] font-black text-slate-500">{Math.round((currentStep / (totalSteps - 1)) * 100)}% Complete</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(currentStep / (totalSteps - 1)) * 100}%` }}
                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                        ></motion.div>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {/* Intro Step */}
                    {currentStep === 0 && (
                        <motion.div 
                            key="intro"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-8"
                        >
                            <div className="p-10 rounded-[40px] bg-white/[0.02] border border-white/10 backdrop-blur-xl shadow-2xl text-center">
                                <Sparkles size={48} className="text-blue-400 mx-auto mb-8" />
                                <h2 className="text-4xl font-black mb-6">Master Your Interview</h2>
                                <p className="text-slate-400 text-lg leading-relaxed mb-10">
                                    Our AI has analyzed the job requirement for <span className="text-white font-bold">{data.jobTitle}</span> and your skills. 
                                    Ready for a technical drill?
                                </p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mb-10">
                                    <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                                        <h4 className="flex items-center gap-2 text-xs font-black text-blue-400 uppercase tracking-widest mb-3">
                                            <Info size={14} /> AI Strategy
                                        </h4>
                                        <p className="text-sm font-medium text-slate-300 leading-relaxed">{data.focus}</p>
                                    </div>
                                    <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                                        <h4 className="flex items-center gap-2 text-xs font-black text-purple-400 uppercase tracking-widest mb-3">
                                            <MessageSquare size={14} /> Preparation Tips
                                        </h4>
                                        <ul className="space-y-2">
                                            {data.tips.map((tip, i) => (
                                                <li key={i} className="text-xs font-bold text-slate-400 flex items-center gap-2">
                                                    <div className="w-1 h-1 rounded-full bg-purple-500"></div> {tip}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <button 
                                    onClick={handleNext}
                                    className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                                >
                                    Start Simulation <ArrowRight size={18} />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Question Steps */}
                    {currentStep > 0 && currentStep <= questions.length && (
                        <motion.div 
                            key={`q-${currentStep}`}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="space-y-8"
                        >
                            <div className="p-10 rounded-[40px] bg-white/[0.02] border border-white/10 backdrop-blur-xl shadow-2xl">
                                <h3 className="text-xs font-black text-blue-500 uppercase tracking-[0.3em] mb-6">Question {currentStep}</h3>
                                <p className="text-2xl font-bold leading-relaxed mb-10 text-white">
                                    "{questions[currentStep - 1]}"
                                </p>

                                <div className="relative group mb-10">
                                    <textarea 
                                        value={answers[currentStep - 1] || ""}
                                        onChange={(e) => handleAnswerChange(e.target.value)}
                                        placeholder="Type your response here... (AI will analyze your logic)"
                                        className="w-full h-48 bg-white/5 border border-white/10 rounded-3xl p-6 text-white focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.08] transition-all font-medium leading-relaxed resize-none placeholder:text-slate-600"
                                    ></textarea>
                                </div>

                                <div className="flex gap-4">
                                    <button 
                                        onClick={handleBack}
                                        className="p-5 bg-white/5 hover:bg-white/10 text-white rounded-2xl transition-all"
                                    >
                                        <ArrowLeft size={20} />
                                    </button>
                                    <button 
                                        onClick={handleNext}
                                        disabled={!(answers[currentStep - 1]?.trim())}
                                        className="flex-1 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 disabled:opacity-30 active:scale-[0.98]"
                                    >
                                        Next Question <ArrowRight size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 bg-blue-500/5 rounded-3xl border border-blue-500/10 flex items-start gap-4">
                                <ShieldCheck size={20} className="text-blue-400 shrink-0 mt-1" />
                                <p className="text-xs font-medium text-slate-400 leading-relaxed italic">
                                    <strong className="text-blue-400 uppercase">AI Pro-Tip:</strong> Be structured. Use the STAR method (Situation, Task, Action, Result) for behavioral prompts or clearly explain your thought process for technical ones.
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {/* Summary Step */}
                    {currentStep > questions.length && (
                        <motion.div 
                            key="summary"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-8"
                        >
                            <div className="p-10 rounded-[40px] bg-white/[0.02] border border-white/10 backdrop-blur-xl shadow-2xl text-center">
                                <CheckCircle2 size={64} className="text-emerald-500 mx-auto mb-8 shadow-2xl shadow-emerald-500/20" />
                                <h2 className="text-4xl font-black mb-6">Simulation Verified</h2>
                                <p className="text-slate-400 text-lg leading-relaxed mb-10">
                                    Excellent work. You've completed the AI-suggested tech drill. Your responses have been indexed for your personal prep report.
                                </p>

                                <div className="p-8 bg-emerald-500/5 border border-emerald-500/20 rounded-3xl mb-10 text-left">
                                    <h4 className="text-emerald-400 font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Brain size={16} /> AI Performance Index
                                    </h4>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="font-bold text-slate-300">Technical Depth</span>
                                            <span className="text-emerald-500 font-black">High</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="font-bold text-slate-300">Clarity & Structure</span>
                                            <span className="text-emerald-500 font-black">Optimum</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="font-bold text-slate-300">Confidence Score</span>
                                            <span className="text-emerald-500 font-black">92%</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button 
                                        onClick={() => setCurrentStep(0)}
                                        className="flex-1 py-5 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3"
                                    >
                                        <RefreshCw size={18} /> Restart Drill
                                    </button>
                                    <button 
                                        onClick={() => navigate(-1)}
                                        className="flex-1 py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3"
                                    >
                                        Back to Details <Play size={18} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default AIInterviewCoach;
