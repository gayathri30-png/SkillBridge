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




// --------------------------------
// MARKET INTELLIGENCE (Salary Benchmarks & Dashboard)
// --------------------------------
export const getMarketIntelligence = async (req, res) => {
  const { jobId } = req.params;

  try {
    if (jobId) {
      // Logic for a specific job post - focus on demand vs supply
      const [skills] = await db.promise().query(
        `SELECT s.name FROM skills s JOIN job_skills js ON s.id = js.skill_id WHERE js.job_id = ?`,
        [jobId]
      );
      const skillNames = skills.map(s => s.name);

      const [candidateMatchCount] = await db.promise().query(`
        SELECT COUNT(DISTINCT us.user_id) as count
        FROM user_skills us
        JOIN skills s ON us.skill_id = s.id
        WHERE s.name IN (?)
      `, [skillNames.length > 0 ? skillNames : ['']]);

      return res.json({
        jobId,
        benchmarks: {
          market_demand: candidateMatchCount[0].count > 5 ? "High" : "Moderate",
          insight: `${candidateMatchCount[0].count} qualified candidates found on the platform with matching skills.`
        }
      });
    }

    // GENERAL DASHBOARD LOGIC
    const [[candidatesRes]] = await db.promise().query(`SELECT COUNT(*) as total FROM users WHERE role = 'student'`);
    const [[avgScoreRes]] = await db.promise().query(`SELECT AVG(ai_match_score) as avgScore FROM applications WHERE ai_match_score IS NOT NULL`);
    
    const [topSkillsList] = await db.promise().query(`
      SELECT s.name as skill, COUNT(us.skill_id) as demand
      FROM skills s
      JOIN user_skills us ON s.id = us.skill_id
      GROUP BY s.id, s.name
      ORDER BY demand DESC
      LIMIT 5
    `);

    res.json({
      success: true,
      data: {
        totalCandidates: candidatesRes.total || 0,
        averageMatchScore: Math.round(avgScoreRes.avgScore || 0),
        topSkills: topSkillsList.map(s => ({ name: s.skill, count: s.demand })),
        insights: [`The platform currently hosts ${candidatesRes.total || 0} active talent profiles.`]
      }
    });

  } catch (error) {
    console.error("Market analysis failed:", error);
    res.status(500).json({ error: "Market analysis failed" });
  }
};




// --------------------------------
// AI 31: SMART JOB POST GENERATOR (COPILOT)
// --------------------------------
export const generateJobPost = async (req, res) => {
  const { title, skills, tone = 'Professional' } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Job title is required for generation." });
  }

  try {
    const prompt = `
      You are an expert technical recruiter and copywriter.
      Write a compelling, detailed, and professional job description for the role of "${title}".
      
      Requirements:
      1. Essential Skills to emphasize: ${skills && skills.length > 0 ? skills.join(", ") : "general technical skills relevant to the role"}.
      2. Tone: The tone must be strictly ${tone}. (e.g., if Engaging, use energetic language; if Professional, keep it formal and structured; if Urgent, emphasize immediate impact).
      3. Structure the output clearly with the following sections (do NOT use markdown markdown code blocks like \`\`\`markdown):
         - A short, engaging summary paragraph.
         - "Key Responsibilities" (bullet points).
         - "Requirements" (bullet points, including the essential skills).
      4. Output ONLY the generated job description text. Do NOT include any conversational filler.
    `;

    const generatedPost = await generateGeminiResponse(prompt, "You are an expert tech recruiter writing a job description. Return only the description text.");

    if (!generatedPost || generatedPost.trim() === "") {
        throw new Error("AI returned an empty response.");
    }

    res.json({
        success: true,
        generatedDescription: generatedPost.replace(/```markdown\n?/g, '').replace(/```\n?/g, '').trim()
    });

  } catch (error) {
    console.error("AI Job Post Generation Error:", error);
    // Fallback if AI fails
    let fallbackText = `We are looking for a talented ${title} to join our growing team.\n\nKey Responsibilities:\n- Collaborate with cross-functional teams to design, build, and maintain software.\n- Ensure code quality and performance.\n\nRequirements:\n- Proficiency in ${skills && skills.length > 0 ? skills.join(", ") : "relevant technologies"}.\n- Strong problem-solving skills and teamwork.\n\nIf you are passionate about this field, apply now!`;
    
    if (tone === 'Engaging') {
        fallbackText = `Are you ready to make a massive impact? We're on the hunt for a rockstar ${title}!\n\nWhat you'll do:\n- Build amazing products with an incredible team.\n- Drive innovation every single day.\n\nWhat you need:\n- Deep expertise in ${skills && skills.length > 0 ? skills.join(", ") : "your craft"}.\n- A passion for learning and growing.\n\nCome build the future with us!`;
    }

    res.json({
        success: true,
        generatedDescription: fallbackText,
        note: "Generated using fallback templates due to AI service unavailability."
    });
  }
};

