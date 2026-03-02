import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentDashboard from "./components/StudentDashboard";
import RecruiterDashboard from "./components/RecruiterDashboard";
import "./Dashboard.css";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      setUser(savedUser);
      setLoading(false);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Render dashboard based on role
  if (user.role === "recruiter") {
    return <RecruiterDashboard user={user} />;
  }

  // Default to student dashboard (also covers admins for now if they hit /dashboard)
  return <StudentDashboard user={user} />;
};

export default Dashboard;
