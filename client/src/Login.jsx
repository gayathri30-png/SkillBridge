import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Eye, EyeOff, Mail, Lock, Check, 
  ArrowRight, Github, Globe, MessageSquare,
  Award, Zap, ShieldCheck
} from "lucide-react";
import "./AuthPages.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      window.dispatchEvent(new Event("storage"));

      if (res.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Login Failed. Please check your credentials.");
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
          <h1 className="auth-branding-title">Connect to your professional future.</h1>
          <p className="auth-branding-tagline">
            SkillBridge is your intelligent bridge connecting top student talent to exclusive industry opportunities.
          </p>

          <div className="auth-illustration-box">
             {/* Abstract CSS Bridge Graphic */}
             <div className="relative w-full h-64 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-3xl overflow-hidden border border-white/10 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center justify-center opacity-50">
                   <div className="w-64 h-64 border-2 border-blue-500/30 rounded-full animate-ping"></div>
                </div>
                <div className="z-10 text-center">
                   <div className="text-6xl mb-4">🌉</div>
                   <div className="text-sm font-bold tracking-widest text-blue-400 uppercase">Seamless Connectivity</div>
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
              "SkillBridge didn't just find me an internship; it matched me with a role that perfectly aligned with my specific tech stack and career goals."
            </p>
            <div className="testimonial-author">
              <div className="author-avatar flex items-center justify-center text-xs font-bold text-slate-400">SR</div>
              <div className="author-info">
                <h4>Sarah Richards</h4>
                <p>Full-Stack Developer @ FinTech flow</p>
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
          <div className="auth-form-header text-center lg:text-left">
            <h2>Welcome Back</h2>
            <p>Enter your credentials to access your dashboard.</p>
          </div>

          {error && (
            <div className="auth-alert error">
              <ShieldCheck size={18} /> {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="auth-form">
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

            <div className="floating-group">
              <input 
                type={showPassword ? "text" : "password"}
                className="floating-input"
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label className="floating-label">Password</label>
              <div className="pass-toggle" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>

            <div className="form-extras">
              <label className="remember-me">
                <input 
                  type="checkbox" 
                  className="checkbox-custom"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                Remember me
              </label>
              <a href="/forgot-password" onClick={(e) => { e.preventDefault(); navigate("/forgot-password"); }} className="forgot-pass">
                Forgot password?
              </a>
            </div>

            <button 
              type="submit" 
              className="auth-btn-primary"
              disabled={loading}
            >
              {loading ? "Verifying..." : (
                <>
                  Log In <ArrowRight size={18} />
                </>
              )}
            </button>

            <div className="auth-divider">
              <span>or continue with</span>
            </div>

            <button type="button" className="auth-btn-social">
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/smartlock/google.svg" width="18" height="18" alt="Google" />
              Sign in with Google
            </button>
          </form>

          <p className="auth-footer">
            Don't have an account? 
            <a href="/register" onClick={(e) => { e.preventDefault(); navigate("/register"); }} className="auth-link">
               Create one for free
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;
