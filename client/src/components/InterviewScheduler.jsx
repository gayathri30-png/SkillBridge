import React, { useState, useMemo } from 'react';
import { 
  X, Calendar as CalendarIcon, Clock, Sparkles, 
  Mail, ChevronLeft, ChevronRight, Video, 
  MapPin, Brain, ShieldCheck, Zap, Info
} from 'lucide-react';
import './InterviewScheduler.css';

const InterviewScheduler = ({ application, onClose }) => {
  const [selectedDay, setSelectedDay] = useState(24);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [scheduling, setScheduling] = useState(false);
  const [scheduled, setScheduled] = useState(false);

  // Mock data for AI suggestions
  const suggestedDays = [18, 24, 25];
  const timeSlots = [
    { id: 1, time: '10:00 AM', reason: 'Common activity peak', ai: true },
    { id: 2, time: '11:30 AM', reason: 'High recruiter availability', ai: false },
    { id: 3, time: '02:00 PM', reason: 'Optimal for deep focus prep', ai: true },
    { id: 4, time: '04:00 PM', reason: 'End of day review', ai: false },
  ];

  const handleSchedule = () => {
    if (!selectedSlot) return;
    setScheduling(true);
    // Simulate API call
    setTimeout(() => {
      setScheduling(false);
      setScheduled(true);
      setTimeout(onClose, 2000);
    }, 1500);
  };

  if (scheduled) {
    return (
      <div className="scheduler-backdrop">
        <div className="scheduler-container items-center justify-center p-20 text-center">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 scale-up">
                <ShieldCheck size={40} />
            </div>
            <h2 className="text-2xl font-black text-slate-800 mb-2">Interview Scheduled!</h2>
            <p className="text-slate-500">Google Calendar invite and AI briefing sent to {application.student_name}.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="scheduler-backdrop">
      <div className="scheduler-container">
        <header className="scheduler-header">
          <h2><CalendarIcon size={24} /> AI Interview Scheduler</h2>
          <button className="btn-close" onClick={onClose}><X size={20} /></button>
        </header>

        <div className="scheduler-layout">
          {/* Left Pane: Selection */}
          <div className="scheduler-left">
            <div className="calendar-mock">
              <div className="calendar-header">
                <h3>February 2026</h3>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-slate-100 rounded-lg"><ChevronLeft size={18} /></button>
                  <button className="p-2 hover:bg-slate-100 rounded-lg"><ChevronRight size={18} /></button>
                </div>
              </div>
              <div className="calendar-grid">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(d => (
                  <div key={d} className="text-[10px] uppercase font-bold text-slate-400 text-center mb-2">{d}</div>
                ))}
                {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                  <div 
                    key={day} 
                    className={`calendar-day ${day === selectedDay ? 'active' : ''} ${suggestedDays.includes(day) ? 'suggested' : ''}`}
                    onClick={() => setSelectedDay(day)}
                  >
                    {day}
                  </div>
                ))}
              </div>
            </div>

            <div className="slots-section">
              <h4><Sparkles size={16} className="text-primary" /> AI Suggested Slots</h4>
              <div className="time-slots">
                {timeSlots.map(slot => (
                  <div 
                    key={slot.id} 
                    className={`time-slot ${selectedSlot === slot.id ? 'selected' : ''} ${slot.ai ? 'ai-recommended' : ''}`}
                    onClick={() => setSelectedSlot(slot.id)}
                  >
                    <div className="slot-time">{slot.time}</div>
                    <div className="slot-reason">{slot.reason}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Pane: AI Intelligence */}
          <div className="scheduler-right">
            <div className="ai-briefing-card">
              <h4><Brain size={18} className="text-primary" /> Recruiter Briefing</h4>
              <div className="space-y-3">
                <div className="briefing-item">
                  <strong>Focus Area:</strong> Architectural Scalability
                </div>
                <div className="briefing-item">
                  <strong>Tone Tip:</strong> Candidate appreciates direct, technical questions.
                </div>
                <div className="briefing-item">
                  <strong>Risk:</strong> Potential mismatch on AWS experience levels.
                </div>
              </div>
            </div>

            <div className="email-preview-card">
              <div className="preview-header">
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-slate-400" />
                  <span className="text-xs font-bold text-slate-500 uppercase">Email Preview</span>
                </div>
                <span className="text-[10px] font-bold text-primary px-2 py-0.5 bg-primary/10 rounded">AI GENERATED</span>
              </div>
              <div className="preview-body">
                <p>Hi {application.student_name},</p>
                <p className="mt-4">
                  We were truly impressed by your portfolio and AI match analysis. We'd love to schedule a 
                  technical deep-dive session on <strong>Feb {selectedDay}</strong> at 
                  <strong> {selectedSlot ? timeSlots.find(s => s.id === selectedSlot).time : '...'}</strong>.
                </p>
                <p className="mt-4">Looking forward to discusing your React expertise!</p>
              </div>
              <div className="preview-footer">
                 <button 
                  className="btn-schedule" 
                  onClick={handleSchedule}
                  disabled={!selectedSlot || scheduling}
                >
                  {scheduling ? <Zap size={18} className="animate-spin" /> : <Video size={18} />}
                  {scheduling ? 'Syncing...' : 'Schedule & Send Invite'}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                <Info size={18} className="text-amber-600 flex-shrink-0" />
                <p className="text-[10px] text-amber-700 leading-relaxed font-medium">
                  AI detected high activity from {application.student_name} on Tuesdays. This slot has a 92% acceptance probability.
                </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewScheduler;
