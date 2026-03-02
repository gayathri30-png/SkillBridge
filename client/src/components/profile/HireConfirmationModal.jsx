import React, { useState } from 'react';
import { X, Calendar, DollarSign, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';

const HireConfirmationModal = ({ application, onClose, onConfirm }) => {
  const [hiringDetails, setHiringDetails] = useState({
    start_date: '',
    salary: '',
    contract_type: 'Full-time',
    offer_letter: `Dear ${application.student_name},\n\nWe are pleased to offer you the position of [Job Title] at our company. Based on your impressive interview performance and background, we are excited to have you join the team.\n\nSincerely,\nRecruitment Team`,
    additional_notes: 'Welcome to the team!'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConfirm = async () => {
    if (!hiringDetails.start_date || !hiringDetails.salary) {
      setError('Please fill in start date and salary');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.put(`/api/applications/${application.application_id}/status`, {
        status: 'hired',
        hiringDetails
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onConfirm();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to hire candidate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay-v2">
      <div className="modal-content-v2 max-w-2xl">
        <div className="modal-header-v2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <CheckCircle className="text-emerald-600" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Confirm Hire</h2>
              <p className="text-sm text-slate-500">Processing hiring for {application.student_name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <div className="modal-body-v2 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-center gap-2 text-sm">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">Start Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="date"
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                  value={hiringDetails.start_date}
                  onChange={(e) => setHiringDetails({...hiringDetails, start_date: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">Salary Offered (Yearly)</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text"
                  placeholder="e.g. $120,000"
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                  value={hiringDetails.salary}
                  onChange={(e) => setHiringDetails({...hiringDetails, salary: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase">Contract Type</label>
            <select 
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
              value={hiringDetails.contract_type}
              onChange={(e) => setHiringDetails({...hiringDetails, contract_type: e.target.value})}
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase">Offer Letter Content</label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 text-slate-400" size={16} />
              <textarea 
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm min-h-[150px]"
                value={hiringDetails.offer_letter}
                onChange={(e) => setHiringDetails({...hiringDetails, offer_letter: e.target.value})}
              />
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 flex gap-3">
          <button onClick={onClose} className="btn btn-outline flex-1">Cancel</button>
          <button 
            onClick={handleConfirm} 
            disabled={loading}
            className="btn btn-primary flex-1 bg-emerald-600 hover:bg-emerald-700"
          >
            {loading ? 'Processing...' : 'Confirm Hire'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HireConfirmationModal;
