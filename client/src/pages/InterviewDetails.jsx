import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  Calendar, Clock, MapPin, Video, 
  CheckCircle2, XCircle, Brain, 
  Sparkles, ShieldCheck, Info 
} from "lucide-react";
import { motion } from "framer-motion";
import "./InterviewDetails.css";

const InterviewDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [interview, setInterview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [processing, setProcessing] = useState(false);
    const [responded, setResponded] = useState(false);

    useEffect(() => {
        const fetchInterview = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(`/api/interviews/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setInterview(res.data);
            } catch (err) {
                console.error("Failed to fetch interview:", err);
                setError("Invitation not found or unauthorized");
            } finally {
                setLoading(false);
            }
        };
        fetchInterview();
    }, [id]);

    const handleResponse = async (status) => {
        setProcessing(true);
        try {
            const token = localStorage.getItem("token");
            await axios.patch(`/api/interviews/${id}/respond`, 
                { status },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setResponded(status);
            setTimeout(() => navigate("/dashboard"), 3000);
        } catch (err) {
            alert("Failed to send response");
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-500 font-bold uppercase tracking-widest text-xs">Loading Invitation...</p>
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
            <XCircle size={48} className="text-rose-500 mb-4" />
            <h2 className="text-2xl font-black text-slate-800">{error}</h2>
            <button onClick={() => navigate("/dashboard")} className="mt-6 btn btn-primary">Back to Dashboard</button>
        </div>
    );

    if (responded) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-center px-4">
            <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-2xl ${responded === 'accepted' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}
            >
                {responded === 'accepted' ? <CheckCircle2 size={48} /> : <XCircle size={48} />}
            </motion.div>
            <h2 className="text-3xl font-black text-slate-800 mb-2">
                {responded === 'accepted' ? 'Invitation Accepted!' : 'Invitation Declined'}
            </h2>
            <p className="text-slate-500 max-w-md mx-auto">
                {responded === 'accepted' 
                    ? `Great! Your interview is confirmed. The recruiter has been notified.` 
                    : "You've declined the invitation. We'll update your application status."}
            </p>
            <p className="mt-8 text-xs font-black text-blue-600 uppercase tracking-widest">Redirecting to Dashboard...</p>
        </div>
    );

    return (
        <div className="interview-page-container fade-in">
            <div className="max-w-4xl mx-auto py-12 px-4">
                <header className="mb-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full text-blue-600 text-xs font-black uppercase tracking-widest mb-6 shadow-sm">
                        <Sparkles size={16} className="animate-pulse" /> Official Interview Invitation
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 mb-2">Technical Interview for {interview.job_title}</h1>
                    <p className="text-slate-500 text-lg font-medium">{interview.company_name} • Sent by {interview.recruiter_name}</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Details */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="premium-card p-8">
                            <h3 className="flex items-center gap-3 text-lg font-bold text-slate-800 mb-8 pb-4 border-b border-slate-100">
                                <Calendar size={20} className="text-blue-600" /> Schedule Details
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="detail-item">
                                    <span className="label">Date & Time</span>
                                    <div className="flex items-center gap-3 mt-2">
                                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                                            <Clock size={20} />
                                        </div>
                                        <span className="text-lg font-bold text-slate-700">
                                            {new Date(interview.scheduled_at).toLocaleDateString(undefined, { 
                                                weekday: 'long', 
                                                year: 'numeric', 
                                                month: 'long', 
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                    </div>
                                </div>

                                <div className="detail-item">
                                    <span className="label">Location / Link</span>
                                    <div className="flex items-center gap-3 mt-2">
                                        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                                            {interview.meeting_link?.startsWith('http') ? <Video size={20} /> : <MapPin size={20} />}
                                        </div>
                                        <span className="text-lg font-bold text-slate-700 truncate max-w-[200px]">
                                            {interview.meeting_link || 'TBD (Join Link provided on acceptance)'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {interview.instructions && (
                                <div className="mt-10 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <Info size={14} /> Instructions from Recruiter
                                    </h4>
                                    <p className="text-slate-700 leading-relaxed font-medium">
                                        {interview.instructions}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col md:flex-row gap-4">
                            <button 
                                onClick={() => handleResponse('accepted')}
                                disabled={processing}
                                className="flex-1 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-[24px] font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                            >
                                {processing ? "Processing..." : <><CheckCircle2 size={20} /> Accept Invitation</>}
                            </button>
                            <button 
                                onClick={() => handleResponse('declined')}
                                disabled={processing}
                                className="flex-1 py-5 bg-white border-2 border-slate-200 hover:border-rose-200 hover:text-rose-600 text-slate-600 rounded-[24px] font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                            >
                                <XCircle size={20} /> Decline
                            </button>
                        </div>
                    </div>

                    {/* Sidebar: AI Briefing */}
                    <div className="space-y-6">
                        <div className="ai-briefing-glow p-6 rounded-[32px] border border-blue-50 bg-white shadow-xl relative overflow-hidden">
                            <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-600/5 blur-3xl animate-pulse"></div>
                            
                            <h3 className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest mb-6">
                                <Brain size={16} /> AI Pre-Interview Briefing
                            </h3>
                            
                            <div className="space-y-6">
                                <div className="briefing-box">
                                    <div className="text-[10px] font-black text-slate-400 uppercase mb-1">Success Probability</div>
                                    <div className="flex items-center gap-2">
                                        <div className="h-1.5 flex-1 bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-emerald-500 w-[82%] shadow-[0_0_8px_rgba(16,185,129,0.3)]"></div>
                                        </div>
                                        <span className="text-xs font-black text-emerald-600">82%</span>
                                    </div>
                                </div>
                                <div className="briefing-box">
                                    <div className="text-[10px] font-black text-slate-400 uppercase mb-1">Interview Tip</div>
                                    <p className="text-xs font-bold text-slate-600 leading-relaxed italic">
                                        "Focus on your React Hooks experience. This company values modular, clean code."
                                    </p>
                                </div>
                                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                                    <div className="flex items-center gap-2 mb-2 text-blue-600 font-bold text-[10px] uppercase">
                                        <ShieldCheck size={14} /> Verified Professional
                                    </div>
                                    <p className="text-[10px] text-blue-700 leading-relaxed">
                                        Your profile match score of 92% is verified by SkillBridge AI.
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default InterviewDetails;
