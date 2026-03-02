import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  CheckCircle2, Circle, Clock, Building2, 
  UserCheck, ShieldCheck, Mail, ArrowLeft,
  Sparkles, Coffee
} from 'lucide-react';

const OnboardingChecklist = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Mock tasks for Page 10 realization
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Upload ID Proof & Documents', status: 'pending', category: 'Compliance', icon: <ShieldCheck size={18} /> },
    { id: 2, title: 'Review Company Employee Handbook', status: 'completed', category: 'General', icon: <Building2 size={18} /> },
    { id: 3, title: 'Complete Background Check Form', status: 'pending', category: 'Vetting', icon: <UserCheck size={18} /> },
    { id: 4, title: 'Setup Professional Email', status: 'pending', category: 'IT', icon: <Mail size={18} /> },
    { id: 5, title: 'Meet your Mentor (Intro Call)', status: 'pending', category: 'Culture', icon: <Coffee size={18} /> }
  ]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`/api/applications/${id}/offer-details`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOffer(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const toggleTask = (taskId) => {
    setTasks(tasks.map(t => 
        t.id === taskId ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' } : t
    ));
  };

  if (loading) return <div className="p-20 text-center text-slate-500">Preparing your checklist...</div>;

  return (
    <div className="onboarding-page fade-in p-8 max-w-4xl mx-auto">
       <button onClick={() => navigate('/applications')} className="flex items-center gap-2 text-slate-500 hover:text-primary mb-8 transition-colors">
        <ArrowLeft size={16} /> My Applications
      </button>

      <header className="mb-12 flex justify-between items-end">
         <div>
            <div className="flex items-center gap-2 text-emerald-500 font-bold mb-2">
                <Sparkles size={18} /> Welcome Aboard!
            </div>
            <h1 className="text-4xl font-black text-slate-900">Onboarding Checklist</h1>
            <p className="text-slate-500 mt-2">Position: <span className="text-slate-900 font-bold">{offer.job_title}</span> • Start date: {new Date(offer.start_date).toLocaleDateString()}</p>
         </div>
         <div className="bg-slate-900 text-white rounded-2xl p-4 px-6 text-center">
             <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Completion</div>
             <div className="text-2xl font-black">{Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100)}%</div>
         </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="md:col-span-2 space-y-4">
            {tasks.map(task => (
                <div 
                  key={task.id} 
                  className={`group p-6 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${task.status === 'completed' ? 'bg-emerald-50 border-emerald-100' : 'bg-white border-slate-100 hover:border-primary/30'}`}
                  onClick={() => toggleTask(task.id)}
                >
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl transition-colors ${task.status === 'completed' ? 'bg-emerald-500 text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary'}`}>
                            {task.icon}
                        </div>
                        <div>
                            <div className="text-[10px] uppercase font-black text-slate-400 mb-0.5 tracking-tighter">{task.category}</div>
                            <h3 className={`font-bold ${task.status === 'completed' ? 'text-emerald-700 line-through' : 'text-slate-900'}`}>{task.title}</h3>
                        </div>
                    </div>
                    {task.status === 'completed' ? (
                        <CheckCircle2 size={24} className="text-emerald-500" />
                    ) : (
                        <Circle size={24} className="text-slate-200 group-hover:text-primary/30" />
                    )}
                </div>
            ))}
         </div>

         <div className="space-y-6">
             <section className="bg-primary text-white rounded-3xl p-8 shadow-xl shadow-primary/20">
                <Clock className="mb-4 opacity-50" size={32} />
                <h3 className="font-bold text-xl mb-2">Final Countdown</h3>
                <p className="text-primary-soft text-sm leading-relaxed mb-6">You have 12 days left before your first day! Keep up the momentum.</p>
                <div className="space-y-4">
                    <div className="text-xs font-bold uppercase tracking-widest opacity-50">Support Contact</div>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold">SB</div>
                        <div className="text-sm">SkillBridge Support</div>
                    </div>
                </div>
             </section>

             <section className="bg-white rounded-3xl p-8 border border-slate-100">
                <h4 className="font-bold text-slate-900 mb-4">Onboarding Guide</h4>
                <p className="text-slate-500 text-xs leading-relaxed">Download our universal starter kit to learn how to excel in your first 90 days.</p>
                <button className="btn btn-outline w-full mt-6 py-3">Download Guide</button>
             </section>
         </div>
      </div>
    </div>
  );
};

export default OnboardingChecklist;
