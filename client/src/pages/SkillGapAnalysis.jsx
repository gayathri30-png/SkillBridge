import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, Clock, 
  CheckCircle2, AlertTriangle, 
  TrendingUp, Sparkles, BrainCircuit
} from 'lucide-react';
import './SkillGapAnalysis.css';

const SkillGapAnalysis = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchAnalysis();
  }, [jobId]);

  const fetchAnalysis = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const [matchRes, pathwayRes] = await Promise.all([
        axios.get(`/api/ai/match/${jobId}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`/api/ai/skill-gap/pathways?jobId=${jobId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      
      setData({
        ...matchRes.data,
        learningPath: pathwayRes.data.pathways || []
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading-v2"><div className="loader-premium"></div></div>;

  return (
    <div className="skill-gap-page fade-in">
      <header className="page-header-v2">
        <button className="back-btn-v2" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Back to Job Details
        </button>
        <div className="title-section-v2">
          <div className="ai-badge-v2"><Sparkles size={14} /> AI Context Engine</div>
          <h1>Target Skill Gap Analysis</h1>
          <p>Our AI analyzed the technical stack required for this position against your current proficiencies. Identify critical missing competencies below.</p>
        </div>
      </header>

      <div className="gap-layout-v2">
        {/* Left: Gap Overview (Sticky) */}
        <aside className="gap-sidebar-v2">
          <div className="match-card-v2">
            <div className="circular-progress-v2">
              <svg viewBox="0 0 36 36" className="circular-chart">
                <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="circle" strokeDasharray={`${data.score}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <text x="18" y="20.35" className="percentage">{data.score}%</text>
              </svg>
            </div>
            <h3>Current Match Target</h3>
            <p>You meet {data.matched_skills?.length} out of {data.total_skills} strict requirements.</p>
          </div>

          <div className="stats-list-v2">
            <div className="stat-item-v2">
                <div className="icon-box-v2 blue"><Clock size={16} /></div>
                <div>
                   <label>Total Est. Upskill Time</label>
                   <span>10-12 Days</span>
                </div>
            </div>
            <div className="stat-item-v2">
                <div className="icon-box-v2 green"><TrendingUp size={16} /></div>
                <div>
                   <label>Potential Score Increase</label>
                   <span>+32% Match</span>
                </div>
            </div>
          </div>
        </aside>

        {/* Right: Gap Analysis Core */}
        <main className="path-content-v2">
          <section className="path-section-v2">
            <h2><AlertTriangle size={20} className="text-amber-400" /> Identified Skill Gaps</h2>
            <div className="gap-grid-v2">
              {data.learningPath.map((item, i) => (
                <div key={i} className={`gap-card-v2 ${item.difficulty?.toLowerCase()}`}>
                    <div className="gap-info-v2">
                      <span className={`gap-pill-v2 ${item.difficulty?.toLowerCase()}`}>{item.difficulty} Priority</span>
                      <h3>{item.skill}</h3>
                    </div>
                    <div className="time-pill-v2"><Clock size={14} /> {item.estimated_time}</div>
                </div>
              ))}
              {data.learningPath.length === 0 && (
                  <div className="p-8 text-center text-slate-400 italic bg-white/5 rounded-2xl border border-white/5">
                      No significant skill gaps detected! You are a strong match.
                  </div>
              )}
            </div>
          </section>

          <section className="matched-skills-section-v2">
            <h2><BrainCircuit size={20} className="text-emerald-400" /> Validated Strengths</h2>
            <div className="strengths-grid-v2">
              {data.matched_skills?.map((skill, i) => (
                <div key={i} className="strength-tag-v2">
                  <CheckCircle2 size={16} className="text-emerald-400" /> {skill.name}
                  <span className="proficiency-v2">{skill.proficiency}</span>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default SkillGapAnalysis;
