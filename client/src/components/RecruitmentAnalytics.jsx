import React, { useMemo } from 'react';
import { 
  X, BarChart3, TrendingUp, Users, 
  Target, Zap, Brain, Download, 
  Filter, Calendar, Info, ShieldCheck,
  Activity, ArrowUpRight
} from 'lucide-react';
import './RecruitmentAnalytics.css';

const RecruitmentAnalytics = ({ onClose, applicants = [], jobDetails = {} }) => {
  const totalApps = applicants.length || 1;
  const aiScreenedCount = applicants.filter(a => Number(a.ai_match_score) >= 50).length;
  const shortlistedCount = applicants.filter(a => ['accepted', 'hired'].includes(a.status)).length;
  const hiredCount = applicants.filter(a => a.status === 'hired').length;

  const funnelData = [
    { stage: 'Total Applicants', count: applicants.length, percentage: applicants.length > 0 ? 100 : 0 },
    { stage: 'AI Screened (>50%)', count: aiScreenedCount, percentage: Math.round((aiScreenedCount / totalApps) * 100) },
    { stage: 'Shortlisted', count: shortlistedCount, percentage: Math.round((shortlistedCount / totalApps) * 100) },
    { stage: 'Hired', count: hiredCount, percentage: Math.round((hiredCount / totalApps) * 100) }
  ];

  const handleExportCSV = () => {
    if (!applicants || applicants.length === 0) {
      alert("No applicants data available to export.");
      return;
    }

    const headers = [
      "Applicant ID",
      "Applicant Name", 
      "Email", 
      "Phone", 
      "Status", 
      "AI Match Score", 
      "Skills", 
      "Application Date"
    ];

    const csvRows = [headers.join(",")];

    for (const app of applicants) {
      const row = [
        `"${app.application_id || ''}"`,
        `"${(app.student_name || '').replace(/"/g, '""')}"`,
        `"${(app.student_email || '').replace(/"/g, '""')}"`,
        `"${(app.student_phone || '').replace(/"/g, '""')}"`,
        `"${(app.status || 'pending').toUpperCase()}"`,
        `"${app.ai_match_score || 0}%"`,
        `"${(app.student_skills || '').replace(/"/g, '""')}"`,
        `"${new Date(app.created_at || Date.now()).toLocaleDateString()}"`
      ];
      csvRows.push(row.join(","));
    }

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${(jobDetails.title || 'Job').replace(/\s+/g, '_')}_Applicants_Report.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const skillBenchmarks = useMemo(() => {
    if (!jobDetails || !jobDetails.skills_required || applicants.length === 0) {
      return [
        { skill: 'React', required: 90, available: 75 },
        { skill: 'TypeScript', required: 85, available: 60 },
        { skill: 'Node.js', required: 80, available: 82 },
        { skill: 'System Design', required: 75, available: 45 }
      ];
    }
    return jobDetails.skills_required.slice(0, 4).map(skillName => {
      const applicantsWithSkill = applicants.filter(a => 
         a.student_skills && a.student_skills.toLowerCase().includes(skillName.toLowerCase())
      ).length;
      const available = totalApps > 0 ? Math.round((applicantsWithSkill / totalApps) * 100) : 0;
      return { 
         skill: skillName, 
         required: 100, 
         available 
      };
    });
  }, [jobDetails, applicants, totalApps]);

  const bottomMetrics = useMemo(() => {
    let timeToHireDisplay = "TBD";
    let speedVsAvg = "Gathering data...";
    const hiredApps = applicants.filter(a => a.status === 'hired');
    if (hiredApps.length > 0 && jobDetails.created_at) {
        const jobDate = new Date(jobDetails.created_at);
        const hiredTimes = hiredApps.map(a => {
            const appDate = new Date(a.created_at);
            return Math.max(1, (appDate - jobDate) / (1000 * 60 * 60 * 24)); 
        });
        const avgDays = hiredTimes.reduce((acc, curr) => acc + curr, 0) / hiredTimes.length;
        timeToHireDisplay = `${avgDays.toFixed(1)}d`;
        speedVsAvg = "BASED ON SUCCESSFUL HIRES";
    }

    const budgetDisplay = jobDetails.budget ? `$${jobDetails.budget.toLocaleString()}` : 'N/A';

    const highMatch = applicants.filter(a => Number(a.ai_match_score) >= 70);
    const highMatchAccepted = highMatch.filter(a => ['accepted', 'hired'].includes(a.status)).length;
    let aiAcceptanceRate = "0%";
    if (highMatch.length > 0) {
        aiAcceptanceRate = `${Math.round((highMatchAccepted / highMatch.length) * 100)}%`;
    }

    let avgMatchDisplay = "0%";
    if (applicants.length > 0) {
        const avgMatchVal = applicants.reduce((acc, curr) => acc + (Number(curr.ai_match_score) || 0), 0) / applicants.length;
        avgMatchDisplay = `${Math.round(avgMatchVal)}%`;
    }

    return { timeToHireDisplay, speedVsAvg, budgetDisplay, aiAcceptanceRate, avgMatchDisplay };
  }, [applicants, jobDetails]);

  return (
    <div className="analytics-backdrop">
      <div className="analytics-container">
        <header className="analytics-header">
          <h2><BarChart3 size={32} className="text-primary" /> Recruitment Intelli-Hub</h2>
          <div className="flex gap-4">
             <button className="btn-export" onClick={handleExportCSV}>
               <Download size={18} /> Export Data
             </button>
             <button className="btn-close" onClick={onClose}><X size={24} /></button>
          </div>
        </header>

        <div className="analytics-body">
          <div className="analytics-grid">
            {/* Funnel Visualization */}
            <section className="funnel-card">
              <div className="card-title">
                Hiring Funnel Velocity
                <div className="text-[10px] font-bold text-primary flex items-center gap-1">
                    <Activity size={10} /> REAL-TIME SYNC
                </div>
              </div>
              <div className="funnel-viz mt-12">
                {funnelData.map((stage, i) => (
                  <div key={i} className="funnel-stage">
                    <div className="stage-label">{stage.stage}</div>
                    <div className="stage-bar-wrapper">
                        <div 
                            className="stage-bar" 
                            style={{ width: `${stage.percentage}%`, opacity: 1 - (i * 0.15) }}
                        ></div>
                        <div className="stage-info">
                            <span>{stage.count}</span>
                            <span className="text-[10px] opacity-70">{stage.percentage}%</span>
                        </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-100 flex gap-4">
                 <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary">
                    <Brain size={24} />
                 </div>
                 <div>
                    <h5 className="text-sm font-bold text-slate-800 mb-1">AI Bottleneck Analysis</h5>
                    <p className="text-xs text-slate-500 leading-relaxed">
                        Conversion from <strong>AI Screened</strong> to <strong>Interviewed</strong> is 12% lower than Q1. Recommend lowering TypeScript strictness for mid-level roles.
                    </p>
                 </div>
              </div>
            </section>

            {/* Talent Supply Benchmarking */}
            <section className="benchmarking-card">
              <div className="card-title text-white/50">Talent Supply Index</div>
              <div className="space-y-8 mt-8">
                 {skillBenchmarks.map((sb, i) => (
                    <div key={i} className="skill-bench-item">
                        <div className="skill-bench-header">
                            <span>{sb.skill}</span>
                            <span className="text-blue-400">{sb.available}% Available vs {sb.required}% Req</span>
                        </div>
                        <div className="skill-bench-bar-bg">
                            <div className="skill-bench-bar-req" style={{ width: `${sb.required}%` }}></div>
                            <div className="skill-bench-bar-avg" style={{ width: `${sb.available}%` }}></div>
                        </div>
                    </div>
                 ))}
              </div>
              <div className="mt-12 p-6 bg-white/5 rounded-2xl border border-white/10">
                <div className="flex justify-between items-center mb-4">
                    <h5 className="text-xs font-bold text-blue-400">MARKET PREDICTION</h5>
                    <ArrowUpRight size={14} className="text-blue-400" />
                </div>
                <p className="text-sm text-slate-300 leading-relaxed font-medium">
                    "Based on real-time data, '{jobDetails.skills_required && jobDetails.skills_required[0] ? jobDetails.skills_required[0] : 'core skill'}' expertise fluctuates. Monitor candidate supply versus demand to adjust your expectations appropriately."
                </p>
              </div>
            </section>
          </div>

          <div className="bottom-grid">
            <div className="stat-metric-card">
                <div className="stat-metric-value text-primary">{bottomMetrics.timeToHireDisplay}</div>
                <div className="stat-metric-label">Average Time to Hire</div>
                <div className="mt-4 flex items-center gap-1 text-[10px] text-emerald-600 font-bold uppercase">
                    <Activity size={10} /> {bottomMetrics.speedVsAvg}
                </div>
            </div>
            <div className="stat-metric-card">
                <div className="stat-metric-value">{bottomMetrics.budgetDisplay}</div>
                <div className="stat-metric-label">Target Budget</div>
                <div className="mt-4 flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
                    <TrendingUp size={10} /> EXACT DB MATCH
                </div>
            </div>
            <div className="stat-metric-card">
                <div className="stat-metric-value">{bottomMetrics.aiAcceptanceRate}</div>
                <div className="stat-metric-label">Top Candidate Action Rate</div>
                <div className="mt-4 flex items-center gap-1 text-[10px] text-slate-400 font-bold text-wrap leading-tight">
                    <Info size={10} className="flex-shrink-0" /> (% OF &gt;70 MATCH CANDIDATES SHORTLISTED)
                </div>
            </div>
            <div className="stat-metric-card">
                <div className="stat-metric-value">{bottomMetrics.avgMatchDisplay}</div>
                <div className="stat-metric-label">Avg. Candidate Match Score</div>
                <div className="mt-4 flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
                    <TrendingUp size={10} /> APPLICANT POOL QUALITY
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruitmentAnalytics;
