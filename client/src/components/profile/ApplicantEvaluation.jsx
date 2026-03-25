import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  X, Brain, Target, Award, 
  CheckCircle2, AlertTriangle, TrendingUp, Sparkles,
  Calendar, User, FileText, Send, ThumbsDown, RotateCcw
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import './ApplicantEvaluation.css';

const ApplicantEvaluation = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewTime, setInterviewTime] = useState('');
  const [interviewMsg, setInterviewMsg] = useState('I would like to invite you for an interview to discuss your application.');
  const [sendingMsg, setSendingMsg] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectFeedback, setRejectFeedback] = useState('');

  useEffect(() => {
    if (applicationId) fetchEvaluation();
  }, [applicationId]);

  const fetchEvaluation = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const res = await axios.get(`/api/ai/evaluate/${applicationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load evaluation.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus, feedbackMsg = null) => {
    try {
      const token = localStorage.getItem('token');
      const payload = { status: newStatus };
      if (feedbackMsg) payload.feedback_message = feedbackMsg;

      await axios.put(`/api/applications/${applicationId}/status`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert(`Candidate marked as ${newStatus}!`);
      setShowRejectModal(false);
      
      // Reflect status without leaving
      fetchEvaluation();
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    }
  };

  const handleSendInvite = async () => {
    if(!interviewDate || !interviewTime) return alert("Please select date and time");
    
    try {
      setSendingMsg(true);
      const token = localStorage.getItem('token');
      await axios.put(`/api/applications/${applicationId}/suggestion`, {
        interviewDate,
        interviewTime,
        message: interviewMsg
      }, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      alert(`Interview invitation sent successfully!`);
      fetchEvaluation(); // Refresh to get suggestion_sent=true
    } catch (err) {
      console.error(err);
      alert("Failed to send suggestion");
    } finally {
      setSendingMsg(false);
    }
  };

  const handleReEvaluate = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.put(`/api/ai/re-evaluate/${applicationId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(res.data.message);
      fetchEvaluation();
    } catch (err) {
      console.error(err);
      alert('Failed to re-evaluate application');
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="text-center p-8 bg-white rounded-3xl shadow-sm border border-slate-100">
            <Sparkles className="animate-pulse text-indigo-600 mx-auto mb-4" size={48} />
            <p className="font-bold text-slate-700 text-lg">AI Loading Candidate Dossier...</p>
        </div>
    </div>
  );

  if (error || !data) return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="text-center p-8">
            <AlertTriangle className="text-red-400 mx-auto mb-4" size={48} />
            <p className="font-bold text-red-600 mb-6 text-xl">{error}</p>
            <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors" onClick={fetchEvaluation}>Retry</button>
        </div>
    </div>
  );

  const { tabs, candidate, job, application } = data;
  const { skillGap: sg, behavioralAnalysis: ba, interviewPrep: ip, executiveSummary: es } = tabs;

  return (
    <div className="min-h-screen bg-slate-50 pb-40 font-sans">
      {/* 1. Header */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200 px-8 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-6">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-indigo-200">
            {candidate.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{candidate.name}</h1>
            <div className="flex items-center gap-4 mt-3 flex-wrap">
              <span className="font-bold text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-indigo-100 shadow-sm">
                <TrendingUp size={16}/> {application.matchScore}% Match
              </span>
              <button 
                onClick={handleReEvaluate}
                className="p-1.5 bg-white text-indigo-600 hover:bg-indigo-50 rounded-lg border border-indigo-100 transition-all flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest"
                title="Refresh AI score logic"
              >
                <RotateCcw size={12} className={loading ? 'animate-spin' : ''} /> Refresh AI Score
              </button>
              {data.benchmarks && (
                <span className="font-medium text-slate-500 text-xs flex items-center gap-2">
                  <span>Top: <strong className="text-slate-700">{data.benchmarks.max}%</strong></span>
                  <span>Avg: <strong className="text-slate-700">{data.benchmarks.avg}%</strong></span>
                </span>
              )}
              <div className="w-px h-5 bg-slate-200 mx-1"></div>
              <span className="font-medium text-slate-600 flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
                <User size={16}/> {job.title}
              </span>
              <span className={`px-4 py-1.5 rounded-full font-bold uppercase tracking-wider text-[11px] ${application.status === 'hired' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : application.status === 'accepted' ? 'bg-blue-100 text-blue-800 border-blue-200' : application.status === 'rejected' ? 'bg-red-100 text-red-800 border-red-200' : 'bg-amber-100 text-amber-800 border-amber-200'}`}>
                {application.status === 'accepted' ? 'Shortlisted' : application.status}
              </span>
            </div>
          </div>
        </div>
        <button onClick={() => navigate(-1)} className="p-3 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors">
          <X size={24} />
        </button>
      </div>

      <div className="max-w-5xl mx-auto mt-10 space-y-10 px-4">
        
        {/* NEW AI OPINION / RECOMMENDATION */}
        <section className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 rounded-3xl shadow-lg border border-indigo-500 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-bl-full -z-10"></div>
            <div className="flex items-center gap-3 mb-4">
                <Sparkles size={28} className="text-indigo-200" />
                <h2 className="text-2xl font-black text-white">AI Verdict & Recommendation</h2>
            </div>
            <p className="text-lg text-indigo-50 leading-relaxed font-medium">
                <strong className="text-white">{es?.verdict || ba?.sentiment?.label}: </strong> 
                {es?.summary || ba?.sentiment?.description} 
            </p>
        </section>

        {/* NEW ACTIVITY TIMELINE */}
        {data.timeline && (
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-around flex-wrap gap-4">
            <div className="flex flex-col items-center text-center">
              <span className="text-3xl font-black text-slate-800">{data.timeline.account_age_days}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Days on Platform</span>
            </div>
            <div className="w-px h-12 bg-slate-100 hidden md:block"></div>
            <div className="flex flex-col items-center text-center">
              <span className="text-3xl font-black text-slate-800">{data.timeline.total_applications}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Total Applications</span>
            </div>
            <div className="w-px h-12 bg-slate-100 hidden md:block"></div>
            <div className="flex flex-col items-center text-center">
              <span className="text-lg font-bold text-slate-700 mt-2">{new Date(data.timeline.last_active).toLocaleDateString()}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Last Active</span>
            </div>
          </section>
        )}

        {/* 2 & 3. Skills Match & Gap Analysis */}
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-indigo-100 rounded-2xl text-indigo-600"><Target size={26} /></div>
            <div>
                <h2 className="text-2xl font-black text-slate-800">Skills Alignment</h2>
                <p className="text-slate-500 font-medium mt-1">Comparing candidate expertise against job requirements</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sg.skills.map((skill, i) => (
              <div key={i} className={`p-5 rounded-2xl border-2 transition-transform hover:-translate-y-1 ${skill.status === 'match' ? 'bg-emerald-50/50 border-emerald-100' : skill.status === 'missing' ? 'bg-red-50/50 border-red-100' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex justify-between items-center mb-3">
                  <span className="font-bold text-slate-900 text-lg">{skill.skill}</span>
                  {skill.status === 'match' ? <CheckCircle2 size={24} className="text-emerald-500" /> : skill.status === 'missing' ? <AlertTriangle size={24} className="text-red-400" /> : <Award size={24} className="text-indigo-400" />}
                </div>
                <div className="flex justify-between text-sm text-slate-500 font-medium">
                  <span>Required: {skill.requirement}</span>
                  <span className={`px-2 py-0.5 rounded-md ${skill.status === 'match' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}`}>{skill.candidateLevel || 'None'}</span>
                </div>
              </div>
            ))}
          </div>

          {sg.missingSkills?.length > 0 && (
            <div className="mt-8 p-6 bg-rose-50 rounded-2xl border-2 border-rose-100 flex items-start gap-4">
                <div className="p-2 bg-white rounded-xl shadow-sm text-rose-500 shrink-0"><AlertTriangle size={24}/></div>
                <div>
                    <h4 className="font-bold text-rose-900 mb-3 text-lg">Critical Skill Gaps Identified</h4>
                    <div className="flex flex-wrap gap-2">
                        {sg.missingSkills.map((m, i) => <span key={i} className="px-4 py-1.5 bg-white text-rose-700 rounded-full font-bold border border-rose-200 shadow-sm">{m}</span>)}
                    </div>
                </div>
            </div>
          )}
        </section>

        {/* 4. Proposal Analysis */}
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-purple-100 rounded-2xl text-purple-600"><FileText size={26} /></div>
            <div>
                <h2 className="text-2xl font-black text-slate-800">Proposal Analysis</h2>
                <p className="text-slate-500 font-medium mt-1">Candidate self-representation and AI parsing</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                  <h4 className="font-bold text-slate-400 uppercase tracking-widest text-xs mb-3">Original Submission</h4>
                  <div className="p-6 bg-slate-50 rounded-2xl text-slate-700 italic border-l-4 border-slate-300 leading-relaxed min-h-[140px]">
                    "{application.proposal || 'No proposal provided.'}"
                  </div>
              </div>
              <div className="space-y-4">
                  <h4 className="font-bold text-slate-400 uppercase tracking-widest text-xs mb-3">AI Sentiment metrics</h4>
                  <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100 shadow-sm">
                      <span className="text-xs uppercase font-extrabold text-blue-500 tracking-wider">Communication Style</span>
                      <p className="mt-1 font-bold text-slate-900">{ba.communicationStyle}</p>
                      <div className="mt-3 flex gap-1.5 flex-wrap">{ba.communicationTraits.map((t, i) => <span key={i} className="text-[10px] px-2.5 py-1 bg-white rounded-full text-blue-700 font-bold border border-blue-100">{t}</span>)}</div>
                  </div>
              </div>
          </div>
        </section>



        {/* 5. Interview Scheduler */}
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-sky-100 rounded-2xl text-sky-600"><Calendar size={26} /></div>
            <div>
                <h2 className="text-2xl font-black text-slate-800">Propose Interview</h2>
                <p className="text-slate-500 font-medium mt-1">Send a direct message to schedule a meeting</p>
            </div>
            {application.suggestion_sent && (
              <div className="ml-auto bg-sky-50 text-sky-600 px-4 py-2 rounded-full font-bold text-sm tracking-wide border border-sky-100 flex items-center gap-2">
                <CheckCircle2 size={18}/> Suggestion Sent
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Date</label>
              <input type="date" disabled={application.suggestion_sent} className="w-full p-4 rounded-xl border-2 border-slate-100 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 outline-none transition-all font-medium text-slate-700 bg-slate-50 focus:bg-white disabled:opacity-50" value={interviewDate} onChange={e => setInterviewDate(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Time</label>
              <input type="time" disabled={application.suggestion_sent} className="w-full p-4 rounded-xl border-2 border-slate-100 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 outline-none transition-all font-medium text-slate-700 bg-slate-50 focus:bg-white disabled:opacity-50" value={interviewTime} onChange={e => setInterviewTime(e.target.value)} />
            </div>
          </div>
          <div className="mb-6">
             <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Message Template</label>
             <textarea disabled={application.suggestion_sent} className="w-full p-4 rounded-xl border-2 border-slate-100 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 outline-none transition-all h-32 font-medium text-slate-700 bg-slate-50 focus:bg-white resize-none disabled:opacity-50" value={interviewMsg} onChange={e => setInterviewMsg(e.target.value)}></textarea>
          </div>
          <button 
            onClick={handleSendInvite} 
            disabled={application.suggestion_sent || sendingMsg}
            className="px-8 py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-sky-600 hover:shadow-lg hover:shadow-sky-500/30 transition-all flex items-center justify-center gap-2 w-full md:w-auto disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none disabled:hover:bg-slate-900"
          >
            {sendingMsg ? 'Broadcasting...' : application.suggestion_sent ? 'Already Sent' : <><Send size={18} /> Send Suggestion</>}
          </button>
        </section>
      </div>

      {/* 7. Review Action Buttons (Fixed Bottom Bar) */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-white/95 backdrop-blur-xl border-t border-slate-200 flex justify-center items-center z-50 shadow-[0_-10px_40px_-5px_rgba(0,0,0,0.05)]">
        
        <div className="w-full max-w-5xl flex justify-between items-center gap-4">
            <div className="hidden md:block">
                <span className="text-slate-500 font-bold text-sm tracking-wide uppercase">Final Decision:</span>
            </div>

            <div className="flex items-center gap-4 flex-1 md:flex-none">
                {/* Reject Target */}
                <button 
                onClick={() => setShowRejectModal(true)}
                disabled={application.status === 'rejected'}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-lg border-2 border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:border-rose-200"
                >
                <ThumbsDown size={20}/> Reject
                </button>

                {/* Shortlist Target */}
                <button 
                onClick={() => handleUpdateStatus('accepted')}
                disabled={application.status === 'accepted' || application.status === 'hired'}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-10 py-4 rounded-2xl font-bold text-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-all disabled:opacity-30 disabled:hover:bg-blue-100"
                >
                <Target size={20}/> Shortlist
                </button>

                {/* Hire Target */}
                <button 
                onClick={() => handleUpdateStatus('hired')}
                disabled={application.status === 'hired'}
                className="flex-1 md:flex-none relative overflow-hidden group px-12 py-4 rounded-2xl font-black text-lg text-white shadow-xl shadow-emerald-500/30 transition-all hover:-translate-y-1 hover:shadow-emerald-500/50 disabled:opacity-30 disabled:hover:translate-y-0 disabled:hover:shadow-emerald-500/30"
                style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <span className="relative flex items-center justify-center gap-2">
                    <CheckCircle2 size={24}/> {application.status === 'hired' ? 'Hired' : 'Hire'}
                </span>
                </button>
            </div>
        </div>
      </div>

      {/* REJECTION MODAL */}
      {showRejectModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 max-w-md w-full animate-in fade-in zoom-in duration-200" style={{ animationDuration: '0.2s' }}>
            <h3 className="text-xl font-black text-slate-800 mb-2">Provide Feedback</h3>
            <p className="text-slate-500 text-sm mb-6">Select a template to send to the candidate, or send without feedback.</p>
            
            <div className="space-y-3 mb-8">
              {["Lacking primary skills required for this role.", "We decided to move forward with a candidate whose experience more closely aligns.", "Your requested compensation exceeds our budget constraints."].map((msg, idx) => (
                <button 
                  key={idx}
                  onClick={() => setRejectFeedback(msg)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all font-medium text-sm ${rejectFeedback === msg ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-100 text-slate-600 hover:border-slate-300'}`}
                >
                  "{msg}"
                </button>
              ))}
            </div>
            
            <div className="flex gap-4">
              <button 
                className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
                onClick={() => setShowRejectModal(false)}
              >
                Cancel
              </button>
              <button 
                className="flex-[2] py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-rose-600/20"
                onClick={() => handleUpdateStatus('rejected', rejectFeedback || "After careful consideration, we will not be moving forward.")}
              >
                Reject & Notify
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicantEvaluation;
