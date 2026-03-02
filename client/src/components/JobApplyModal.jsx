import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles, FileText, CheckCircle2, ChevronDown, RotateCcw, Upload, AlertCircle, FileDigit } from "lucide-react";

/**
 * JobApplyModal - Premium Application Studio with AI Proposal Integration
 */
const JobApplyModal = ({ isOpen, onClose, job, userSkills }) => {
  const [tone, setTone] = useState("Professional");
  const [length, setLength] = useState("Medium");
  const [proposal, setProposal] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1); // 1: Proposal, 2: Attachments/Finalize
  const [aiMatchScore, setAiMatchScore] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen && job) {
      calculateMatch();
      fetchUserProfile();
    }
    // Reset when modal opens
    if (isOpen) {
      setStep(1);
      setProposal("");
    }
  }, [isOpen, job]);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserProfile(res.data);
    } catch (err) {
      console.error("Failed to fetch profile", err);
    }
  };

  const calculateMatch = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`/api/ai/match/${job.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAiMatchScore(res.data.score);
    } catch (err) {
      console.error("Match calculation failed", err);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post("/api/upload", formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      // Update user profile with new resume URL
      const updateRes = await axios.put("/api/users/profile", 
        { ...userProfile, resume_url: res.data.url },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUserProfile(prev => ({ ...prev, resume_url: res.data.url }));
    } catch (err) {
      alert("Resume upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleGenerateAI = async () => {
    try {
      setIsGenerating(true);
      const token = localStorage.getItem("token");
      const res = await axios.post(`/api/ai/proposal/advanced/${job.id}`, 
        { tone, length },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProposal(res.data.proposal);
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.response?.data?.message || "AI Generation failed. Please try again.";
      alert(errorMsg);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");
      await axios.post("/api/applications", 
        { 
          job_id: job.id, 
          proposal 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onClose(true); // Signal success
    } catch (err) {
      alert(err.response?.data?.error || "Application failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const resumeName = userProfile?.resume_url 
    ? userProfile.resume_url.split('/').pop() 
    : null;

  return (
    <div className="modal-overlay" style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', 
      justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)'
    }}>
      <motion.div 
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        className="modal-container"
        style={{
          background: 'white', borderRadius: '24px', width: '100%', 
          maxWidth: '700px', maxHeight: '90vh', overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', position: 'relative'
        }}
      >
        {/* Header */}
        <div style={{ padding: '24px 32px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#0f172a', fontFamily: 'Outfit' }}>
              Apply for {job?.title}
            </h2>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>
              At {job?.company} {aiMatchScore !== null ? `• ${aiMatchScore}% AI Match` : ''}
            </p>
          </div>
          <button onClick={() => onClose()} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', p: '8px', cursor: 'pointer', color: '#64748b' }}>
            <X size={20} />
          </button>
        </div>

        {/* Status Stepper */}
        <div style={{ padding: '20px 32px', display: 'flex', gap: '8px' }}>
          <div style={{ flex: 1, height: '4px', borderRadius: '2px', background: step >= 1 ? '#0057D9' : '#f1f5f9' }}></div>
          <div style={{ flex: 1, height: '4px', borderRadius: '2px', background: step >= 2 ? '#0057D9' : '#f1f5f9' }}></div>
        </div>

        <div style={{ padding: '0 32px 32px 32px', overflowY: 'auto', maxHeight: 'calc(90vh - 180px)' }}>
          {step === 1 ? (
            <div className="step-proposal">
              {/* AI Controls */}
              <div style={{ background: '#eff6ff', borderRadius: '16px', padding: '20px', marginBottom: '24px', border: '1px solid #dbeafe' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <Sparkles size={18} style={{ color: '#2563eb' }} />
                  <span style={{ fontWeight: 700, fontSize: '14px', color: '#1e40af' }}>AI Proposal Assistant</span>
                </div>
                
                <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#64748b', marginBottom: '6px' }}>Tone</label>
                    <select 
                      value={tone} 
                      onChange={(e) => setTone(e.target.value)}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                    >
                      <option>Professional</option>
                      <option>Confident</option>
                      <option>Friendly</option>
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#64748b', marginBottom: '6px' }}>Length</label>
                    <select 
                      value={length} 
                      onChange={(e) => setLength(e.target.value)}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                    >
                      <option>Short</option>
                      <option>Medium</option>
                      <option>Long</option>
                    </select>
                  </div>
                </div>

                <button 
                  onClick={handleGenerateAI}
                  disabled={isGenerating}
                  style={{
                    width: '100%', padding: '12px', borderRadius: '12px', border: 'none',
                    background: '#2563eb', color: 'white', fontWeight: 700, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)'
                  }}
                >
                  {isGenerating ? "Analyzing & Generating..." : "Generate AI Proposal"}
                </button>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#64748b', marginBottom: '8px' }}>Your Pitch</label>
                <textarea 
                  value={proposal}
                  onChange={(e) => setProposal(e.target.value)}
                  placeholder="Tell the recruiter why you're a great fit..."
                  style={{
                    width: '100%', minHeight: '180px', padding: '16px', borderRadius: '16px',
                    border: '1px solid #e2e8f0', fontFamily: 'inherit', fontSize: '14px', lineHeight: '1.6',
                    resize: 'none', background: '#f8fafc'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button 
                  onClick={() => onClose()}
                  style={{ padding: '12px 24px', borderRadius: '12px', border: 'none', background: 'transparent', color: '#64748b', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  onClick={() => setStep(2)}
                  disabled={!proposal.trim()}
                  style={{
                    padding: '12px 32px', borderRadius: '12px', border: 'none',
                    background: '#0f172a', color: 'white', fontWeight: 700, cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  Next Step
                </button>
              </div>
            </div>
          ) : (
            <div className="step-finalize">
              <div style={{ background: '#f8fafc', borderRadius: '20px', padding: '24px', marginBottom: '24px', border: '1px solid #f1f5f9' }}>
                <h4 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Application Summary</h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ 
                    display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', 
                    background: 'white', borderRadius: '16px', border: '1px solid #f1f5f9',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                  }}>
                    <div style={{ 
                      width: '40px', height: '40px', borderRadius: '12px', 
                      background: resumeName ? '#dcfce7' : '#fef2f2', 
                      color: resumeName ? '#16a34a' : '#ef4444', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center' 
                    }}>
                      {resumeName ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontSize: '14px', fontWeight: 700 }}>
                        {resumeName ? "Resume Attached" : "Resume Required"}
                      </p>
                      <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                        {resumeName || "No resume found in your profile"}
                      </p>
                    </div>
                    
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileUpload} 
                      style={{ display: 'none' }} 
                      accept=".pdf,.doc,.docx"
                    />
                    
                    <button 
                      onClick={() => fileInputRef.current.click()}
                      disabled={isUploading}
                      style={{
                        padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0',
                        background: 'white', color: '#0f172a', fontSize: '12px', fontWeight: 700,
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
                      }}
                    >
                      {isUploading ? "Uploading..." : (
                        <>
                          <Upload size={14} /> {resumeName ? "Replace" : "Upload"}
                        </>
                      )}
                    </button>
                  </div>

                  <div style={{ 
                    display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', 
                    background: 'white', borderRadius: '16px', border: '1px solid #f1f5f9',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                  }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Sparkles size={20} />
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: '14px', fontWeight: 700 }}>AI Match Analysis</p>
                      <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>{aiMatchScore}% match with role requirements</p>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ background: '#fff7ed', borderRadius: '16px', padding: '16px', marginBottom: '32px', border: '1px solid #ffedd5' }}>
                  <p style={{ margin: 0, fontSize: '12px', color: '#9a3412', lineHeight: '1.5' }}>
                    <strong>Note:</strong> By submitting, you allow {job?.company} to view your full profile and portfolio items.
                  </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button 
                  onClick={() => setStep(1)}
                  style={{ padding: '12px 24px', borderRadius: '12px', border: 'none', background: 'transparent', color: '#64748b', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <RotateCcw size={16} /> Back to Edit
                </button>
                <button 
                  onClick={handleSubmit}
                  disabled={isSubmitting || !resumeName}
                  style={{
                    padding: '12px 40px', borderRadius: '12px', border: 'none',
                    background: resumeName ? '#0057D9' : '#94a3b8', 
                    color: 'white', fontWeight: 700, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '8px', 
                    boxShadow: resumeName ? '0 4px 12px rgba(0, 87, 217, 0.2)' : 'none'
                  }}
                >
                  {isSubmitting ? "Submitting..." : (
                    <>
                      Submit Application <Send size={18} />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default JobApplyModal;
