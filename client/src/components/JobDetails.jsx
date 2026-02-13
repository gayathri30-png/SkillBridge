import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./JobDetails.css";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [applying, setApplying] = useState(false);
  const [proposal, setProposal] = useState("");

  const fetchJobDetails = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`/api/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJob(response.data);
    } catch (err) {
      setError("Failed to load job details");
      console.error("Error fetching job details:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchJobDetails();
  }, [fetchJobDetails]);

  const handleApply = async () => {
    if (!proposal.trim()) {
      alert("Please write a proposal first.");
      return;
    }

    try {
      setApplying(true);
      const token = localStorage.getItem("token");
      await axios.post(
        `/api/applications/apply`,
        { job_id: id, proposal: proposal },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Application submitted successfully!");
      navigate('/applications');
    } catch (err) {
      alert(err.response?.data?.error || "Failed to apply");
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading job details...</div>;
  if (error || !job) return (
    <div className="p-8 text-center">
      <h3 className="text-error mb-4">{error || "Job not found"}</h3>
      <button className="btn btn-primary" onClick={() => navigate("/jobs")}>Back to Jobs</button>
    </div>
  );

  return (
    <div className="job-details-view fade-in">
      {/* Back Link */}
      <button className="back-link-btn mb-6" onClick={() => navigate("/jobs")}>
         ← Back to Jobs
      </button>

      <div className="job-details-card card overflow-hidden max-w-4xl mx-auto shadow-xl">
        {/* Job Hero Header */}
        <div className="job-hero p-10 bg-slate-900 text-white relative">
           <div className="relative z-10">
              <div className="flex gap-2 mb-6">
                <span className="badge badge-primary">{job.job_type}</span>
                <span className="badge badge-success bg-opacity-20 border-0">{job.experience_level}</span>
              </div>
              <h1 className="text-white text-4xl mb-4">{job.title}</h1>
              <div className="flex gap-8 text-sm text-slate-400">
                 <span className="flex items-center gap-2">🏢 {job.recruiter_name || "Premium Partner"}</span>
                 <span className="flex items-center gap-2">📍 {job.location || "Remote"}</span>
                 <span className="flex items-center gap-2">🕒 Posted {new Date(job.created_at).toLocaleDateString()}</span>
              </div>
           </div>
           <div className="absolute top-10 right-10 text-right">
              <p className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-1">Project Budget</p>
              <h2 className="text-primary text-3xl font-bold">${job.budget}</h2>
           </div>
           <div className="absolute right-0 bottom-0 text-9xl leading-none opacity-5 tracking-tighter">JOB</div>
        </div>

        <div className="p-10 space-y-12">
           {/* Summary Perks */}
           <div className="grid grid-cols-3 gap-6 border-bottom pb-10">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-primary-soft text-primary flex items-center justify-center text-xl">🚀</div>
                 <div>
                    <h5 className="m-0">Fast Apply</h5>
                    <p className="text-xs text-slate-500 m-0">Apply in 1-click</p>
                 </div>
              </div>
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-success-soft text-success flex items-center justify-center text-xl">🛡️</div>
                 <div>
                    <h5 className="m-0">Verified</h5>
                    <p className="text-xs text-slate-500 m-0">SkillBridge Protected</p>
                 </div>
              </div>
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-warning-soft text-warning flex items-center justify-center text-xl">💎</div>
                 <div>
                    <h5 className="m-0">AI Check</h5>
                    <p className="text-xs text-slate-500 m-0">High Match Score</p>
                 </div>
              </div>
           </div>

           {/* Description */}
           <section className="job-description-section">
              <h3 className="section-title mb-6">Job Description</h3>
              <div className="prose text-slate-600 leading-relaxed space-y-4">
                {job.description.split('\n').map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
           </section>

           {/* Skills */}
           <section>
              <h3 className="section-title mb-6">Expected Skills</h3>
              <div className="flex flex-wrap gap-3">
                 {['React', 'Node.js', 'Typescript', 'System Design'].map(s => (
                   <span key={s} className="chip chip-info py-2 px-4">{s}</span>
                 ))}
              </div>
           </section>

           {/* Apply Form */}
           <section className="apply-form-section bg-slate-50 p-8 rounded-2xl border">
              <h3 className="mb-6">Ready to apply?</h3>
              <div className="space-y-4">
                 <label className="text-sm font-bold text-slate-700 block">Why are you a good fit?</label>
                 <textarea 
                    className="input-field min-h-[150px] resize-none p-4"
                    placeholder="Describe your relevant experience and how you can help..."
                    value={proposal}
                    onChange={(e) => setProposal(e.target.value)}
                 ></textarea>
                 <div className="pt-4 flex justify-end">
                    <button 
                      className="btn btn-primary btn-lg px-12"
                      onClick={handleApply}
                      disabled={applying || !proposal.trim()}
                    >
                      {applying ? "Submitting..." : "Submit Application"}
                    </button>
                 </div>
              </div>
           </section>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;