// --------------------------------
// MODULE 12: PHASE 2 - SPECIALIZED AI
// --------------------------------

// Get real recruiter-posted jobs for the Skill Gap Detector
export const getJobsForSkillGap = async (req, res) => {
  try {
    const [jobs] = await db.promise().query(`
      SELECT j.id, j.title, COALESCE(u.company_name, u.name) AS company_name, j.location,
        (SELECT JSON_ARRAYAGG(s.name)
         FROM job_skills js JOIN skills s ON s.id = js.skill_id
         WHERE js.job_id = j.id) AS skills_required
      FROM jobs j
      JOIN users u ON j.posted_by = u.id
      WHERE j.status = 'open'
      ORDER BY j.created_at DESC
      LIMIT 20
    `);

    // Parse skills and filter out jobs with no skills
    const enriched = jobs
      .map(j => ({
        ...j,
        skills_required: typeof j.skills_required === 'string'
          ? JSON.parse(j.skills_required)
          : (j.skills_required || [])
      }))
      .filter(j => j.skills_required && j.skills_required.length > 0);

    res.json(enriched);
  } catch (error) {
    console.error('Failed to fetch jobs for skill gap:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
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
    } else if (jobTitle) {
      // Detector mode: find a real job matching the title and use its real skills
      console.log("Detector mode: searching for real job with title:", currentJobTitle);
      const [matchingJobs] = await db.promise().query(
        `SELECT id, title FROM jobs WHERE title = ? AND status = 'open' LIMIT 1`,
        [jobTitle]
      );

      if (matchingJobs.length > 0) {
        const realJob = matchingJobs[0];
        currentJobTitle = realJob.title;
        const [skills] = await db.promise().query(
          `SELECT s.name FROM skills s JOIN job_skills js ON s.id = js.skill_id WHERE js.job_id = ?`,
          [realJob.id]
        );
        jobSkills = skills;
      } else {
        return res.status(404).json({ error: `No active job found with title "${jobTitle}". Please select from available jobs.` });
      }
    } else {
      return res.status(400).json({ error: 'Please provide a jobId or jobTitle to analyze.' });
    }

    console.log("Fetching student skills...");
    const [studentSkills] = await db.promise().query(
      `SELECT s.name FROM skills s JOIN user_skills us ON s.id = us.skill_id WHERE us.user_id = ?`,
      [studentId]
    );

    console.log("Calculating matches...");
    const matched = jobSkills.filter(js => studentSkills.some(ss => ss.name.toLowerCase() === js.name.toLowerCase()));
    const missing = jobSkills.filter(js => !studentSkills.some(ss => ss.name.toLowerCase() === js.name.toLowerCase())).map(s => s.name);

    const matchPercentage = jobSkills.length > 0 ? Math.round((matched.length / jobSkills.length) * 100) : 0;

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
            difficulty: "Analysis Pending",
            impact: 10,
            resources: [
              { name: `${skill} Documentation`, url: `https://www.google.com/search?q=${encodeURIComponent(skill)}+official+documentation` }
            ],
            estimated_time: "Varies"
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
    
    const projects = [];

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

      Requirements:
      1. Tone: The tone must be strictly ${tone}. (e.g., if Friendly, use enthusiastic language; if Professional, keep it formal).
      2. Length: The length must be ${length}. (Short = 1-2 paragraphs, Medium = 3 paragraphs, Long = 4-5 paragraphs).
      3. Focus: Weave the applicant's project highlights naturally into the proposal to prove they can do the job described.
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
    const [[user]] = await db.promise().query(`SELECT * FROM users WHERE id = ?`, [studentId]);
    const [userSkills2] = await db.promise().query(`SELECT * FROM user_skills WHERE user_id = ?`, [studentId]);

    // 1. Profile Strength Calculation
    let profileStrength = 20; // Base score
    if (user && user.bio && user.bio.trim() !== "") profileStrength += 20;
    if (user && user.avatar_url && user.avatar_url.trim() !== "") profileStrength += 15;
    if (user && user.location && user.location.trim() !== "") profileStrength += 15;
    if (userSkills2.length > 0) profileStrength += 15;
    if (userSkills2.length > 3) profileStrength += 15;
    profileStrength = Math.min(100, Math.round(profileStrength));

    // Skill Gap Analysis
    const [skillGaps] = await db.promise().query(`SELECT * FROM skill_gap_analysis WHERE user_id = ? ORDER BY created_at DESC LIMIT 3`, [studentId]);
    
    // AI Proposals
    const [proposals] = await db.promise().query(`SELECT * FROM ai_proposals WHERE user_id = ? ORDER BY created_at DESC LIMIT 3`, [studentId]);
    
    // Recommendations (Fetch more so we can deduplicate and still return ~5)
    const [rawRecommendations] = await db.promise().query(`SELECT * FROM ai_recommendations WHERE user_id = ? AND is_completed = FALSE ORDER BY created_at DESC LIMIT 20`, [studentId]);
    
    // Deduplicate recommendations
    const uniqueRecsMap = new Map();
    for (const rec of rawRecommendations) {
       if (!uniqueRecsMap.has(rec.recommendation_text)) {
           uniqueRecsMap.set(rec.recommendation_text, rec);
       }
    }
    const recommendations = Array.from(uniqueRecsMap.values()).slice(0, 5);

    // 2. Aggregate Recent Activity
    const [recentApps] = await db.promise().query(
      `SELECT a.id, j.title, a.created_at FROM applications a JOIN jobs j ON a.job_id = j.id WHERE a.student_id = ? ORDER BY a.created_at DESC LIMIT 10`,
      [studentId]
    );

    let rawActivityStream = [
      ...recentApps.map(a => ({ id: `app_${a.id}`, action: 'Applied to Job', title: a.title, date: a.created_at, iconType: 'Briefcase' })),
      ...proposals.map(p => ({ id: `prop_${p.id}`, action: 'Generated AI Proposal', title: p.job_title, date: p.created_at, iconType: 'FileText' })),
      ...skillGaps.map(s => ({ id: `gap_${s.id}`, action: `Skill Gap Analyzed (${s.match_percentage || 0}%)`, title: s.job_title, date: s.created_at, iconType: 'Target' }))
    ];
    
    rawActivityStream.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Deduplicate activity stream by action and title
    const uniqueActivityMap = new Map();
    for (const act of rawActivityStream) {
       const key = `${act.action}-${act.title}`;
       if (!uniqueActivityMap.has(key)) {
           uniqueActivityMap.set(key, act);
       }
    }
    const recentActivity = Array.from(uniqueActivityMap.values()).slice(0, 5);

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

    // Proposal Stats Aggregation
    const [[{ total_generated }]] = await db.promise().query(
      `SELECT COUNT(*) as total_generated FROM ai_proposals WHERE user_id = ?`,
      [studentId]
    );

    const [[proposalStatusCounts]] = await db.promise().query(`
      SELECT 
        COUNT(*) as total_sent,
        SUM(CASE WHEN status IN ('offered', 'accepted') THEN 1 ELSE 0 END) as total_accepted,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as total_rejected,
        SUM(CASE WHEN status IN ('pending', 'under_review', 'shortlist', 'interview') THEN 1 ELSE 0 END) as total_pending
      FROM applications WHERE student_id = ?
    `, [studentId]);

    const sent = proposalStatusCounts?.total_sent || 0;
    const accepted = proposalStatusCounts?.total_accepted || 0;
    const rejected = proposalStatusCounts?.total_rejected || 0;
    const pending = proposalStatusCounts?.total_pending || 0;
    
    const acceptanceRate = sent > 0 ? Math.round((accepted / sent) * 100) : 0;

    const proposalStats = {
      totalGenerated: total_generated || 0,
      totalSent: sent,
      totalAccepted: accepted,
      totalRejected: rejected,
      totalPending: pending,
      acceptanceRate
    };

    res.json({
      profileStrength,
      recentActivity,
      skillGaps,
      proposals,
      recommendations,
      application_count: application_count || 0,
      interview_count: interview_count || 0,
      match_score_avg: Math.round(match_avg || 0),
      proposalStats
    });
  } catch (error) {
    console.error("AI Summary Error:", error);
    res.status(500).json({ error: "Failed to fetch AI summary" });
  }
};

