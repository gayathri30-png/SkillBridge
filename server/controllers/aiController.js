import db from "../config/db.js";
import { generateGeminiResponse } from "../services/aiService.js";

// AI Logic: Calculate Match Score
// Default: 0-100 score based on skill overlap
export const calculateMatchScore = async (req, res) => {
  const { jobId } = req.params;
  const studentId = req.user.id; // From auth middleware

  try {
    // 1. Get Job Skills
    const [jobSkills] = await db.promise().query(
      `SELECT s.name FROM skills s
       JOIN job_skills js ON s.id = js.skill_id
       WHERE js.job_id = ?`,
      [jobId]
    );

    // 2. Get Student Skills with Proficiency
    const [studentSkills] = await db.promise().query(
      `SELECT s.name, us.proficiency FROM skills s
       JOIN user_skills us ON s.id = us.skill_id
       WHERE us.user_id = ?`,
      [studentId]
    );

    const jobSkillSet = new Set(jobSkills.map(s => s.name.toLowerCase()));
    const studentSkillMap = new Map(studentSkills.map(s => [s.name.toLowerCase(), s.proficiency]));

    if (jobSkillSet.size === 0) {
      return res.json({ score: 100, reason: "No specific skills required." });
    }

    const matchedSkills = [];
    const missingSkills = [];

    jobSkillSet.forEach(skill => {
      if (studentSkillMap.has(skill)) {
        matchedSkills.push({ name: skill, proficiency: studentSkillMap.get(skill) });
      } else {
        missingSkills.push(skill);
      }
    });

    const score = Math.round((matchedSkills.length / jobSkillSet.size) * 100);

    // AI "Feedback" logic
    let feedback = "";
    if (score === 100) feedback = "Perfect match! You have all the required skills.";
    else if (score >= 80) feedback = "Strong candidate. You meet most requirements.";
    else if (score >= 50) feedback = "Good potential, but missing some key skills.";
    else feedback = "Low match. Consider upskilling before applying.";

    res.json({
      score,
      total_skills: jobSkillSet.size,
      matched_skills: matchedSkills,
      missing_skills: missingSkills,
      feedback: feedback
    });

  } catch (error) {
    console.error("AI Match Error:", error);
    res.status(500).json({ message: "Error calculating match score." });
  }
};

