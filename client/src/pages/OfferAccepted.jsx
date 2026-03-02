import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PartyPopper, ArrowRight, CheckCircle2, Sparkles, Building2 } from 'lucide-react';

const OfferAccepted = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    return (
        <div className="p-8 max-w-2xl mx-auto text-center py-20">
            <div className="flex justify-center mb-10">
                <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-3xl animate-pulse"></div>
                    <div className="relative w-32 h-32 bg-primary rounded-full flex items-center justify-center text-white shadow-2xl shadow-primary/40">
                        <PartyPopper size={64} className="animate-bounce" />
                    </div>
                </div>
            </div>

            <h1 className="text-5xl font-black text-slate-900 mb-6">Congratulations!</h1>
            <p className="text-xl text-slate-500 mb-12 leading-relaxed">
                You've officially accepted the offer! Your new journey begins here. The recruiter has been notified and will reach out shortly for the next steps.
            </p>

            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 mb-12 text-left space-y-6">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Sparkles size={16} className="text-amber-500" /> Getting Started
                </h3>
                
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary border border-slate-100">
                        <CheckCircle2 size={20} />
                    </div>
                    <div>
                        <p className="font-bold text-slate-900">Digital Signature Recorded</p>
                        <p className="text-sm text-slate-500">Your acceptance has been securely logged on SkillBridge.</p>
                    </div>
                </div>

                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary border border-slate-100">
                        <Building2 size={20} />
                    </div>
                    <div>
                        <p className="font-bold text-slate-900">Onboarding Dashboard Unlocked</p>
                        <p className="text-sm text-slate-500">Complete your pre-joining tasks to prepare for Day 1.</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                    onClick={() => navigate(`/onboarding/${id}`)}
                    className="btn btn-primary py-4 px-10 text-lg shadow-xl shadow-primary/20"
                >
                    Go to Onboarding <ArrowRight size={20} />
                </button>
                <button 
                    onClick={() => navigate('/applications')}
                    className="btn btn-outline py-4 px-10 text-lg border-slate-200"
                >
                    My Applications
                </button>
            </div>
        </div>
    );
};

export default OfferAccepted;
