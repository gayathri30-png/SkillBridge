import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from "framer-motion";
import { Mail, ArrowRight, Zap, ShieldCheck, ChevronLeft, AlertCircle } from "lucide-react";
import "../AuthPages.css";

const ForgotPassword = () => {
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const { data } = await axios.post('/api/auth/verify-phone', { phone });
      if (data.success) {
        setMessage('Phone number verified. Redirecting...');
        setTimeout(() => {
          navigate(`/reset-password?phone=${phone}`);
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'No account found with that phone number');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      {/* Branding Side */}
      <motion.div 
        className="auth-branding-side"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="auth-logo-container">
          <div className="auth-logo">
            <div className="logo-icon">
              <Zap size={24} color="white" fill="white" />
            </div>
            <span>SkillBridge</span>
          </div>
        </div>
        <div className="auth-branding-content">
          <h1 className="auth-branding-title">Secure your professional bridge.</h1>
          <p className="auth-branding-tagline">
            We use industry-standard encryption to ensure your data and access remain protected at all times.
          </p>
        </div>
      </motion.div>

      {/* Form Side */}
      <div className="auth-form-side">
        <motion.div 
          className="auth-form-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="mb-8">
            <button 
              onClick={() => navigate("/login")}
              className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors"
            >
              <ChevronLeft size={16} /> Back to Login
            </button>
          </div>

          <div className="auth-form-header">
            <h2>Forgot Password?</h2>
            <p>Enter your registered phone number to reset your password.</p>
          </div>

          {message && (
            <div className="auth-alert bg-green-50 text-green-600 border border-green-100">
               <ShieldCheck size={18} /> {message}
            </div>
          )}
          {error && (
            <div className="auth-alert error">
               <AlertCircle size={18} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="floating-group">
              <input 
                type="text" 
                className="floating-input"
                placeholder=" "
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              <label className="floating-label">Phone Number</label>
            </div>

            <button 
              type="submit" 
              className="auth-btn-primary"
              disabled={loading}
            >
              {loading ? "Verifying..." : (
                <>
                  Verify Phone Number <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
