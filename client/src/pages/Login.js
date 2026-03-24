import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", form);
      setMessage(res.data.message);
      
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      
      navigate("/dashboard");
      window.location.reload();
    } catch (err) {
      setMessage(err.response?.data?.error || "Error logging in");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          />
        </div>
        <button type="submit" style={{ width: "100%", padding: "10px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
          Login
        </button>
      </form>
      {message && <p style={{ color: "red", marginTop: "10px" }}>{message}</p>}
      
      <div style={{ marginTop: "15px", textAlign: "center" }}>
        <Link to="/forgot-password" style={{ color: "#007bff", textDecoration: "none" }}>
          Forgot Password?
        </Link>
      </div>
    </div>
  );
};

export default Login;