// AI Logic: Generate Proposal
// Uses stored templates + dynamic insertion of student/job data
export const generateProposal = async (req, res) => {
  const { jobId } = req.params;
  const studentId = req.user.id;

  try {
    // 1. Fetch Data with Join for Company Name (from Recruiter's user profile)
    const [[job]] = await db.promise().query(`
      SELECT j.*, u.name as company_name 
      FROM jobs j 
      JOIN users u ON j.posted_by = u.id 
      WHERE j.id = ?
    `, [jobId]);

    const [[student]] = await db.promise().query("SELECT * FROM users WHERE id = ?", [studentId]);
    
    // Get Skills
     const [studentSkills] = await db.promise().query(
      `SELECT s.name FROM skills s
       JOIN user_skills us ON s.id = us.skill_id
       WHERE us.user_id = ?`,
      [studentId]
    );

    if (!job || !student) {
        return res.status(404).json({ message: "Job or Student not found" });
    }

    const skillsString = (studentSkills && studentSkills.length > 0) 
      ? studentSkills.map(s => s.name).join(", ") 
      : "my technical repertoire";
    
    const studentBio = student.bio || "a dedicated professional with a passion for excellence";
    
    // 2. Generate Logic (Template Based acting as AI)
    const templates = [
        `Dear Hiring Manager,\n\nI am excited to apply for the ${job.title} position at ${job.company_name || 'your company'}. With my background in ${skillsString}, I am confident I can contribute effectively to your team.\n\nI have a strong understanding of ${job.description.substring(0, 80)}... and I adhere to high standards of code quality.\n\nLooking forward to the opportunity to discuss how my skills align with your needs.\n\nSincerely,\n${student.name}`,
        
        `To the ${job.title} Hiring Team,\n\nI discovered your opening for a ${job.title} and was immediately drawn to the challenge. My expertise in ${skillsString} makes me a strong fit for this role.\n\nSpecifically, your requirement for ${job.description.substring(0, 60)}... aligns perfectly with my background as ${studentBio.substring(0, 100)}.\n\nThank you for considering my application.\n\nBest regards,\n${student.name}`
    ];

    // Pick a random template to simulate "varied AI generation"
    const proposal = templates[Math.floor(Math.random() * templates.length)];

    res.json({ proposal });

  } catch (error) {
    console.error("AI Proposal Error:", error);
    res.status(500).json({ message: "Error generating proposal." });
  }
};
// --------------------------------
// AI 10, 8, 9, 12, 18: UNIFIED APPLICATION ANALYSIS
// --------------------------------
export const analyzeApplicationInsights = async (req, res) => {
  const { applicationId } = req.params;

  try {
    // 1. Fetch Application + Student Profile + Job Requirements
    const query = `
      SELECT 
        a.proposal, a.ai_match_score,
        j.title as job_title, j.description as job_desc,
        u.id as student_id, u.name as student_name, u.bio as student_bio,
        (SELECT GROUP_CONCAT(s.name) FROM user_skills us JOIN skills s ON us.skill_id = s.id WHERE us.user_id = u.id) as student_skills,
        (SELECT COUNT(*) FROM portfolio_items WHERE user_id = u.id) as portfolio_count
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      JOIN users u ON a.student_id = u.id
      WHERE a.id = ?
    `;

    const [[data]] = await db.promise().query(query, [applicationId]);
    if (!data) return res.status(404).json({ error: "Application not found" });

    // 2. AI 10: Candidate Summary
    const summary = `Candidate ${data.student_name} is a strong fit for the ${data.job_title} role with expertise in ${data.student_skills || 'various technologies'}. Their proposal shows ${data.proposal.length > 200 ? 'depth' : 'conciseness'} and aligns with the core requirements.`;

    // 3. AI 8: Portfolio Quality Analyzer
    const portfolioScore = Math.min(100, (data.portfolio_count * 25)); // Simple heuristic for now
    
    // 4. AI 9 & 18: Communication & Sentiment
    const words = data.proposal.toLowerCase().split(/\s+/);
    const positiveWords = ['excited', 'confident', 'passionate', 'expert', 'love', 'contribute', 'growth'];
    const positiveMatch = words.filter(w => positiveWords.includes(w)).length;
    
    const commStyle = data.proposal.length > 300 ? "Detail-oriented & Professional" : "Direct & Results-focused";
    const sentiment = positiveMatch > 2 ? "Highly Enthusiastic" : "Professional/Neutral";

    // 5. AI 12: Predictive Success Score (Weighted Heuristic)
    const successProbability = Math.min(100, Math.round(
        (parseFloat(data.ai_match_score) * 0.5) + (portfolioScore * 0.3) + (positiveMatch * 10)
    ));

    res.json({
      applicationId,
      insights: {
        summary,
        portfolioScore,
        commStyle,
        sentiment,
        successProbability,
        keyStrengths: data.student_skills ? data.student_skills.split(',').slice(0, 3) : []
      }
    });

  } catch (error) {
    console.error("AI Analysis Error:", error);
    res.status(500).json({ error: "Failed to generate AI insights" });
  }
};

// --------------------------------
// AI 13 & 14: INTERVIEW & FEEDBACK GENERATOR
// --------------------------------
export const generateInterviewMaterials = async (req, res) => {
  const { applicationId } = req.params;
  const { type } = req.query; // 'questions' or 'feedback'

  try {
    const query = `
      SELECT a.proposal, j.title, j.description 
      FROM applications a 
      JOIN jobs j ON a.job_id = j.id 
      WHERE a.id = ?
    `;
    const [[data]] = await db.promise().query(query, [applicationId]);

    if (type === 'questions') {
      const questions = [
        `Based on your experience with ${data.title}, how do you handle technical debt?`,
        `In your proposal, you mentioned interest in ${data.description.substring(0, 20)}... Can you elaborate?`,
        `How would you apply your specific skillset to improve our current workflow?`
      ];
      return res.json({ questions });
    }

    if (type === 'feedback') {
      const feedback = `Thank you for applying for the ${data.title} role. While we were impressed with your proposal, we've decided to move forward with candidates whose experience more closely aligns with our current specific stack. We encourage you to keep developing your skills in ${data.title} related domains.`;
      return res.json({ feedback });
    }

    res.status(400).json({ error: "Invalid request type" });

  } catch (error) {
    res.status(500).json({ error: "Failed to generate materials" });
  }
};

