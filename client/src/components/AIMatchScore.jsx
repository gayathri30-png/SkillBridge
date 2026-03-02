import React from 'react';
import './AIMatchScore.css';

const AIMatchScore = ({ score, matchedSkills = [], missingSkills = [] }) => {
  return (
    <div className="match-score-container card glass">
      <div className="score-header">
        <h3 className="gradient-text font-[Outfit]">AI Match Intensity</h3>
        <div className="score-circle">
          <svg viewBox="0 0 36 36" className="circular-chart emerald">
            <path className="circle-bg"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path className="circle"
              strokeDasharray={`${score}, 100`}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <text x="18" y="20.35" className="percentage">{score}%</text>
          </svg>
        </div>
      </div>

      <div className="skill-breakdown">
        <div className="skill-section">
          <h4>Matched Skills</h4>
          <div className="skill-tags">
            {matchedSkills.map((skill, index) => {
              const skillName = typeof skill === 'string' ? skill : skill.name;
              const proficiency = typeof skill === 'object' ? skill.proficiency : null;
              
              return (
                <span key={index} className="skill-tag matched">
                  <span className="icon">✔</span> {skillName} 
                  {proficiency && <span className="proficiency-level">({proficiency})</span>}
                </span>
              );
            })}
          </div>
        </div>

        <div className="skill-section">
          <h4>Missing Skills</h4>
          <div className="skill-tags">
            {missingSkills.map((skill, index) => (
              <span key={index} className="skill-tag missing">
                <span className="icon">✖</span> {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <p className="ai-insight">
        {score > 70 
          ? "🚀 You're a strong match! Your technical skills align well with this role."
          : "💡 Pro Tip: Acquiring the missing skills could boost your match score significantly."}
      </p>
    </div>
  );
};

export default AIMatchScore;
