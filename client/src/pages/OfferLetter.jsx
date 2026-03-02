import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FileText, Calendar, DollarSign, Briefcase, 
  CheckCircle, XCircle, ArrowLeft, Download,
  Printer, ShieldCheck, Sparkles
} from 'lucide-react';

const OfferLetter = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOfferDetails();
  }, [id]);

  const fetchOfferDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`/api/applications/${id}/offer-details`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOffer(res.data);
    } catch (err) {
      setError('Failed to load offer details');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!window.confirm("By accepting, you agree to the terms mentioned in the offer letter. Proceed?")) return;
    
    try {
      setProcessing(true);
      const token = localStorage.getItem('token');
      await axios.post(`/api/applications/${id}/accept-offer`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate(`/offer-accepted/${id}`);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to accept offer");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="p-20 text-center font-medium text-slate-500">Opening your future...</div>;
  if (error) return <div className="p-20 text-center text-red-500">{error}</div>;

  return (
    <div className="offer-letter-page fade-in p-8 max-w-5xl mx-auto">
      <button onClick={() => navigate('/applications')} className="flex items-center gap-2 text-slate-500 hover:text-primary mb-8 transition-colors">
        <ArrowLeft size={16} /> Back to Applications
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Offer Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-10 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
             {/* Background Decoration */}
             <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                <FileText size={200} />
             </div>

             <header className="flex justify-between items-start mb-12">
                <div>
                   <div className="flex items-center gap-2 text-primary font-bold mb-2">
                       <Sparkles size={18} /> Official Job Offer
                   </div>
                   <h1 className="text-4xl font-black text-slate-900">{offer.job_title}</h1>
                   <p className="text-xl text-slate-500 mt-2">at {offer.company_name || 'SkillBridge Partner'}</p>
                </div>
                <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full text-sm font-bold border border-emerald-100">
                    Employment Offer
                </div>
             </header>

             <div className="offer-content space-y-8 bg-slate-50 p-8 rounded-2xl border border-slate-100">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-white rounded-xl shadow-sm text-primary">
                        <FileText size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 mb-2">A Message from {offer.recruiter_name}</h3>
                        <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                            {offer.offer_letter}
                        </p>
                    </div>
                </div>

                <div className="border-t border-slate-200 pt-8">
                    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <CheckCircle size={18} className="text-emerald-500" /> Additional Terms & Notes
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed italic">
                        {offer.additional_notes || "No additional notes provided."}
                    </p>
                </div>
             </div>

             <footer className="mt-12 flex justify-between items-center text-xs text-slate-400 font-medium">
                <div>Issued via SkillBridge Hiring Platform</div>
                <div>ID: SB-OFFER-{offer.id}</div>
             </footer>
          </div>
        </div>

        {/* Right Column: Key Stats & Actions */}
        <div className="space-y-6">
          <section className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl">
             <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <ShieldCheck size={20} className="text-emerald-400" /> Professional Summary
             </h3>
             
             <div className="space-y-6">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                       <DollarSign size={20} className="text-emerald-400" />
                   </div>
                   <div>
                       <div className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Base Salary</div>
                       <div className="text-xl font-bold">{offer.salary}</div>
                   </div>
                </div>

                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                       <Calendar size={20} className="text-primary" />
                   </div>
                   <div>
                       <div className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Joining Date</div>
                       <div className="text-xl font-bold">{new Date(offer.start_date).toLocaleDateString()}</div>
                   </div>
                </div>

                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                       <Briefcase size={20} className="text-amber-400" />
                   </div>
                   <div>
                       <div className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Contract Type</div>
                       <div className="text-xl font-bold">{offer.contract_type}</div>
                   </div>
                </div>
             </div>

             <div className="mt-10 space-y-3">
                <button 
                    className="btn btn-primary w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-lg border-none shadow-lg shadow-emerald-500/20"
                    onClick={handleAccept}
                    disabled={processing || offer.is_offer_accepted}
                >
                    {offer.is_offer_accepted ? 'Offer Accepted' : processing ? 'Accepting...' : 'Accept Job Offer'}
                </button>
                <button className="btn btn-outline border-white/10 text-slate-400 hover:bg-white/5 w-full py-3" disabled={offer.is_offer_accepted}>
                    Decline Offer
                </button>
             </div>
          </section>

          <section className="bg-white rounded-3xl p-6 border border-slate-100">
             <div className="flex gap-4 mb-4">
                <button className="flex-1 btn btn-outline py-3 flex items-center justify-center gap-2"><Download size={16} /> PDF</button>
                <button className="flex-1 btn btn-outline py-3 flex items-center justify-center gap-2"><Printer size={16} /> Print</button>
             </div>
             <p className="text-[10px] text-center text-slate-400">Offer valid for 7 working days from date of issue.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default OfferLetter;