// Advanced Priority Upskilling Dashboard Logic
export const getAdvancedUpskilling = async (req, res) => {
  const studentId = req.user.id;
  try {
    const promiseQuery = db.promise().query.bind(db.promise());

    // 1. Get user's current skills
    const [userSkillsData] = await promiseQuery(`
      SELECT s.name 
      FROM user_skills us 
      JOIN skills s ON us.skill_id = s.id 
      WHERE us.user_id = ?
    `, [studentId]);
    const userSkills = userSkillsData.map(s => s.name.toLowerCase());

    // 2. Get active jobs and their demanded skills
    const [activeJobs] = await promiseQuery(`
      SELECT j.id, j.title, j.budget as salary, u.company_name, u.name as recruiter_name,
             GROUP_CONCAT(DISTINCT s.name) as job_skills
      FROM jobs j 
      JOIN users u ON j.posted_by = u.id
      JOIN job_skills js ON j.id = js.job_id
      JOIN skills s ON js.skill_id = s.id
      WHERE j.status = 'open'
      GROUP BY j.id
    `);

    let skillDemand = {}; // Counts how many jobs require a skill
    let skillJobCategories = {}; // Which job titles need this skill
    let missingSkillOpportunities = {}; // Map missing skills to jobs that require them

    activeJobs.forEach(job => {
      const company = job.company_name || job.recruiter_name || 'Tech Company';
      if (!job.job_skills) return;

      const reqSkills = job.job_skills.split(',');
      let matchCount = 0;
      let missingFromJob = [];

      reqSkills.forEach(reqSkill => {
        const rName = reqSkill.trim();
        const rNameLow = rName.toLowerCase();
        
        // Count market demand
        if (!skillDemand[rName]) {
          skillDemand[rName] = { count: 0, name: rName };
          skillJobCategories[rName] = new Set();
        }
        skillDemand[rName].count++;
        // Add first word of job title as a category approximation (e.g. "Frontend")
        skillJobCategories[rName].add(job.title.split(' ')[0]);

        // Check if user has it
        if (userSkills.includes(rNameLow)) {
          matchCount++;
        } else {
          missingFromJob.push(rName);
        }
      });

      const matchScore = Math.round((matchCount / reqSkills.length) * 100);
      
      // If the user is missing skills for this job, record it
      missingFromJob.forEach(missingSkill => {
        if (!missingSkillOpportunities[missingSkill]) {
          missingSkillOpportunities[missingSkill] = [];
        }
        missingSkillOpportunities[missingSkill].push({
          title: job.title,
          company: company,
          salary: job.salary,
          match: matchScore,
          id: job.id
        });
      });
    });

    // 3. Calculate Market Demand (Top Trending Skills)
    const totalJobs = activeJobs.length || 1;
    const trendingSkills = Object.values(skillDemand)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map((s, idx) => {
        const isGap = !userSkills.includes(s.name.toLowerCase());
        const demandPct = Math.min(100, Math.round((s.count / totalJobs) * 100) + 10);
        return {
          name: s.name,
          demand_percentage: demandPct,
          increase: Math.max(5, demandPct - (idx * 8)), // Deterministic: higher-ranked skills show stronger trend
          is_gap: isGap
        };
      });

    // 4. Calculate User's Priority Skills (Missing skills with highest demand)
    const prioritySkillsRaw = Object.entries(missingSkillOpportunities)
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 3);
      
    const prioritySkills = prioritySkillsRaw.map(([skillName, jobs], index) => {
      const demandCount = skillDemand[skillName] ? skillDemand[skillName].count : 0;
      return {
        id: index + 1,
        skill: skillName,
        impact: Math.round((jobs.length / totalJobs) * 100) || 0,
        demand: Math.min(100, Math.round((demandCount / totalJobs) * 100) + 15),
        categories: Array.from(skillJobCategories[skillName] || []).slice(0, 3).join(', '),
        unlockable_jobs: jobs.sort((a, b) => b.match - a.match).slice(0, 3), // Top 3 jobs they almost qualify for
        total_unlocks: jobs.length
      };
    });

    res.json({
      priority_skills: prioritySkills,
      market_demand: {
        trending: trendingSkills,
        user_skills: userSkillsData.map(s => s.name),
        gap_skills: trendingSkills.filter(s => s.is_gap).map(s => s.name)
      }
    });

  } catch (error) {
    console.error("Advanced Upskilling Error:", error);
    res.status(500).json({ error: "Failed to fetch advanced upskilling data" });
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

// 8. Get Recruiter AI Summary
export const getRecruiterAISummary = async (req, res) => {
  const recruiterId = req.user.id;
  try {
    const promiseQuery = db.promise().query.bind(db.promise());

    // 1. Get active jobs posted by this recruiter
    const [activeJobs] = await promiseQuery(`
      SELECT id, title, created_at FROM jobs WHERE posted_by = ? AND status = 'open'
    `, [recruiterId]);

    const jobIds = activeJobs.map(j => j.id);

    // 2. Get applications for these jobs to calculate matches
    let smartMatches = 0;
    let recentApps = [];
    if (jobIds.length > 0) {
      const qs = jobIds.map(() => '?').join(',');
      const [apps] = await promiseQuery(`
        SELECT a.id, a.ai_match_score, a.created_at, j.title as job_title 
        FROM applications a 
        JOIN jobs j ON a.job_id = j.id
        WHERE a.job_id IN (${qs})
        ORDER BY a.created_at DESC
      `, jobIds);

      smartMatches = apps.filter(a => a.ai_match_score >= 85).length;
      recentApps = apps.slice(0, 5);
    }

    const generatedPosts = activeJobs.length;
    
    // Competitiveness score: formulated based on high matches / active jobs
    let competitiveness = 0;
    if (activeJobs.length > 0) {
      competitiveness = Math.min(100, Math.round((smartMatches / activeJobs.length) * 20 + 50)); 
    }

    let activityStream = [
      ...recentApps.map(a => ({ 
        id: `app_${a.id}`, 
        action: 'Candidate Matching Analysis', 
        title: `New applicant for ${a.job_title} (${a.ai_match_score || 0}% match)`, 
        date: a.created_at, 
        iconType: 'Target' 
      })),
      ...activeJobs.map(j => ({ 
        id: `job_${j.id}`, 
        action: 'Job Post Optimization', 
        title: `AI analyzed newly posted job: ${j.title}`, 
        date: j.created_at, 
        iconType: 'Zap' 
      }))
    ];
    activityStream.sort((a, b) => new Date(b.date) - new Date(a.date));
    const recentActivity = activityStream.slice(0, 4);

    let recommendations = [];
    if (smartMatches > 0) {
      recommendations.push({
        priority: 'high',
        recommendation_type: 'Action',
        recommendation_text: `You have ${smartMatches} highly matched candidates waiting for review.`
      });
    }
    if (activeJobs.length === 0) {
      recommendations.push({
        priority: 'medium',
        recommendation_type: 'Tip',
        recommendation_text: 'Generate a new AI-optimized job post to attract top talent.'
      });
    } else if (smartMatches === 0 && recentApps.length > 0) {
      recommendations.push({
         priority: 'medium',
         recommendation_type: 'Optimization',
         recommendation_text: 'Consider using our AI tool to rewrite your job descriptions to improve candidate match quality.'
      });
    }
    
    if (recommendations.length === 0) {
       recommendations.push({
         priority: 'low',
         recommendation_type: 'Insight',
         recommendation_text: 'Your current pipeline looks healthy. No immediate actions required.'
       });
    }

    res.json({
      smartMatches,
      generatedPosts,
      competitiveness,
      recentActivity,
      recommendations
    });
  } catch (error) {
    console.error("Recruiter AI Summary Error:", error);
    res.status(500).json({ error: "Failed to fetch recruiter AI summary" });
  }
};



// ================================
// SIMPLIFIED EVALUATION ENGINE (NON-MOCK)
// ================================
export const evaluateApplication = async (req, res) => {
  const { applicationId } = req.params;

  try {
    const [[appData]] = await db.promise().query(`
      SELECT 
        a.id as application_id, a.student_id, a.job_id, a.proposal, 
        a.ai_match_score, a.status, a.suggestion_sent, a.created_at,
        u.id as user_id, u.name as student_name, u.email as student_email,
        u.bio as student_bio, u.avatar, u.location as student_location,
        u.github_url, u.linkedin_url,
        j.title as job_title, j.description as job_desc, j.location as job_location,
        (SELECT GROUP_CONCAT(s.name) FROM user_skills us JOIN skills s ON us.skill_id = s.id WHERE us.user_id = u.id) as student_skills,
        (SELECT GROUP_CONCAT(s.name) FROM job_skills js JOIN skills s ON js.skill_id = s.id WHERE js.job_id = j.id) as job_skills
      FROM applications a
      JOIN users u ON a.student_id = u.id
      JOIN jobs j ON a.job_id = j.id
      WHERE a.id = ?
    `, [applicationId]);

    if (!appData) return res.status(404).json({ error: "Application not found" });

    const studentSkills = appData.student_skills ? appData.student_skills.split(',').map(s => s.trim()) : [];
    const jobSkills = appData.job_skills ? appData.job_skills.split(',').map(s => s.trim()) : [];

    const matchedSkills = studentSkills.filter(ss => jobSkills.some(js => js.toLowerCase() === ss.toLowerCase()));
    const missingSkills = jobSkills.filter(js => !studentSkills.some(ss => ss.toLowerCase() === js.toLowerCase()));

    res.json({
      applicationId: parseInt(applicationId),
      candidate: {
        name: appData.student_name,
        email: appData.student_email,
        bio: appData.student_bio,
        location: appData.student_location,
        avatarUrl: appData.avatar,
        githubUrl: appData.github_url,
        linkedinUrl: appData.linkedin_url
      },
      job: { title: appData.job_title },
      application: {
        status: appData.status,
        matchScore: appData.ai_match_score || 0,
        appliedAt: appData.created_at,
        proposal: appData.proposal
      },
      tabs: {
        skillGap: {
          matchPercentage: appData.ai_match_score || 0,
          skills: jobSkills.map(js => ({
            skill: js,
            requirement: 'Required',
            status: studentSkills.some(ss => ss.toLowerCase() === js.toLowerCase()) ? 'match' : 'missing'
          })),
          missingSkills
        },
        behavioralAnalysis: {
           communicationStyle: "Standard",
           communicationTraits: [],
           sentiment: { label: "Professional", description: "Standard professional application." }
        },
        interviewPrep: { questions: [] },
        executiveSummary: {
          verdict: (appData.ai_match_score || 0) >= 70 ? "Recommended" : "Review Needed",
          summary: `Candidate matches ${matchedSkills.length} out of ${jobSkills.length} required skills.`
        }
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Evaluation failed" });
  }
};

export const reEvaluateApplication = async (req, res) => {
    const { applicationId } = req.params;
    try {
        const [[app]] = await db.promise().query(`
            SELECT a.job_id, a.student_id,
                   (SELECT GROUP_CONCAT(s.name) FROM user_skills us JOIN skills s ON us.skill_id = s.id WHERE us.user_id = a.student_id) as student_skills,
                   (SELECT GROUP_CONCAT(s.name) FROM job_skills js JOIN skills s ON js.skill_id = s.id WHERE js.job_id = a.job_id) as job_skills
            FROM applications a WHERE a.id = ?
        `, [applicationId]);

        if (!app) return res.status(404).json({ error: "Application not found" });

        const sSkills = app.student_skills ? app.student_skills.split(',').map(s => s.trim().toLowerCase()) : [];
        const jSkills = app.job_skills ? app.job_skills.split(',').map(s => s.trim().toLowerCase()) : [];

        const matched = jSkills.filter(js => sSkills.includes(js));
        const newScore = jSkills.length > 0 ? Math.round((matched.length / jSkills.length) * 100) : 75;

        await db.promise().query(`UPDATE applications SET ai_match_score = ? WHERE id = ?`, [newScore, applicationId]);

        res.json({ 
            success: true, 
            newScore,
            message: `Application re-evaluated. New AI Match Score: ${newScore}%` 
        });

    } catch (error) {
        console.error("Re-evaluation Error:", error);
        res.status(500).json({ error: "Failed to re-evaluate application" });
    }
};

// --------------------------------
// AI: REAL-TIME JOB RECOMMENDATIONS
// --------------------------------
export const getRecommendedJobs = async (req, res) => {
  const studentId = req.user.id;
  try {
    // 1. Get user's current skills
    const [userSkillsData] = await db.promise().query(`
      SELECT s.name 
      FROM user_skills us 
      JOIN skills s ON us.skill_id = s.id 
      WHERE us.user_id = ?
    `, [studentId]);
    const userSkills = new Set(userSkillsData.map(s => s.name.toLowerCase()));

    // 2. Get active jobs and their demanded skills
    const [activeJobs] = await db.promise().query(`
      SELECT j.id, j.title, j.job_type, j.location, u.name as recruiter_name,
             GROUP_CONCAT(DISTINCT s.name) as job_skills
      FROM jobs j 
      JOIN users u ON j.posted_by = u.id
      JOIN job_skills js ON j.id = js.job_id
      JOIN skills s ON js.skill_id = s.id
      WHERE j.status = 'open'
      GROUP BY j.id
    `);

    // 3. Calculate match scores
    const recommendations = activeJobs.map(job => {
      if (!job.job_skills) return { ...job, matchScore: 0 };
      
      const reqSkills = job.job_skills.split(',').map(s => s.trim().toLowerCase());
      const matched = reqSkills.filter(s => userSkills.has(s));
      const score = Math.round((matched.length / reqSkills.length) * 100);

      return {
        id: job.id,
        title: job.title,
        recruiter_name: job.recruiter_name,
        job_type: job.job_type,
        location: job.location,
        matchScore: score
      };
    });

    // 4. Sort and return top 3
    const topRecommendations = recommendations
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 3);

    res.json(topRecommendations);

  } catch (error) {
    console.error("Job Recommendations Error:", error);
    res.status(500).json({ error: "Failed to fetch job recommendations" });
  }
};
