import React from 'react';
import { Sparkles, CheckCircle, Mail, Calendar, ArrowRight, X } from 'lucide-react';

const HireSuccess = ({ application, onClose }) => {
  return (
    <div className="modal-overlay-v2">
      <div className="modal-content-v2 max-w-xl text-center p-8">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-400 blur-2xl opacity-20 animate-pulse"></div>
            <div className="relative w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
              <CheckCircle className="text-emerald-600" size={40} />
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-black text-slate-900 mb-2">Hire Successful!</h2>
        <p className="text-slate-500 mb-8">You've officially hired <span className="font-bold text-slate-900">{application.student_name}</span>!</p>

        <div className="bg-slate-50 rounded-2xl p-6 text-left space-y-4 mb-8">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
            <Sparkles size={16} className="text-amber-500" /> Next Steps
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-white rounded-lg shadow-sm">
                <Mail size={14} className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Offer Letter Sent</p>
                <p className="text-xs text-slate-500">Sent to {application.student_email}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-white rounded-lg shadow-sm">
                <Calendar size={14} className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Notifications Sent</p>
                <p className="text-xs text-slate-500">Candidate has been notified on their dashboard</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
            <button onClick={onClose} className="btn btn-primary w-full py-3 shadow-lg shadow-primary/20">
                Go to My Jobs <ArrowRight size={16} />
            </button>
            <button onClick={onClose} className="btn btn-outline w-full py-3">
                Close
            </button>
        </div>
      </div>
    </div>
  );
};

export default HireSuccess;
