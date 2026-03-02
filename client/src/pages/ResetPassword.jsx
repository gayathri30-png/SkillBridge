import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from "framer-motion";
import { Lock, ArrowRight, Zap, ShieldCheck, Eye, EyeOff } from "lucide-react";
import "../AuthPages.css";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(`/api/auth/reset-password/${token}`, { password });
      if (data.success) {
        setMessage('Password reset successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
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
          <h1 className="auth-branding-title">Update your credentials.</h1>
          <p className="auth-branding-tagline">
            Ensure your account is protected with a strong, memorable password that hasn't been used elsewhere.
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
          <div className="auth-form-header">
            <h2>Reset Your Password</h2>
            <p>Enter your new password below.</p>
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
                type={showPassword ? "text" : "password"}
                className="floating-input"
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label className="floating-label">New Password</label>
              <div className="pass-toggle" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>

            <div className="floating-group">
              <input 
                type={showPassword ? "text" : "password"}
                className="floating-input"
                placeholder=" "
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <label className="floating-label">Confirm Password</label>
            </div>

            <button 
              type="submit" 
              className="auth-btn-primary"
              disabled={loading}
            >
              {loading ? "Resetting..." : (
                <>
                  Reset Password <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <p className="auth-footer">
             <Link to="/login" className="auth-link">
               Back to Login
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPassword;
