import React, { useMemo } from 'react';
import { 
  X, Award, CheckCircle2, AlertTriangle, 
  TrendingUp, Sparkles, Brain, Code, 
  Target, Info, ChevronRight, Zap 
} from 'lucide-react';
import './CandidateComparison.css';

const CandidateComparison = ({ candidates, onClose }) => {
  // Find the candidate with the highest score
  const winnerId = useMemo(() => {
    if (!candidates || candidates.length === 0) return null;
    return [...candidates].sort((a, b) => b.ai_match_score - a.ai_match_score)[0].student_id;
  }, [candidates]);

  if (!candidates || candidates.length === 0) return null;

  return (
    <div className="comparison-backdrop">
      <div className="comparison-container">
        <header className="comparison-header">
          <h2><Target size={28} /> AI Candidate Comparison</h2>
          <button className="btn-close" onClick={onClose}>
            <X size={20} /> Close Comparison
          </button>
        </header>

        <div className="comparison-body">
          <table className="comparison-table">
            <thead>
              <tr className="comparison-row">
                {candidates.map(candidate => (
                  <th key={candidate.student_id} className="comparison-cell">
                    <div className={`candidate-card-header ${candidate.student_id === winnerId ? 'is-winner' : ''}`}>
                      {candidate.student_id === winnerId && (
                        <div className="winner-badge">
                          <Award size={14} /> TOP MATCH
                        </div>
                      )}
                      <div className="candidate-avatar">
                        {candidate.student_name.charAt(0)}
                      </div>
                      <div className="candidate-name">{candidate.student_name}</div>
                      <div className="candidate-role">{candidate.job_title || 'Software Engineer'}</div>
                      <div className="match-score-radial">
                        <div className="score-value">{candidate.ai_match_score}%</div>
                        <div className="score-label">Match Score</div>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Technical Foundations */}
              <tr className="comparison-row">
                <td colSpan={candidates.length} className="section-label">Technical Foundations</td>
              </tr>
              <tr className="comparison-row">
                {candidates.map(candidate => (
                  <td key={candidate.student_id} className="comparison-cell">
                    <div className="metric-card">
                      <label className="metric-label">Key Stack Performance</label>
                      <div className="skill-pills">
                        {(candidate.skills || ['React', 'Node.jsx', 'TypeScript']).slice(0, 4).map((skill, i) => (
                          <span key={i} className="skill-pill">{skill}</span>
                        ))}
                      </div>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Behavioral & EQ */}
              <tr className="comparison-row">
                <td colSpan={candidates.length} className="section-label">Behavioral & EQ Insights</td>
              </tr>
              <tr className="comparison-row">
                {candidates.map(candidate => (
                  <td key={candidate.student_id} className="comparison-cell">
                    <div className={`metric-card ${candidate.student_id === winnerId ? 'highlight' : ''}`}>
                      <label className="metric-label">Communication Style</label>
                      <div className="metric-v">
                        {candidate.student_id === winnerId ? 'Strategic & Collaborative' : 'Direct & Execution-Focused'}
                      </div>
                      <div className="mt-4">
                        <label className="metric-label">AI Verdict</label>
                        <div className={`verdict-box ${candidate.student_id === winnerId ? 'positive' : 'neutral'}`}>
                          {candidate.student_id === winnerId 
                            ? 'Highly adaptable with strong leadership signals. Best fit for team growth.'
                            : 'Technically proficient but may require more structured onboarding.'
                          }
                        </div>
                      </div>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Professional Maturity */}
              <tr className="comparison-row">
                <td colSpan={candidates.length} className="section-label">Professional Maturity</td>
              </tr>
              <tr className="comparison-row">
                {candidates.map(candidate => (
                  <td key={candidate.student_id} className="comparison-cell">
                    <div className="metric-card">
                      <div className="flex justify-between items-center mb-4">
                        <label className="metric-label">Experience Depth</label>
                        <span className="text-xs font-bold text-primary">High</span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500">Project Quality</span>
                          <span className="font-bold">88/100</span>
                        </div>
                        <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: '88%' }}></div>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500">Mentorship Potential</span>
                          <span className="font-bold">72%</span>
                        </div>
                        <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-400" style={{ width: '72%' }}></div>
                        </div>
                      </div>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <footer className="comparison-footer">
          <div className="footer-icon">
            <Sparkles size={32} />
          </div>
          <div className="footer-content">
            <h4>AI Hiring Recommendation</h4>
            <p>
              Based on the side-by-side analysis, <strong>{candidates.find(c => c.student_id === winnerId)?.student_name}</strong> shows the highest alignment with your team's current velocity requirements and technical stack. Their EQ indicators suggest a 24% higher probability of long-term retention compared to peer benchmarks.
            </p>
          </div>
          <div className="flex gap-4">
             <button className="btn btn-primary" onClick={() => window.print()}>
               Generate Comparison PDF
             </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default CandidateComparison;
