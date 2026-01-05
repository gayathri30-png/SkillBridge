import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    console.log("🔄 Login attempt started...");

    try {
      const res = await axios.post("http://localhost:5001/api/auth/login", {
        email,
        password,
      });

      console.log("✅ Login API response received!");
      console.log("Token received:", res.data.token ? "YES" : "NO");
      console.log("User data received:", res.data.user);

      // 1. Save to localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      console.log("✅ Token saved to localStorage");

      // 2. CRITICAL: Trigger storage event to update App.js
      window.dispatchEvent(new Event("storage"));

      console.log("✅ Storage event dispatched");

      // 3. Small delay to ensure state updates
      setTimeout(() => {
        console.log("🔄 Redirecting to dashboard...");
        navigate("/dashboard");
      }, 50);
    } catch (err) {
      console.error("❌ Login error:", err);
      setError(err.response?.data?.error || "Login Failed");
      setLoading(false);
    }
  };

  const goToRegister = () => {
    navigate("/register");
  };

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "400px",
        margin: "auto",
        marginTop: "50px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ textAlign: "center", color: "#333" }}>
        Login to SkillBridge
      </h2>

      {error && (
        <div
          style={{
            background: "#ffebee",
            color: "#c62828",
            padding: "10px",
            borderRadius: "5px",
            marginBottom: "15px",
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: "15px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
            }}
          >
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "5px",
              fontSize: "16px",
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
            }}
          >
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "5px",
              fontSize: "16px",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            background: loading ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <p>
          Don't have an account?{" "}
          <span
            onClick={goToRegister}
            style={{
              color: "#007bff",
              cursor: "pointer",
              fontWeight: "bold",
              textDecoration: "underline",
            }}
          >
            Register here
          </span>
        </p>
      </div>

      {/* Debug info 
      <div
        style={{
          marginTop: "30px",
          padding: "15px",
          background: "#f8f9fa",
          borderRadius: "5px",
          fontSize: "12px",
          color: "#666",
        }}
      >
        <p style={{ margin: "0 0 10px 0", fontWeight: "bold" }}>Debug Info:</p>
        <ol style={{ margin: "0", paddingLeft: "15px" }}>
          <li>Check Console (F12) for logs</li>
          <li>Token saved to localStorage</li>
          <li>Redirects to /dashboard</li>
          <li>Backend running: http://localhost:5001</li>
        </ol>
      </div>*/}
    </div>
  );
}

export default Login;
