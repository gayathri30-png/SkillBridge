import React, { useState } from 'react';
import { 
  X, Zap, Play, Plus, Target, 
  MessageSquare, Brain, Sparkles, ShieldCheck,
  ChevronRight, Settings, AlertCircle 
} from 'lucide-react';
import './AutomationRules.css';

const AutomationRules = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('create');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [trigger, setTrigger] = useState('match_score');
  const [condition, setCondition] = useState('greater_than');
  const [value, setValue] = useState('85');
  const [action, setAction] = useState('shortlist');

  const suggestions = [
    { 
      title: 'Auto-Reject Ineligibles', 
      desc: 'Reject applicants with Match Score < 40% immediately.',
      trigger: 'match_score', cond: 'less_than', val: '40', act: 'reject'
    },
    { 
      title: 'Top Match Notification', 
      desc: 'Slack #hiring-leads when a 95%+ match applies.',
      trigger: 'match_score', cond: 'greater_than', val: '95', act: 'notify'
    },
    { 
      title: 'Skill Gap Warning', 
      desc: 'Tag candidate as "Needs Training" if core gaps found.',
      trigger: 'skill_gap', cond: 'exists', val: 'core', act: 'tag'
    }
  ];

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(onClose, 2000);
    }, 1500);
  };

  const applySuggestion = (s) => {
    setTrigger(s.trigger);
    setCondition(s.cond);
    setValue(s.val);
    setAction(s.act);
  };

  if (saved) {
    return (
      <div className="automation-backdrop">
        <div className="automation-container items-center justify-center p-20 text-center">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 scale-up">
                <ShieldCheck size={40} />
            </div>
            <h2 className="text-2xl font-black text-slate-800 mb-2">Rule Activated!</h2>
            <p className="text-slate-500">Your AI workflow rule is now running in the background.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="automation-backdrop">
      <div className="automation-container">
        <header className="automation-header">
          <h2><Zap size={28} className="text-amber-500" /> AI Workflow Builder</h2>
          <button className="btn-close" onClick={onClose}>Close</button>
        </header>

        <div className="automation-body">
          {/* Left Side: Rule Builder */}
          <div className="automation-left">
            <h3 className="section-title"><Plus size={16} /> Create New Rule</h3>
            
            <div className="rule-builder-card">
              <div className="builder-step">
                <div className="step-badge">STEP 1</div>
                <label className="step-label">Select Trigger</label>
                <select className="step-select" value={trigger} onChange={e => setTrigger(e.target.value)}>
                    <option value="match_score">AI Match Score</option>
                    <option value="skill_gap">Skill Gap Detection</option>
                    <option value="experience">Years of Experience</option>
                    <option value="activity">Candidate Activity</option>
                </select>
              </div>

              <div className="flex items-center justify-center my-2">
                <ChevronRight size={18} className="text-slate-300 transform rotate-90" />
              </div>

              <div className="builder-step">
                <div className="step-badge">STEP 2</div>
                <label className="step-label">Condition</label>
                <div className="flex gap-4 items-center">
                    <select className="step-select flex-1" value={condition} onChange={e => setCondition(e.target.value)}>
                        <option value="greater_than">is greater than</option>
                        <option value="less_than">is less than</option>
                        <option value="equals">is exactly</option>
                        <option value="exists">exists in profile</option>
                    </select>
                    <input 
                        type="text" 
                        value={value} 
                        onChange={e => setValue(e.target.value)}
                        className="w-16 bg-slate-100 p-2 rounded-lg font-bold text-center border-none outline-none"
                    />
                </div>
              </div>

              <div className="flex items-center justify-center my-2">
                <ChevronRight size={18} className="text-slate-300 transform rotate-90" />
              </div>

              <div className="builder-step">
                <div className="step-badge">STEP 3</div>
                <label className="step-label">Perform Action</label>
                <select className="step-select" value={action} onChange={e => setAction(e.target.value)}>
                    <option value="shortlist">Auto-Shortlist Candidate</option>
                    <option value="reject">Auto-Reject with AI Feedback</option>
                    <option value="notify">Notify Team via Slack</option>
                    <option value="tag">Add AI Smart Tag</option>
                </select>
              </div>

              <button 
                className="btn-create-rule" 
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? <Sparkles className="animate-spin" size={20} /> : <Play size={20} />}
                {saving ? 'Connecting...' : 'Deploy Automation Rule'}
              </button>
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-2xl border border-blue-100 flex gap-3">
                <Brain size={18} className="text-blue-600 flex-shrink-0" />
                <p className="text-xs text-blue-700 leading-relaxed">
                    AI recommendation: Rules based on <strong>Match Score</strong> have improved recruitment velocity by 18% in your department.
                </p>
            </div>
          </div>

          {/* Right Side: Suggestions */}
          <div className="automation-right">
            <h3 className="section-title"><Sparkles size={16} /> AI Suggested Templates</h3>
            
            <div className="ai-suggestions-card">
              <div className="space-y-4">
                {suggestions.map((s, i) => (
                  <div key={i} className="suggestion-item" onClick={() => applySuggestion(s)}>
                    <h5>{s.title}</h5>
                    <p>{s.desc}</p>
                    <div className="mt-3 text-[10px] font-bold text-white/50 flex items-center gap-1">
                        <Settings size={10} /> CLICK TO AUTO-FILL BUILDER
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 text-center p-6 border-t border-white/10">
                <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                        <Zap size={20} className="text-amber-400" />
                    </div>
                </div>
                <h4 className="text-sm font-bold mb-2">Active Automations</h4>
                <p className="text-xs text-white/40 mb-4">3 rules currently managing your pool.</p>
                <div className="flex justify-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" style={{animationDelay: '1s'}}></div>
                    <div className="w-2 h-2 rounded-full bg-slate-700"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutomationRules;
