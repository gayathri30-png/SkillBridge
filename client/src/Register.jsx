import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Mail, Lock, Phone, MapPin, 
  Building, CheckCircle2, ArrowRight, Zap,
  ShieldCheck, Eye, EyeOff, GraduationCap, Briefcase
} from "lucide-react";
import "./AuthPages.css";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    location: "",
    company_name: "",
    role: "student",
    termsAccepted: false
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!formData.termsAccepted) {
      setError("Please accept the Terms & Conditions");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("/api/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        phone: formData.phone,
        location: formData.location,
        company_name: formData.role === 'recruiter' ? formData.company_name : undefined
      });
      
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      window.dispatchEvent(new Event("storage"));
      
      navigate("/dashboard");
    } catch (err) {
      console.error("❌ Registration error:", err);
      setError(err.response?.data?.error || "Registration Failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      {/* --- Left Branding Side --- */}
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
          <h1 className="auth-branding-title">Begin your professional journey.</h1>
          <p className="auth-branding-tagline">
            SkillBridge is your intelligent bridge connecting top student talent to exclusive industry opportunities.
          </p>

          <div className="auth-illustration-box">
             <div className="relative w-full h-64 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 rounded-3xl overflow-hidden border border-white/10 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center justify-center opacity-50">
                   <div className="w-64 h-64 border-2 border-indigo-500/30 rounded-full animate-pulse"></div>
                </div>
                <div className="z-10 text-center">
                   <div className="text-6xl mb-4">🚀</div>
                   <div className="text-sm font-bold tracking-widest text-indigo-400 uppercase">Career Acceleration</div>
                </div>
             </div>
          </div>

          <motion.div 
            className="auth-testimonial"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <p className="testimonial-text">
              "The registration process was seamless, and within hours I had recruiters reaching out for roles I didn't even know existed."
            </p>
            <div className="testimonial-author">
              <div className="author-avatar flex items-center justify-center text-xs font-bold text-indigo-400">MK</div>
              <div className="author-info">
                <h4>Marcus K.</h4>
                <p>UI Engineering Intern @ DesignCore</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* --- Right Form Side --- */}
      <div className="auth-form-side">
        <motion.div 
          className="auth-form-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="auth-form-header">
            <h2>Create Your Account</h2>
            <p>Select your profile type to get started.</p>
          </div>

          {error && (
            <div className="auth-alert error">
              <ShieldCheck size={18} /> {error}
            </div>
          )}

          <div className="role-cards-container">
            <motion.div 
              className={`role-card ${formData.role === 'student' ? 'active' : ''}`}
              onClick={() => setFormData(prev => ({...prev, role: 'student'}))}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <GraduationCap className={`role-icon ${formData.role === 'student' ? 'text-blue-600' : 'text-slate-400'}`} size={32} />
              <h4>Student</h4>
              <p>Find matches and grow skills</p>
              {formData.role === 'student' && <div className="absolute top-3 right-3 text-blue-600"><CheckCircle2 size={16} /></div>}
            </motion.div>

            <motion.div 
              className={`role-card ${formData.role === 'recruiter' ? 'active' : ''}`}
              onClick={() => setFormData(prev => ({...prev, role: 'recruiter'}))}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Briefcase className={`role-icon ${formData.role === 'recruiter' ? 'text-blue-600' : 'text-slate-400'}`} size={32} />
              <h4>Recruiter</h4>
              <p>Hire top industry talent</p>
              {formData.role === 'recruiter' && <div className="absolute top-3 right-3 text-blue-600"><CheckCircle2 size={16} /></div>}
            </motion.div>
          </div>

          <form onSubmit={handleRegister} className="auth-form">
            <div className="floating-group">
              <input 
                type="text" 
                name="name"
                className="floating-input"
                placeholder=" "
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <label className="floating-label">Full Name</label>
              <User className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            </div>

            <div className="floating-group">
              <input 
                type="email" 
                name="email"
                className="floating-input"
                placeholder=" "
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <label className="floating-label">Email Address</label>
              <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="floating-group">
                <input 
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="floating-input"
                  placeholder=" "
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <label className="floating-label">Password</label>
                <div className="pass-toggle" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </div>
              </div>

              <div className="floating-group">
                <input 
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  className="floating-input"
                  placeholder=" "
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
                <label className="floating-label">Confirm</label>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {formData.role === 'recruiter' && (
                <motion.div 
                  className="floating-group"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <input 
                    type="text" 
                    name="company_name"
                    className="floating-input"
                    placeholder=" "
                    value={formData.company_name}
                    onChange={handleInputChange}
                    required={formData.role === 'recruiter'}
                  />
                  <label className="floating-label">Company Name</label>
                  <Building className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-2 gap-4">
              <div className="floating-group">
                <input 
                  type="text" 
                  name="phone"
                  className="floating-input"
                  placeholder=" "
                  value={formData.phone}
                  onChange={handleInputChange}
                />
                <label className="floating-label">Phone (Optional)</label>
                <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              </div>

              <div className="floating-group">
                <input 
                  type="text" 
                  name="location"
                  className="floating-input"
                  placeholder=" "
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
                <label className="floating-label">Location</label>
                <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              </div>
            </div>

            <div className="form-extras">
              <label className="remember-me">
                <input 
                  type="checkbox" 
                  name="termsAccepted"
                  className="checkbox-custom"
                  checked={formData.termsAccepted}
                  onChange={handleInputChange}
                />
                Agree to Terms & Conditions
              </label>
            </div>

            <button 
              type="submit" 
              className="auth-btn-primary"
              disabled={loading}
            >
              {loading ? "Creating Account..." : (
                <>
                  Get Started <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <p className="auth-footer">
            Already have an account? 
            <a href="/login" onClick={(e) => { e.preventDefault(); navigate("/login"); }} className="auth-link">
               Log In
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default Register;
