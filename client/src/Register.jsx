import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
        role,
      });
      alert("Registration Successful! Please login.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Registration Failed");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <h2>Register for SkillBridge</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />
        <div>
          <label>
            <input
              type="radio"
              value="student"
              checked={role === "student"}
              onChange={(e) => setRole(e.target.value)}
            />{" "}
            Student
          </label>
          <label style={{ marginLeft: "20px" }}>
            <input
              type="radio"
              value="recruiter"
              checked={role === "recruiter"}
              onChange={(e) => setRole(e.target.value)}
            />{" "}
            Recruiter
          </label>
        </div>
        <button
          type="submit"
          style={{
            marginTop: "10px",
            padding: "10px 20px",
            background: "#28a745",
            color: "white",
            border: "none",
          }}
        >
          Register
        </button>
      </form>
      <p>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
}

export default Register;
