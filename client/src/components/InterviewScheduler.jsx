import React, { useState } from 'react';
import { 
  X, Calendar as CalendarIcon, Clock, Sparkles, 
  Video, MapPin, Brain, ShieldCheck, Zap, Info
} from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';
import './InterviewScheduler.css';

const InterviewScheduler = ({ application, onClose }) => {
  const [scheduledAt, setScheduledAt] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [instructions, setInstructions] = useState('');
  const [scheduling, setScheduling] = useState(false);
  const [scheduled, setScheduled] = useState(false);

  const handleSchedule = async () => {
    if (!scheduledAt) return alert("Please select a date and time");
    
    setScheduling(true);
    try {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));
        
        await axios.post('/api/interviews', {
            application_id: application.application_id,
            recruiter_id: user.id,
            student_id: application.student_id || application.user_id,
            scheduled_at: scheduledAt,
            meeting_link: meetingLink,
            instructions: instructions
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        setScheduled(true);
        setTimeout(onClose, 2500);
    } catch (err) {
        console.error("Failed to schedule interview:", err);
        alert("Failed to schedule interview. Please try again.");
    } finally {
        setScheduling(false);
    }
  };

  if (scheduled) {
    return (
      <div className="scheduler-backdrop">
        <div className="scheduler-container items-center justify-center p-20 text-center">
            <motion.div 
               initial={{ scale: 0 }}
               animate={{ scale: 1 }}
               className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6"
            >
                <ShieldCheck size={40} />
            </motion.div>
            <h2 className="text-2xl font-black text-slate-800 mb-2">Interview Invitation Sent!</h2>
            <p className="text-slate-500">{application.student_name} has been notified via in-app notification.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="scheduler-backdrop">
      <div className="scheduler-container">
        <header className="scheduler-header">
          <h2><CalendarIcon size={24} /> Schedule Interview</h2>
          <button className="btn-close" onClick={onClose}><X size={20} /></button>
        </header>

        <div className="scheduler-layout">
          {/* Left Pane: Selection */}
          <div className="scheduler-left space-y-6">
            <div className="form-group">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Interview Date & Time</label>
                <div className="relative">
                    <input 
                        type="datetime-local" 
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 outline-none focus:border-blue-500 transition-all"
                        value={scheduledAt}
                        onChange={(e) => setScheduledAt(e.target.value)}
                    />
                </div>
            </div>

            <div className="form-group">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Meeting Link / Location</label>
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="e.g. https://zoom.us/j/..."
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 outline-none focus:border-blue-500 transition-all"
                        value={meetingLink}
                        onChange={(e) => setMeetingLink(e.target.value)}
                    />
                </div>
            </div>

            <div className="form-group">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Additional Instructions</label>
                <textarea 
                    placeholder="e.g. Please be prepared to discuss your portfolio."
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 outline-none focus:border-blue-500 transition-all min-h-[120px]"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                />
            </div>
          </div>

          {/* Right Pane: AI Intelligence (Simplified/Stylized) */}
          <div className="scheduler-right">
            <div className="ai-briefing-card mb-6">
              <h4><Brain size={18} className="text-primary" /> AI Candidate Brief</h4>
              <div className="space-y-3 mt-4">
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-[10px] font-medium text-blue-700">
                    <strong>Match Logic:</strong> {application.student_name} matches 92% of required skills. Highlight projects in React & Node.js.
                </div>
                <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 text-[10px] font-medium text-purple-700">
                    <strong>Recruiter Tip:</strong> Best time to schedule is morning (10 AM - 12 PM) for highest engagement.
                </div>
              </div>
            </div>

            <div className="mt-auto pt-6 border-t border-slate-100">
                 <button 
                  className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-[24px] font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                  onClick={handleSchedule}
                  disabled={!scheduledAt || scheduling}
                >
                  {scheduling ? <Zap size={18} className="animate-spin" /> : <Video size={18} />}
                  {scheduling ? 'Sending...' : 'Send Interview Invite'}
                </button>
                <p className="text-[10px] text-slate-400 text-center mt-4 font-medium uppercase tracking-tight">
                    Candidate will be notified instantly via dashboard.
                </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewScheduler;
