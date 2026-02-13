import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
      
      // Save token and user data
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      
      // Redirect to dashboard
      // Force reload to ensure App.js picks up audio/auth state if necessary, 
      // or just navigate if state is handled correctly. 
      // Given App.js structure, a reload is safest or just navigate and let ProtectedRoute check.
      // We will just navigate for now, users often prefer SPA feel. 
      // If App.js doesn't react, we might need window.location.href = "/dashboard";
      navigate("/dashboard");
      window.location.reload(); // Ensuring state refresh for now as requested in plan
    } catch (err) {
      setMessage(err.response?.data?.error || "Error logging in");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Login;
