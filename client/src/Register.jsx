import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("/api/auth/register", {
        name,
        email,
        password,
        role,
      });
      
      // Auto-login after registration
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
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.subtitle}>Join SkillBridge today</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleRegister} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>I am a:</label>
            <div style={styles.radioGroup}>
              <label style={role === "student" ? styles.radioSelected : styles.radioOption}>
                <input
                  type="radio"
                  value="student"
                  checked={role === "student"}
                  onChange={(e) => setRole(e.target.value)}
                  style={{ marginRight: "8px" }}
                />
                Student
              </label>
              <label style={role === "recruiter" ? styles.radioSelected : styles.radioOption}>
                <input
                  type="radio"
                  value="recruiter"
                  checked={role === "recruiter"}
                  onChange={(e) => setRole(e.target.value)}
                  style={{ marginRight: "8px" }}
                />
                Recruiter
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <div style={styles.footer}>
          <p>
            Already have an account?{" "}
            <span onClick={() => navigate("/login")} style={styles.link}>
              Login here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f4f6", // Light grey background
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: "400px",
    padding: "40px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  },
  title: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#111827",
    textAlign: "center",
    marginBottom: "8px",
  },
  subtitle: {
    fontSize: "14px",
    color: "#6b7280",
    textAlign: "center",
    marginBottom: "32px",
  },
  error: {
    backgroundColor: "#fef2f2",
    color: "#991b1b",
    padding: "12px",
    borderRadius: "6px",
    fontSize: "14px",
    marginBottom: "24px",
    textAlign: "center",
    border: "1px solid #fecaca",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#374151",
  },
  input: {
    padding: "10px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    fontSize: "16px",
    outline: "none",
    transition: "border-color 0.2s",
  },
  radioGroup: {
    display: "flex",
    gap: "16px",
  },
  radioOption: {
    flex: 1,
    padding: "10px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    transition: "all 0.2s",
  },
  radioSelected: {
    flex: 1,
    padding: "10px",
    border: "1px solid #4f46e5",
    backgroundColor: "#eef2ff",
    borderRadius: "6px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    fontWeight: "500",
    color: "#4f46e5",
    transition: "all 0.2s",
  },
  button: {
    backgroundColor: "#4f46e5", // Indigo-600
    color: "white",
    padding: "12px",
    borderRadius: "6px",
    fontSize: "16px",
    fontWeight: "500",
    border: "none",
    marginTop: "8px",
    transition: "background-color 0.2s",
  },
  footer: {
    marginTop: "24px",
    textAlign: "center",
    fontSize: "14px",
    color: "#6b7280",
  },
  link: {
    color: "#4f46e5",
    fontWeight: "500",
    cursor: "pointer",
    textDecoration: "none",
  },
};

export default Register;
