import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

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
    <div className="auth-page">
      {/* LEFT SIDE - BRANDING */}
      <div className="auth-branding">
        <div className="auth-branding-content">
          <h1 className="auth-logo">SkillBridge</h1>
          <p className="auth-tagline">Your bridge to opportunities</p>

          <div className="auth-testimonial">
            <p>"SkillBridge helped me find my dream engineering job in just two weeks. The matching algorithm is truly state-of-the-art."</p>
            <div className="auth-testimonial-author">— Sarah Chen, Software Engineer</div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - FORM */}
      <div className="auth-form-container">
        <div className="auth-form-header">
          <h2>Welcome Back</h2>
          <p>Please enter your details to sign in.</p>
        </div>

        {error && <div className="error-alert mb-6 p-4 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100">{error}</div>}

        <form onSubmit={handleLogin}>
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
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <div className="auth-extras">
            <label className="checkbox-group">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>
            <span onClick={() => navigate("/forgot-password")} className="forgot-link cursor-pointer">
              Forgot Password?
            </span>
          </div>

          <button type="submit" className="btn-primary-auth" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <div className="auth-divider">or</div>

          <button type="button" className="btn-google">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/0/google.svg" alt="Google" width="18" />
            Sign in with Google
          </button>
        </form>

        <div className="auth-switch">
          Don't have an account? <span onClick={() => navigate("/register")}>Sign up for free</span>
        </div>
      </div>
    </div>
  );
}

export default Login;
