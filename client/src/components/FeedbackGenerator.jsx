import React, { useState, useMemo } from 'react';
import { 
  X, Mail, Sparkles, BookOpen, ExternalLink, 
  Send, Brain, Target, Award, Heart, ShieldCheck
} from 'lucide-react';
import './FeedbackGenerator.css';

const FeedbackGenerator = ({ application, onClose, onRefresh }) => {
  const [feedback, setFeedback] = useState(`Dear ${application.student_name},\n\nThank you for your interest in the ${application.job_title || 'Software Engineer'} role. After careful consideration, we have decided to move forward with other candidates.\n\nOur AI analysis highlighted your strong React foundations, but we're looking for deeper experience in TypeScript and AWS Cloud architecture for this specific role.\n\nTo help you in your journey, we've attached some curated learning resources based on the skill gaps we identified.`);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  // Mock recommendations based on "gaps"
  const recommendations = [
    { title: 'TypeScript Deep Dive', provider: 'Frontend Masters', type: 'Course' },
    { title: 'AWS Cloud Practitioner Essentials', provider: 'AWS Training', type: 'Certification' },
    { title: 'Scalable System Design', provider: 'Educative.io', type: 'Interactive' }
  ];

  const handleSend = () => {
    setSending(true);
    // Simulate API call to reject application and send feedback
    setTimeout(() => {
      setSending(false);
      setSent(true);
      if (onRefresh) onRefresh();
      setTimeout(onClose, 2000);
    }, 1500);
  };

  if (sent) {
    return (
      <div className="feedback-backdrop">
        <div className="feedback-container items-center justify-center p-20 text-center">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 scale-up">
                <ShieldCheck size={40} />
            </div>
            <h2 className="text-2xl font-black text-slate-800 mb-2">Feedback Sent!</h2>
            <p className="text-slate-500">The personalized AI-driven growth plan has been delivered to {application.student_name}.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="feedback-backdrop">
      <div className="feedback-container">
        <header className="feedback-header">
          <h2><Heart size={24} className="text-rose-500" /> Human-First AI Feedback</h2>
          <button className="btn-close" onClick={onClose}><X size={20} /></button>
        </header>

        <div className="feedback-body">
          <div className="rejection-summary">
            <div className="rejection-summary-icon">
                <Brain size={28} />
            </div>
            <div>
                <h4 className="text-slate-900 font-bold mb-1">AI Match Score: {application.ai_match_score}%</h4>
                <p className="text-slate-500 text-sm">Automated reasoning: Primary gap in TypeScript (3yr required vs. 1yr found).</p>
            </div>
          </div>

          <div className="feedback-editor-card">
            <div className="editor-header">
                <div className="flex items-center gap-2">
                    <Mail size={16} className="text-slate-400" />
                    <span className="text-xs font-black text-slate-400 uppercase">Growth Letter Preview</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-[10px] font-bold border border-amber-100">
                    <Sparkles size={12} /> AI REFINED
                </div>
            </div>
            <textarea 
                className="editor-textarea"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
            />
          </div>

          <div className="ai-recommendations">
            <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">Recommended Learning Path</h4>
                <div className="text-[10px] font-bold text-primary">MAPS TO SKILL GAPS</div>
            </div>
            <div className="recommendation-list">
                {recommendations.map((rec, i) => (
                    <div key={i} className="recommendation-item">
                        <div className="flex justify-between items-start">
                            <BookOpen size={16} className="text-slate-400" />
                            <span className="text-[10px] font-bold px-1.5 py-0.5 bg-slate-200 rounded">{rec.type}</span>
                        </div>
                        <h5>{rec.title}</h5>
                        <p>{rec.provider}</p>
                    </div>
                ))}
            </div>
          </div>

          <div className="p-4 bg-slate-900 rounded-2xl border border-white/10">
            <div className="flex items-center gap-3">
                <Target size={20} className="text-primary" />
                <div>
                     <p className="text-white text-sm font-bold">Feedback Effectiveness: High (88%)</p>
                     <p className="text-slate-400 text-xs mt-1">AI predicts 92% re-application rate once skills are acquired.</p>
                </div>
            </div>
          </div>

          <button 
            className="btn-send-feedback" 
            onClick={handleSend}
            disabled={sending}
          >
            {sending ? <Sparkles className="animate-spin" size={20} /> : <Send size={20} />}
            {sending ? 'Personalizing...' : 'Finalize & Send Growth Plan'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackGenerator;
