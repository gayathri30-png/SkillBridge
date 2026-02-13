import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [userSkills, setUserSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({
    totalSkills: 0,
    profileComplete: 85,
    applications: 0,
    recruiterJobs: 0,
  });
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const fetchAllJobs = useCallback(async (token) => {
    try {
      const response = await axios.get("/api/jobs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(response.data);
      if (user?.role === "recruiter") {
        const recruiterJobs = response.data.filter(
          (job) => Number(job.posted_by) === Number(user.id)
        );
        setStats((prev) => ({ ...prev, recruiterJobs: recruiterJobs.length }));
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  }, [user?.role, user?.id]);

  const fetchUserSkills = useCallback(async (token) => {
    try {
      const response = await axios.get("/api/skills/my-skills", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserSkills(response.data);
      setStats((prev) => ({ ...prev, totalSkills: response.data.length }));
    } catch (error) {
      console.error("Error fetching skills:", error);
    }
  }, []);

  const fetchStudentApplications = useCallback(async (token) => {
    try {
      const response = await axios.get("/api/applications/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats((prev) => ({ ...prev, applications: response.data.length }));
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (token && savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      fetchUserSkills(token);
      fetchAllJobs(token);
      if (userData.role === "student") {
        fetchStudentApplications(token);
      }
      setLoading(false);
    } else {
      navigate("/login");
    }
  }, [navigate, fetchUserSkills, fetchAllJobs, fetchStudentApplications]);

  if (loading || !user) {
    return <div className="p-8 text-slate-500">Loading your profile...</div>;
  }

  const roleColor = user.role === "recruiter" ? "var(--accent)" : "var(--primary)";

  return (
    <div className="dashboard-grid fade-in">
      {/* Column 1: Profile & Identity */}
      <aside className="dashboard-left-panel space-y-6">
        <div className="card p-6 text-center space-y-4">
          <div className="mx-auto w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-3xl shadow-inner mb-4">
             {user.name.charAt(0)}
          </div>
          <div>
            <h3 className="mb-1">{user.name}</h3>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{user.role}</p>
          </div>
          <div className="pt-4 border-top">
            <div className="flex-between mb-2">
              <span className="text-xs font-medium text-slate-500">Profile Completion</span>
              <span className="text-xs font-bold text-primary">{stats.profileComplete}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-500" 
                style={{ width: `${stats.profileComplete}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h4 className="text-sm mb-4 flex items-center gap-2">
            <span className="text-lg">⭐</span> Top Skills
          </h4>
          <div className="flex flex-wrap gap-2">
            {userSkills.length > 0 ? userSkills.slice(0, 5).map(s => (
              <span key={s.id} className="chip chip-info">{s.skill_name}</span>
            )) : <p className="text-xs text-slate-400">Add skills to see your match score.</p>}
          </div>
        </div>
      </aside>

      {/* Column 2: Activity & Actions */}
      <section className="dashboard-center-panel space-y-8">
        <div className="welcome-hero card p-8 glass flex-between" style={{ borderLeft: `6px solid ${roleColor}` }}>
          <div>
             <h1 className="mb-2">Hello, {user.name.split(' ')[0]}! 👋</h1>
             <p className="text-slate-600">Your dashboard is looking great today. You have {user.role === 'student' ? `${stats.applications} active applications` : `${stats.recruiterJobs} active job listings`}.</p>
          </div>
          <div className="hero-badge hidden sm:block">
             <div className="text-4xl">🚀</div>
          </div>
        </div>

        <div>
          <h3 className="section-title mb-6">Quick Actions</h3>
          <div className="grid-cols-2">
             {user.role === 'student' ? (
               <>
                 <div className="card card-hover p-6 cursor-pointer" onClick={() => navigate('/jobs')}>
                   <div className="text-3xl mb-4">🔍</div>
                   <h4>Explore Jobs</h4>
                   <p className="text-xs mt-2">Find opportunities that match your skill set.</p>
                 </div>
                 <div className="card card-hover p-6 cursor-pointer" onClick={() => navigate('/skills')}>
                   <div className="text-3xl mb-4">🛠️</div>
                   <h4>Update Skills</h4>
                   <p className="text-xs mt-2">Add new certifications and technologies.</p>
                 </div>
               </>
             ) : (
               <>
                 <div className="card card-hover p-6 cursor-pointer" onClick={() => navigate('/post-job')}>
                   <div className="text-3xl mb-4">📝</div>
                   <h4>Post New Job</h4>
                   <p className="text-xs mt-2">Create a new listing for your opening.</p>
                 </div>
                 <div className="card card-hover p-6 cursor-pointer" onClick={() => navigate('/my-jobs')}>
                   <div className="text-3xl mb-4">📂</div>
                   <h4>Monitor Jobs</h4>
                   <p className="text-xs mt-2">Check applicant counts and statuses.</p>
                 </div>
               </>
             )}
          </div>
        </div>

        {/* AI Recommendation Mockup (for Students) */}
        {user.role === 'student' && (
          <div className="card p-6 bg-slate-900 text-white overflow-hidden relative">
            <div className="relative z-10">
              <h4 className="mb-2">AI Match Recommendation</h4>
              <p className="text-slate-400 text-sm mb-4">Based on your Profile, we found 12 new matches today!</p>
              <button className="btn btn-primary" onClick={() => navigate('/jobs')}>View Matches</button>
            </div>
            <div className="absolute right-[-20px] bottom-[-20px] text-9xl opacity-10">🤖</div>
          </div>
        )}
      </section>

      {/* Column 3: Stats & Status */}
      <aside className="dashboard-right-panel space-y-6">
        <div className="card p-6">
          <h4 className="text-sm mb-6 uppercase tracking-widest text-slate-400 font-bold">Activity Overview</h4>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-success-light text-success flex items-center justify-center text-xl">
                 {user.role === 'student' ? '📄' : '📬'}
              </div>
              <div>
                <h4 className="m-0">{user.role === 'student' ? stats.applications : 24}</h4>
                <p className="text-xs m-0">{user.role === 'student' ? 'Applications' : 'Total Applicants'}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-info-light text-info flex items-center justify-center text-xl">
                 {user.role === 'student' ? '💼' : '📝'}
              </div>
              <div>
                <h4 className="m-0">{user.role === 'student' ? stats.totalSkills : stats.recruiterJobs}</h4>
                <p className="text-xs m-0">{user.role === 'student' ? 'Verfied Skills' : 'Admin Status: Active'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card p-6">
           <h4 className="text-sm mb-4">Recent Notifications</h4>
           <div className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-lg border-left transition-all hover:bg-white cursor-pointer" style={{ borderLeftColor: 'var(--primary)' }}>
                <p className="text-xs font-bold text-slate-900 m-0">Appplication Viewed</p>
                <p className="text-[10px] text-slate-500 m-0">Google just viewed your profile.</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border-left transition-all hover:bg-white cursor-pointer" style={{ borderLeftColor: 'var(--success)' }}>
                <p className="text-xs font-bold text-slate-900 m-0">New Skill Badge</p>
                <p className="text-[10px] text-slate-500 m-0">You earned "React Pro" badge!</p>
              </div>
           </div>
        </div>
      </aside>
    </div>
  );
};

export default Dashboard;

