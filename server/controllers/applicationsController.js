import db from "../config/db.js";

// --------------------------------
// 1. STUDENT APPLY TO JOB (WITH AI MATCH SCORE)
// --------------------------------
export const applyToJob = (req, res) => {
  const { job_id, proposal } = req.body;
  const student_id = req.user.id;

  if (!job_id || !proposal) {
    return res.status(400).json({ error: "job_id and proposal are required" });
  }

  // 0. Check job exists and is open
  db.query(
    "SELECT id, status FROM jobs WHERE id = ?",
    [job_id],
    (err, jobs) => {
      if (err) return res.status(500).json({ error: "Database error" });

      if (jobs.length === 0) {
        return res.status(404).json({ error: "Job not found" });
      }

      if (jobs[0].status === "closed") {
        return res.status(400).json({ error: "Job is closed" });
      }

      // 1. Prevent duplicate
      db.query(
        "SELECT id FROM applications WHERE job_id = ? AND student_id = ?",
        [job_id, student_id],
        (err, rows) => {
          if (err) return res.status(500).json({ error: "Database error" });

          if (rows.length > 0) {
            return res.status(400).json({
              error: "Already applied to this job",
            });
          }

          // 2. Calculate AI Match Score
          db.query(
            `
            SELECT 
              COALESCE(
                SUM(
                  CASE us.proficiency
                    WHEN 'Beginner' THEN 1
                    WHEN 'Intermediate' THEN 2
                    WHEN 'Advanced' THEN 3
                  END
                ), 0
              ) AS obtained,
              COUNT(js.skill_id) * 3 AS total
            FROM job_skills js
            LEFT JOIN user_skills us
              ON js.skill_id = us.skill_id
             AND us.user_id = ?
            WHERE js.job_id = ?
            `,
            [student_id, job_id],
            (err, result) => {
              if (err) return res.status(500).json({ error: "Database error" });

              const obtained = result[0].obtained || 0;
              const total = result[0].total || 0;

              const matchScore =
                total === 0 ? 0 : ((obtained / total) * 100).toFixed(2);

              // 3. Insert application
              db.query(
                `
                INSERT INTO applications
                (job_id, student_id, proposal, ai_match_score, status)
                VALUES (?, ?, ?, ?, 'pending')
                `,
                [job_id, student_id, proposal, matchScore],
                (err, insertResult) => {
                  if (err)
                    return res.status(500).json({ error: "Insert failed" });

                  res.status(201).json({
                    success: true,
                    message: "Application submitted",
                    application_id: insertResult.insertId,
                    ai_match_score: matchScore,
                  });
                },
              );
            },
          );
        },
      );
    },
  );
};

// --------------------------------
// 2. RECRUITER: VIEW APPLICATIONS FOR OWN JOB
// --------------------------------
export const getJobApplications = (req, res) => {
  const { job_id } = req.params;
  const recruiter_id = req.user.id;

  const query = `
    SELECT 
      a.id,
      a.proposal,
      a.status,
      a.ai_match_score,
      a.created_at,
      u.id AS student_id,
      u.name AS student_name,
      u.email AS student_email
    FROM applications a
    JOIN users u ON a.student_id = u.id
    JOIN jobs j ON a.job_id = j.id
    WHERE a.job_id = ? AND j.posted_by = ?
    ORDER BY a.ai_match_score DESC
  `;

  db.query(query, [job_id, recruiter_id], (err, data) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json({
      success: true,
      count: data.length,
      applicants: data,
    });
  });
};

// --------------------------------
// 3. STUDENT: VIEW OWN APPLICATIONS
// --------------------------------
export const getStudentApplications = (req, res) => {
  const student_id = req.user.id;

  db.query(
    `
    SELECT 
      a.id,
      a.status,
      a.ai_match_score,
      a.created_at,
      j.title,
      j.job_type,
      j.budget,
      j.experience_level
    FROM applications a
    JOIN jobs j ON a.job_id = j.id
    WHERE a.student_id = ?
    ORDER BY a.created_at DESC
    `,
    [student_id],
    (err, data) => {
      if (err) return res.status(500).json({ error: "Database error" });
      res.json(data);
    },
  );
};

// --------------------------------
// 4. RECRUITER: UPDATE APPLICATION STATUS (ONLY OWN JOB)
// --------------------------------
export const updateStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const recruiter_id = req.user.id;

  const allowedStatus = ["pending", "accepted", "rejected"];
  if (!allowedStatus.includes(status)) {
    return res.status(400).json({ error: "Invalid status value" });
  }

  // SECURITY: recruiter can update ONLY their job’s applications
  db.query(
    `
    UPDATE applications a
    JOIN jobs j ON a.job_id = j.id
    SET a.status = ?
    WHERE a.id = ? AND j.posted_by = ?
    `,
    [status, id, recruiter_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Database error" });

      if (result.affectedRows === 0) {
        return res.status(404).json({
          error: "Application not found or not authorized",
        });
      }

      res.json({
        success: true,
        message: "Application status updated",
      });
    },
  );
};
// --------------------------------
// 5. RECRUITER: VIEW APPLICANTS SORTED BY AI MATCH SCORE
// --------------------------------
export const getJobApplicantsSorted = (req, res) => {
  const { job_id } = req.params;
  const recruiter_id = req.user.id;

  const query = `
    SELECT 
      a.id AS application_id,
      a.proposal,
      a.status,
      a.ai_match_score,
      a.created_at,

      u.id AS student_id,
      u.name AS student_name,
      u.email AS student_email

    FROM applications a
    JOIN users u ON a.student_id = u.id
    JOIN jobs j ON a.job_id = j.id

    WHERE a.job_id = ?
      AND j.posted_by = ?

    ORDER BY 
      CAST(a.ai_match_score AS DECIMAL(5,2)) DESC,
      a.created_at DESC
  `;

  db.query(query, [job_id, recruiter_id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }

    res.json({
      success: true,
      count: results.length,
      applicants: results,
    });
  });
};
// --------------------------------
// 6. STUDENT: VIEW SKILL GAP FOR A JOB (RECOMMENDATION ENGINE)
// --------------------------------
export const getSkillGapForJob = (req, res) => {
  const { job_id } = req.params;
  const student_id = req.user.id;

  const query = `
    SELECT 
      s.name AS skill_name,
      CASE 
        WHEN us.id IS NULL THEN 'missing'
        ELSE 'matched'
      END AS status
    FROM job_skills js
    JOIN skills s ON js.skill_id = s.id
    LEFT JOIN user_skills us
      ON js.skill_id = us.skill_id
     AND us.user_id = ?
    WHERE js.job_id = ?
  `;

  db.query(query, [student_id, job_id], (err, rows) => {
    if (err) return res.status(500).json(err);

    const required_skills = [];
    const matched_skills = [];
    const missing_skills = [];

    rows.forEach((row) => {
      required_skills.push(row.skill_name);

      if (row.status === "matched") {
        matched_skills.push(row.skill_name);
      } else {
        missing_skills.push(row.skill_name);
      }
    });

    res.json({
      success: true,
      job_id: job_id,
      required_skills,
      matched_skills,
      missing_skills,
      recommendation:
        missing_skills.length === 0
          ? "You are fully qualified for this job"
          : `Learn ${missing_skills.join(", ")} to improve your match score`,
    });
  });
};