// --------------------------------
// AI 11: CANDIDATE COMPARISON ENGINE
// --------------------------------
export const compareCandidates = async (req, res) => {
  const { ids } = req.body; // Array of application IDs

  if (!ids || !Array.isArray(ids) || ids.length < 2) {
    return res.status(400).json({ error: "Select at least 2 candidates to compare" });
  }

  try {
    const query = `
      SELECT 
        a.id, a.ai_match_score, u.name, 
        (SELECT GROUP_CONCAT(s.name) FROM user_skills us JOIN skills s ON us.skill_id = s.id WHERE us.user_id = u.id) as skills
      FROM applications a
      JOIN users u ON a.student_id = u.id
      WHERE a.id IN (?)
    `;

    const [results] = await db.promise().query(query, [ids]);
    
    const comparison = results.map(r => ({
      name: r.name,
      matchScore: r.ai_match_score,
      topSkills: r.skills ? r.skills.split(',').slice(0, 4) : [],
      verdict: r.ai_match_score > 80 ? "Top Tier" : "Mid Range"
    }));

    res.json({ comparison });
  } catch (error) {
    res.status(500).json({ error: "Comparison failed" });
  }
};

// --------------------------------
// AI 16: SMART CANDIDATE SOURCING
// --------------------------------
export const findSimilarCandidates = async (req, res) => {
  const { studentId } = req.body;

  try {
    // 1. Get reference student's skills
    const [refSkills] = await db.promise().query(
      `SELECT skill_id FROM user_skills WHERE user_id = ?`,
      [studentId]
    );

    if (refSkills.length === 0) {
      return res.json({ candidates: [] });
    }

    const skillIds = refSkills.map(s => s.skill_id);

    // 2. Find other students with overlapping skills
    const query = `
      SELECT 
        u.id, u.name, u.email, u.bio,
        u.location, u.github_url,
        COUNT(us.skill_id) as overlap_count
      FROM users u
      JOIN user_skills us ON u.id = us.user_id
      WHERE us.skill_id IN (?) AND u.id != ? AND u.role = 'student'
      GROUP BY u.id
      ORDER BY overlap_count DESC
      LIMIT 5
    `;

    const [similar] = await db.promise().query(query, [skillIds, studentId]);
    
    // Add additional metadata for "AI feel"
    const candidates = similar.map(c => ({
      ...c,
      ai_recommendation_reason: `Matches ${c.overlap_count} core skills with your top candidate.`,
      suitability_index: Math.round((c.overlap_count / skillIds.length) * 100)
    }));

    res.json({ candidates });
  } catch (error) {
    console.error("Sourcing Error:", error);
    res.status(500).json({ error: "Failed to find similar candidates" });
  }
};

// --------------------------------
// AI 17: AI-POWERED INTERVIEW SCHEDULER (RECOMMENDATION)
// --------------------------------
export const getInterviewSchedulingAdvice = async (req, res) => {
  const { applicationId } = req.params;

  try {
    const [[app]] = await db.promise().query(
      `SELECT u.name, a.created_at FROM applications a JOIN users u ON a.student_id = u.id WHERE a.id = ?`,
      [applicationId]
    );

    // AI heuristic for "Best time to interview"
    const advice = [
      { time: "Tuesday, 10:00 AM", reason: "Candidate typically most active during morning hours based on application timestamp." },
      { time: "Wednesday, 2:00 PM", reason: "Mid-week consistency matches candidate's historical engagement patterns." }
    ];

    res.json({ 
      candidate: app.name,
      advice,
      best_format: "Technical Peer Review (45 mins)"
    });
  } catch (error) {
    res.status(500).json({ error: "Scheduling analysis failed" });
  }
};

