import React from "react";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      {/* Navigation */}
      <nav style={styles.nav}>
        <div style={styles.logo}>SkillBridge</div>
        <div style={styles.navLinks}>
          <button onClick={() => navigate("/login")} style={styles.loginBtn}>
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            style={styles.registerBtn}
          >
            Register
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>
            SkillBridge – AI Powered Talent Platform
          </h1>
          <p style={styles.heroSubtitle}>
            Connecting skills to opportunities using intelligent matching. Stop
            relying on resumes. Start hiring for skills.
          </p>
          <div style={styles.ctaGroup}>
            <button
              onClick={() => navigate("/register")}
              style={styles.primaryBtn}
            >
              I'm a Student
            </button>
            <button
              onClick={() => navigate("/register")}
              style={styles.secondaryBtn}
            >
              I'm a Recruiter
            </button>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section style={styles.features}>
        <div style={styles.featureCard}>
          <div style={styles.icon}>🎯</div>
          <h3 style={styles.featureTitle}>Skill-Based Matching</h3>
          <p style={styles.featureDesc}>
            Our system filters candidates based on verified skills and proficiency
            levels, ensuring the perfect fit.
          </p>
        </div>

        <div style={styles.featureCard}>
          <div style={styles.icon}>🤖</div>
          <h3 style={styles.featureTitle}>AI Match Score</h3>
          <p style={styles.featureDesc}>
            Get an instant compatibility score for every applicant relative to the
            job requirements.
          </p>
        </div>

        <div style={styles.featureCard}>
          <div style={styles.icon}>⚡</div>
          <h3 style={styles.featureTitle}>Faster Hiring</h3>
          <p style={styles.featureDesc}>
            Recruiters save time by viewing a ranked list of top candidates
            instead of sifting through resumes.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>&copy; 2026 SkillBridge. All rights reserved.</p>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: "#333",
    backgroundColor: "#ffffff",
  },
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 40px",
    backgroundColor: "#ffffff",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },
  logo: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#4f46e5", // Indigo-600
  },
  navLinks: {
    display: "flex",
    gap: "15px",
  },
  loginBtn: {
    padding: "8px 20px",
    backgroundColor: "transparent",
    border: "1px solid #4f46e5",
    color: "#4f46e5",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500",
    transition: "all 0.2s",
  },
  registerBtn: {
    padding: "8px 20px",
    backgroundColor: "#4f46e5",
    border: "none",
    color: "white",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500",
    transition: "background-color 0.2s",
  },
  hero: {
    textAlign: "center",
    padding: "100px 20px",
    backgroundColor: "#f9fafb", // Very light grey
  },
  heroContent: {
    maxWidth: "800px",
    margin: "0 auto",
  },
  heroTitle: {
    fontSize: "48px",
    fontWeight: "800",
    color: "#111827",
    marginBottom: "20px",
    lineHeight: "1.2",
  },
  heroSubtitle: {
    fontSize: "20px",
    color: "#6b7280",
    marginBottom: "40px",
    lineHeight: "1.5",
  },
  ctaGroup: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
  },
  primaryBtn: {
    padding: "15px 30px",
    backgroundColor: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "18px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 4px 6px rgba(79, 70, 229, 0.3)",
    transition: "transform 0.1s",
  },
  secondaryBtn: {
    padding: "15px 30px",
    backgroundColor: "#ffffff",
    color: "#4f46e5",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "18px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.1s",
  },
  features: {
    padding: "80px 40px",
    display: "flex",
    justifyContent: "center",
    gap: "40px",
    flexWrap: "wrap",
    backgroundColor: "#ffffff",
  },
  featureCard: {
    flex: "1 1 300px",
    maxWidth: "350px",
    padding: "30px",
    borderRadius: "12px",
    backgroundColor: "#ffffff",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    border: "1px solid #e5e7eb",
    textAlign: "center",
    transition: "transform 0.2s",
  },
  icon: {
    fontSize: "40px",
    marginBottom: "20px",
  },
  featureTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: "10px",
  },
  featureDesc: {
    color: "#6b7280",
    lineHeight: "1.6",
  },
  footer: {
    padding: "40px",
    textAlign: "center",
    backgroundColor: "#1f2937", // Dark
    color: "#9ca3af",
    fontSize: "14px",
  },
};

export default LandingPage;
