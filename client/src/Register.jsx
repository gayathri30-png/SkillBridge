import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("student");
  const [terms, setTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!terms) {
      setError("Please agree to the Terms & Conditions.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("/api/auth/register", {
        name,
        email,
        password,
        role,
        location,
        phone,
        company: role === 'recruiter' ? company : undefined
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      window.dispatchEvent(new Event("storage"));

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Registration Failed");
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* LEFT SIDE - BRANDING */}
      <div className="auth-branding">
        <div className="auth-branding-content">
          <h1 className="auth-logo">SkillBridge</h1>
          <p className="auth-tagline">Start your career journey here</p>

          <div className="auth-testimonial">
            <p>"Joining SkillBridge was the best decision for my company. I can find qualified students for our internships in seconds."</p>
            <div className="auth-testimonial-author">— Michael Roberts, Tech Director</div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - FORM */}
      <div className="auth-form-container">
        <div className="auth-form-header">
          <h2>Create Your Account</h2>
          <p>Join thousands of professionals on SkillBridge.</p>
        </div>

        {error && <div className="error-alert mb-6 p-4 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100">{error}</div>}

        <form onSubmit={handleRegister}>
          {/* ROLE SELECTION */}
          <div className="role-tabs">
            <div
              className={`role-card ${role === 'student' ? 'active' : ''}`}
              onClick={() => setRole('student')}
            >
              <span className="role-icon">👨‍🎓</span>
              <h4>Student</h4>
              <p>Looking for jobs</p>
            </div>
            <div
              className={`role-card ${role === 'recruiter' ? 'active' : ''}`}
              onClick={() => setRole('recruiter')}
            >
              <span className="role-icon">💼</span>
              <h4>Recruiter</h4>
              <p>Hiring talent</p>
            </div>
          </div>

          <div className="floating-group">
            <input
              type="text"
              className="floating-input"
              placeholder=" "
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <label className="floating-label">Full Name</label>
          </div>

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
              type="password"
              className="floating-input"
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label className="floating-label">Password</label>
          </div>

          {role === 'recruiter' && (
            <div className="floating-group fade-in">
              <input
                type="text"
                className="floating-input"
                placeholder=" "
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
              />
              <label className="floating-label">Company Name</label>
            </div>
          )}

          <div className="flex gap-4">
            <div className="floating-group flex-1">
              <input
                type="text"
                className="floating-input"
                placeholder=" "
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <label className="floating-label">Location</label>
            </div>
            <div className="floating-group flex-1">
              <input
                type="tel"
                className="floating-input"
                placeholder=" "
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <label className="floating-label">Phone (Optional)</label>
            </div>
          </div>

          <div className="auth-extras">
            <label className="checkbox-group">
              <input
                type="checkbox"
                checked={terms}
                onChange={(e) => setTerms(e.target.checked)}
              />
              I agree to the Terms & Conditions
            </label>
          </div>

          <button type="submit" className="btn-primary-auth" disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="auth-switch">
          Already have an account? <span onClick={() => navigate("/login")}>Login here</span>
        </div>
      </div>
    </div>
  );
}

export default Register;