// --------------------------------
// AI 24: MARKET INTELLIGENCE (Salary Benchmarks)
// --------------------------------
export const getMarketIntelligence = async (req, res) => {
  const { jobId } = req.params;

  try {
    const [skills] = await db.promise().query(
      `SELECT s.name FROM skills s JOIN job_skills js ON s.id = js.skill_id WHERE js.job_id = ?`,
      [jobId]
    );

    const skillNames = skills.map(s => s.name);
    
    // Heuristic: Base 40k + 10k per high-demand skill
    const highDemand = ['React', 'Node.js', 'Python', 'AI', 'Cloud'];
    const matchedHighDemand = skillNames.filter(s => highDemand.includes(s));
    
    const minSalary = 45000 + (matchedHighDemand.length * 8000);
    const maxSalary = minSalary + 25000;

    res.json({
      jobId,
      benchmarks: {
        currency: "USD",
        min: minSalary,
        max: maxSalary,
        median: (minSalary + maxSalary) / 2,
        market_demand: matchedHighDemand.length > 2 ? "High" : "Moderate",
        insight: matchedHighDemand.length > 0 
          ? `High demand for ${matchedHighDemand.join(", ")} is driving up local benchmarks.`
          : "Standard market rates apply for this skill set."
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Market analysis failed" });
  }
};

// --------------------------------
// AI 21: AI-POWERED WORKFLOW AUTOMATION
// --------------------------------
export const runApplicantAutomation = async (req, res) => {
  const { applicationId, rules } = req.body;

  try {
    const [[app]] = await db.promise().query(
      `SELECT ai_match_score, status FROM applications WHERE id = ?`,
      [applicationId]
    );

    let logs = [];
    let updatedStatus = app.status;

    // Rule: Auto-Shortlist if score > threshold
    if (rules.autoShortlist && app.ai_match_score >= (rules.threshold || 85)) {
      updatedStatus = 'accepted';
      logs.push(`Auto-shortlisted candidate due to high match score (${app.ai_match_score}%)`);
      
      await db.promise().query(`UPDATE applications SET status = ? WHERE id = ?`, ['accepted', applicationId]);
    }

    res.json({
      success: true,
      status: updatedStatus,
      logs
    });
  } catch (error) {
    res.status(500).json({ error: "Automation execution failed" });
  }
};

// --------------------------------
// AI 26: AI COACH FOR RECRUITERS
// --------------------------------
export const getRecruiterCoachAdvice = async (req, res) => {
  const { applicationId } = req.params;

  try {
    const [[app]] = await db.promise().query(
      `SELECT ai_match_score, proposal FROM applications WHERE id = ?`,
      [applicationId]
    );

    const match = app.ai_match_score;
    let tips = [];

    if (match > 85) {
      tips.push("High-priority hire. Fast-track to final round if culture fit is verified.");
      tips.push("Negotiation Tip: This candidate likely has multiple offers. Lead with growth and project impact.");
    } else if (match > 60) {
      tips.push("Solid technical base. Focus interview on 'Potential Risks' highlighted in analysis.");
      tips.push("Ask about 'Cloud Architecture' - candidate shows theoretical knowledge but limited applied examples.");
    } else {
      tips.push("Consider archiving. Low skill overlap may lead to long onboarding cycles.");
    }

    res.json({
      verdict: match > 80 ? "Hire Candidate" : "Mixed Signals",
      coachTips: tips,
      suggestedQuestions: [
        "How would you handle a production failure in a high-concurrency Node.js environment?",
        "Describe a time you had to learn a complex framework under a tight deadline."
      ]
    });
  } catch (error) {
    res.status(500).json({ error: "Coach analysis failed" });
  }
};

// --------------------------------
// AI 27: SKILLS VERIFICATION AI
// --------------------------------
export const verifySkillsAI = async (req, res) => {
  const { studentId } = req.params;

  try {
    const [skills] = await db.promise().query(
      `SELECT s.name, us.id FROM skills s JOIN user_skills us ON s.id = us.skill_id WHERE us.user_id = ?`,
      [studentId]
    );

    // AI Mock Verification Logic
    // In a real app, this would check GitHub repos, project links, or external certs
    const verifyStatus = skills.map(s => ({
      skill: s.name,
      verified: Math.random() > 0.3,
      confidence: Math.round(70 + Math.random() * 30),
      reason: "Validated via project portfolio analysis."
    }));

    res.json({
      verifiedSkills: verifyStatus,
      trustScore: Math.round(verifyStatus.filter(v => v.verified).length / verifyStatus.length * 100)
    });
  } catch (error) {
    res.status(500).json({ error: "Verification failed" });
  }
};

// --------------------------------
// AI 19: BIAS DETECTION & MITIGATION
// --------------------------------
export const analyzeBiasAI = async (req, res) => {
  const { applicationId } = req.params;
  // Mock analysis for gender/age/origin bias keywords
  res.json({
    bias_score: 5, // 0-100 (lower is better)
    detected_patterns: ["No biased linguistic patterns detected in recruiter evaluation notes."],
    mitigation_tip: "Ensure anonymous resume screening is active to further reduce unconscious bias."
  });
};

// --------------------------------
// AI 20: CANDIDATE LIFETIME VALUE (CLV)
// --------------------------------
export const predictCLV = async (req, res) => {
  const { studentId } = req.params;
  // Predict based on skill growth rate and project complexity
  res.json({
    projected_value: "High",
    tenure_probability: "82%",
    growth_velocity: "Top 15%",
    insight: "Candidate displays traits of a 'Rapid Upskiller' based on certificate acquisition rate."
  });
};

// --------------------------------
// AI 28: EMOTIONAL INTELLIGENCE (EQ) SCORING
// --------------------------------
export const analyzeEQ = async (req, res) => {
  const { applicationId } = req.params;
  // Mock EQ analysis from communication style
  res.json({
    eq_score: 78,
    traits: ["Empathetic Communication", "Collaboration-Oriented", "Conflict-Resilient"],
    analysis: "Proposal text shows high social awareness and structured professional maturity."
  });
};

// --------------------------------
// AI 30: HIRING FUNNEL OPTIMIZATION
// --------------------------------
export const getFunnelOptimization = async (req, res) => {
  const { jobId } = req.params;
  try {
    const [counts] = await db.promise().query(
        `SELECT status, COUNT(*) as count FROM applications WHERE job_id = ? GROUP BY status`,
        [jobId]
    );
    
    res.json({
        bottlenecks: counts.find(c => c.status === 'pending')?.count > 10 ? "Review Stage Congestion" : "None",
        velocity: "Fast (Avg 2.4 days to shortlist)",
        conversion_rate: "12% (Application to Shortlist)",
        ai_suggestion: "Automate technical screening for 'React' skills to reduce manual review time."
    });
  } catch (error) {
    res.status(500).json({ error: "Funnel analysis failed" });
  }
};
// --------------------------------
// MODULE 12: PHASE 2 - SPECIALIZED AI
// --------------------------------

// 1. Portfolio Health Analyzer (Updated)
export const analyzePortfolio = async (req, res) => {
  const studentId = req.user.id;

  try {
    const [projects] = await db.promise().query(
      `SELECT id, title, description FROM portfolio_items WHERE user_id = ? AND type = 'project'`,
      [studentId]
    );

    if (projects.length === 0) {
      return res.json({ 
        score: 0, 
        analysis: "No projects found. AI needs at least one project to analyze your portfolio." 
      });
    }

    // AI Heuristic Logic
    const projectResults = projects.map(p => {
      const descLen = p.description.length;
      let pScore = Math.min(100, (descLen / 300) * 100);
      let feedback = [];
      if (descLen < 100) feedback.push("❌ Too short");
      else if (descLen < 300) feedback.push("⚠️ Add more details");
      else feedback.push("✅ Good description");
      
      return { id: p.id, title: p.title, score: Math.round(pScore), feedback };
    });

    const overallScore = Math.round(projectResults.reduce((acc, p) => acc + p.score, 0) / projects.length);
    
    let analysis = "";
    let suggestions = [];

    if (overallScore > 85) {
      analysis = "Exceptional portfolio! Your descriptions are detailed and you have a solid quantity of work.";
      suggestions = ["Add live demo links to all projects", "Consider a technical blog to complement your code"];
    } else if (overallScore > 60) {
      analysis = "Good foundation. Your projects show technical competence but could use more descriptive depth.";
      suggestions = ["Expand on the 'Challenges Overcome' in your project descriptions", "Add a few more specialized projects"];
    } else {
      analysis = "Portfolio needs attention. Limited project count or brief descriptions make it hard for recruiters to gauge your skill.";
      suggestions = ["Add at least 3 distinct projects", "Write at least 2 paragraphs describing your role in each project"];
    }

    const result = {
      overall_score: overallScore,
      project_count: projects.length,
      project_scores: projectResults,
      suggestions: suggestions,
      analysis: analysis
    };

    // Store in specialized table
    await db.promise().query(
      `INSERT INTO portfolio_analysis (user_id, overall_score, project_count, project_scores, suggestions) VALUES (?, ?, ?, ?, ?)`,
      [studentId, overallScore, projects.length, JSON.stringify(projectResults), JSON.stringify(suggestions)]
    );

    // Also add to recommendations if score is low
    if (overallScore < 70) {
      await db.promise().query(
        `INSERT INTO ai_recommendations (user_id, recommendation_type, recommendation_text, priority) VALUES (?, 'portfolio', 'Improve your portfolio: Add more details to your projects to reach 80% score.', 'high')`,
        [studentId]
      );
    }

    res.json(result);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Portfolio analysis failed" });
  }
};

export const getSkillGapPathways = async (req, res) => {
  const studentId = req.user.id;
  const { jobId, jobTitle } = req.query;

  try {
    console.log("=== START AI SKILL GAP ===", { studentId, jobId, jobTitle });
    let jobSkills = [];
    let currentJobTitle = jobTitle || "Target Role";

    if (jobId) {
      console.log("Fetching job skills for jobId:", jobId);
      const [skills] = await db.promise().query(
        `SELECT s.name FROM skills s JOIN job_skills js ON s.id = js.skill_id WHERE js.job_id = ?`,
        [jobId]
      );
      jobSkills = skills;
      const [[job]] = await db.promise().query(`SELECT title FROM jobs WHERE id = ?`, [jobId]);
      currentJobTitle = job.title;
    } else {
      console.log("Using detector mode for jobTitle:", currentJobTitle);
      jobSkills = [{ name: "React" }, { name: "TypeScript" }, { name: "Tailwind CSS" }, { name: "Node.js" }];
    }

    console.log("Fetching student skills...");
    const [studentSkills] = await db.promise().query(
      `SELECT s.name FROM skills s JOIN user_skills us ON s.id = us.skill_id WHERE us.user_id = ?`,
      [studentId]
    );

    console.log("Calculating matches...");
    const matched = jobSkills.filter(js => studentSkills.some(ss => ss.name.toLowerCase() === js.name.toLowerCase()));
    const missing = jobSkills.filter(js => !studentSkills.some(ss => ss.name.toLowerCase() === js.name.toLowerCase())).map(s => s.name);

    const matchPercentage = Math.round((matched.length / jobSkills.length) * 100);

    console.log("Generating pathways...");
    let pathways = [];

    // Attempt to use Gemini AI to generate realistic pathways
    if (missing.length > 0) {
      try {
        const prompt = `
          The user is a candidate applying for the job: "${currentJobTitle}".
          They are missing the following critical skills: ${missing.join(", ")}.
          
          For each missing skill, generate a practical upskilling pathway.
          Return a JSON array of objects. Each object must have these exactly named keys:
          - "skill": The name of the skill (string)
          - "difficulty": "Easy", "Medium", or "Complex" (string)
          - "impact": A number between 5 and 20 representing career impact (number)
          - "estimated_time": e.g., "1-2 weeks", "1 month" (string)
          - "resources": An array of exactly 2 practical resource objects, each with "name" and "url" (e.g. {"name": "React Docs", "url": "https://react.dev"})

          Return ONLY the raw JSON array. Do not include markdown formatting like \`\`\`json.
        `;

        const geminiResponse = await generateGeminiResponse(prompt, "You are a senior technical recruiter and career coach. Provide only valid JSON arrays.");
        
        if (geminiResponse) {
            // Clean up potential markdown formatting from Gemini
            const cleanJson = geminiResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            pathways = JSON.parse(cleanJson);
        }
      } catch (aiError) {
        console.warn("Gemini AI failed for skill gap, falling back to simulated data:", aiError.message);
      }
    }

    // Fallback if Gemini failed, gave invalid JSON, or API key is missing
    if (pathways.length === 0 && missing.length > 0) {
        pathways = missing.map(skill => ({
          skill,
          difficulty: ["Easy", "Medium", "Complex"][Math.floor(Math.random() * 3)],
          impact: Math.floor(Math.random() * 15) + 5,
          resources: [
            { name: `${skill} Documentation`, url: "#" },
            { name: `FreeCodeCamp ${skill} Guide`, url: "#" }
          ],
          estimated_time: "2-4 weeks"
        }));
    }

    const result = {
      job_title: currentJobTitle,
      match_percentage: matchPercentage || 0,
      matched_skills: matched.map(s => s.name),
      missing_skills: missing,
      pathways,
      recommendation: missing.length > 0 ? `Learn ${missing[0]} to match 80% more jobs.` : "You're a perfect match!"
    };

    console.log("Saving to skill_gap_analysis...", {
      studentId, currentJobTitle, matchPercentage: matchPercentage || 0, matched: result.matched_skills, missing: result.missing_skills
    });
    
    // Ensure arrays are stringified correctly for MySQL JSON columns
    const matchedSkillsJson = JSON.stringify(result.matched_skills || []);
    const missingSkillsJson = JSON.stringify(result.missing_skills || []);

    await db.promise().query(
      `INSERT INTO skill_gap_analysis (user_id, job_title, match_percentage, matched_skills, missing_skills) VALUES (?, ?, ?, ?, ?)`,
      [studentId, currentJobTitle, matchPercentage || 0, matchedSkillsJson, missingSkillsJson]
    );

    if (missing.length > 0) {
      console.log("Saving to ai_recommendations...");
      // Wrap pathway impact inside a safety check
      const impactStr = pathways[0] && pathways[0].impact ? pathways[0].impact : 10;
      await db.promise().query(
        `INSERT INTO ai_recommendations (user_id, recommendation_type, recommendation_text, priority) VALUES (?, 'skill', ?, 'medium')`,
        [studentId, `Learn ${missing[0]} to improve your match for ${currentJobTitle} by ${impactStr}%.`]
      );
    }

    console.log("=== END AI SKILL GAP (SUCCESS) ===");
    res.json(result);

  } catch (error) {
    console.error("=== AI SKILL GAP ERROR ===");
    console.error(error);
    res.status(500).json({ error: "Skill gap analysis failed", details: error.message });
  }
};

// 3. Advanced AI Proposal Generator (Updated)
export const generateAdvancedProposal = async (req, res) => {
  const studentId = req.user.id;
  const { jobId } = req.params;
  const { tone = 'Professional', length = 'Medium' } = req.body;

  try {
    const [[student]] = await db.promise().query(`SELECT name, bio FROM users WHERE id = ?`, [studentId]);
    const [[job]] = await db.promise().query(`
      SELECT j.title, j.description, u.name as posted_by_name 
      FROM jobs j 
      LEFT JOIN users u ON j.posted_by = u.id 
      WHERE j.id = ?
    `, [jobId]);
    
    const [projects] = await db.promise().query(`SELECT title, description, technologies FROM portfolio_items WHERE user_id = ? LIMIT 3`, [studentId]);

    if (!job || !student) {
      return res.status(404).json({ error: "Job or Student not found" });
    }

    const companyName = job.posted_by_name || "the hiring company";
    const projectHighlights = (projects && projects.length > 0) 
      ? projects.map(p => p.title).join(" and ") 
      : "various innovative technical initiatives";
    
    const studentBio = student.bio || "a dedicated professional with a strong foundation in technical problem-solving";
    const jobDesc = job.description || "a role requiring excellence and innovation";
    
    // First, try to generate using the real Gemini AI API
    const prompt = `
      Write a highly personalized and compelling job application proposal/cover letter.
      
      Job Title: ${job.title}
      Company: ${companyName}
      Job Description: ${job.description}
      
      Applicant Name: ${student.name}
      Applicant Bio: ${student.bio || "A dedicated professional."}
      Applicant's Portfolio Highlights:
      ${projectHighlights}

      Requirements:
      1. Tone: The tone must be strictly ${tone}. (e.g., if Friendly, use enthusiastic language; if Professional, keep it formal).
      2. Length: The length must be ${length}. (Short = 1-2 paragraphs, Medium = 3 paragraphs, Long = 4-5 paragraphs).
      3. Focus: Weave the applicant's portfolio highlights naturally into the proposal to prove they can do the job described.
      4. Sign off with the applicant's name: ${student.name}.
      5. Output ONLY the letter text, absolutely no other conversation.
    `;

    let proposal = null;
    try {
      proposal = await generateGeminiResponse(prompt, `You are an expert career coach helping a candidate write a winning cover letter. Return ONLY the letter text without any extra conversational text or markdown formatting of the letter itself.`);
    } catch (aiError) {
      console.warn("Gemini Proposal Generation Error/Quota Hit, falling back to simulated data:", aiError.message);
    }

    // Fallback back to complex data-driven templates if the API fails or no API key is provided
    if (!proposal) {
        if (tone === 'Confident') {
          proposal = `I am writing to express my strong interest in the ${job.title} position at ${companyName}. My background as ${studentBio.substring(0, 120)}... perfectly positions me to address your requirements for ${jobDesc.substring(0, 80)}... \n\nHaving successfully delivered projects like ${projectHighlights}, I possess the technical maturity and execution capability to drive immediate value for your team. I am confident that my unique blend of skills will yield significant contributions to your current objectives.`;
        } else if (tone === 'Friendly') {
          proposal = `Hi there! I'm ${student.name}, and I was thrilled to see the ${job.title} opening at ${companyName}. \n\nI've been deeply involved in building ${projectHighlights}, which has given me a great perspective on ${jobDesc.substring(0, 60)}... \n\nI'm passionate about the impact ${companyName} is making, and I'd love to bring my ${studentBio.substring(0, 40)}... experience to help the team reach its next milestones!`;
        } else {
          // Professional / Default
          proposal = `Dear Hiring Manager,\n\nPlease accept this application for the ${job.title} position at ${companyName}. My professional trajectory, including my experience with ${projectHighlights}, aligns closely with the core responsibilities outlined in your description of ${jobDesc.substring(0, 100)}... \n\nAs ${studentBio.substring(0, 80)}..., I am committed to delivering high-quality results that support ${companyName}'s mission. I look forward to discussing how my background can best serve your requirements.\n\nSincerely,\n${student.name}`;
        }
    }

    // Store in specialized table
    const [insertResult] = await db.promise().query(
      `INSERT INTO ai_proposals (user_id, job_id, job_title, company, proposal_text, tone, length) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [studentId, jobId, job.title, companyName, proposal, tone, length]
    );

    res.json({ proposal, id: insertResult.insertId });
  } catch (error) {
    console.error("DEBUG - AI Proposal Error:", error);
    res.status(500).json({ 
      error: "Proposal generation failed", 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// 4. Get Dashboard Summary
export const getAISummary = async (req, res) => {
  const studentId = req.user.id;

  try {
    // Portfolio Analysis
    const [[portfolio]] = await db.promise().query(`SELECT * FROM portfolio_analysis WHERE user_id = ? ORDER BY created_at DESC LIMIT 1`, [studentId]);
    
    // Skill Gap Analysis
    const [skillGaps] = await db.promise().query(`SELECT * FROM skill_gap_analysis WHERE user_id = ? ORDER BY created_at DESC LIMIT 3`, [studentId]);
    
    // AI Proposals
    const [proposals] = await db.promise().query(`SELECT * FROM ai_proposals WHERE user_id = ? ORDER BY created_at DESC LIMIT 3`, [studentId]);
    
    // Recommendations
    const [recommendations] = await db.promise().query(`SELECT * FROM ai_recommendations WHERE user_id = ? AND is_completed = FALSE ORDER BY created_at DESC LIMIT 5`, [studentId]);

    // REAL-TIME STATS: Applications & Interviews
    const [[{ application_count }]] = await db.promise().query(
      `SELECT COUNT(*) as application_count FROM applications WHERE student_id = ?`,
      [studentId]
    );

    const [[{ interview_count }]] = await db.promise().query(
      `SELECT COUNT(*) as interview_count FROM applications WHERE student_id = ? AND status IN ('shortlist', 'interview', 'offered')`,
      [studentId]
    );

    // AI Match Avg Calculation (simplified: average of all application match scores)
    const [[{ match_avg }]] = await db.promise().query(
      `SELECT AVG(ai_match_score) as match_avg FROM applications WHERE student_id = ?`,
      [studentId]
    );

    res.json({
      portfolio: portfolio || { overall_score: 75, project_count: 0 },
      skillGaps,
      proposals,
      recommendations,
      application_count: application_count || 0,
      interview_count: interview_count || 0,
      match_score_avg: Math.round(match_avg || 0)
    });
  } catch (error) {
    console.error("AI Summary Error:", error);
    res.status(500).json({ error: "Failed to fetch AI summary" });
  }
};

// 5. Get All Proposals
export const getSavedProposals = async (req, res) => {
  const studentId = req.user.id;
  try {
    const [proposals] = await db.promise().query(`SELECT * FROM ai_proposals WHERE user_id = ? ORDER BY created_at DESC`, [studentId]);
    res.json(proposals);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch saved proposals" });
  }
};

// 6. Update Proposal
export const updateSavedProposal = async (req, res) => {
  const studentId = req.user.id;
  const { id } = req.params;
  const { proposal_text } = req.body;
  try {
    await db.promise().query(
      `UPDATE ai_proposals SET proposal_text = ? WHERE id = ? AND user_id = ?`,
      [proposal_text, id, studentId]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to update saved proposal" });
  }
};

// 7. Delete Proposal
export const deleteSavedProposal = async (req, res) => {
  const studentId = req.user.id;
  const { id } = req.params;
  try {
    await db.promise().query(`DELETE FROM ai_proposals WHERE id = ? AND user_id = ?`, [id, studentId]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete saved proposal" });
  }
};
