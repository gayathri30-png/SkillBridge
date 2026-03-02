import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from "framer-motion";
import { Mail, ArrowRight, Zap, ShieldCheck, ChevronLeft } from "lucide-react";
import "../AuthPages.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
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
      const { data } = await axios.post('/api/auth/forgot-password', { email });
      if (data.success) {
        setMessage('Password reset link sent to your email.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
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
            <p>Enter your email and we'll send a secure reset link.</p>
          </div>

          {message && (
            <div className="auth-alert bg-green-50 text-green-600 border border-green-100">
               <ShieldCheck size={18} /> {message}
            </div>
          )}
          {error && (
            <div className="auth-alert error">
               <ShieldCheck size={18} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="floating-group">
              <input 
                type="email" 
                className="floating-input"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label className="floating-label">Email Address</label>
              <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            </div>

            <button 
              type="submit" 
              className="auth-btn-primary"
              disabled={loading}
            >
              {loading ? "Sending link..." : (
                <>
                  Send Reset Link <ArrowRight size={18} />
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
