import db from "../config/db.js";

/**
 * CREATE JOB
 * Recruiter / Admin only
 */
export const createJob = (req, res) => {
  const {
    title,
    description,
    job_type,
    budget,
    duration,
    location,
    experience_level,
    skills,
  } = req.body;

  if (!title || !description || !job_type || !budget || !experience_level) {
    return res.status(400).json({
      error: "Missing required fields",
    });
  }

  const posted_by = req.user.id; // ✅ FROM JWT — NOT BODY

  const insertJobQuery = `
    INSERT INTO jobs
    (title, description, job_type, budget, duration, location, experience_level, posted_by, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'open')
  `;

  db.query(
    insertJobQuery,
    [
      title,
      description,
      job_type,
      budget,
      duration || null,
      location || null,
      experience_level,
      posted_by,
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          error: "Job creation failed",
          message: err.message,
        });
      }

      const jobId = result.insertId;

      // Insert skills (optional)
      if (Array.isArray(skills) && skills.length > 0) {
        const skillValues = skills.map((skillId) => [jobId, skillId]);

        db.query(
          "INSERT INTO job_skills (job_id, skill_id) VALUES ?",
          [skillValues],
          (skillErr) => {
            if (skillErr) {
              return res.status(500).json({
                error: "Job created but skills insert failed",
                jobId,
                message: skillErr.message,
              });
            }

            return res.status(201).json({
              success: true,
              message: "Job posted successfully with skills",
              jobId,
            });
          }
        );
      } else {
        return res.status(201).json({
          success: true,
          message: "Job posted successfully",
          jobId,
        });
      }
    }
  );
};

/**
 * GET ALL JOBS
 */
export const getAllJobs = (req, res) => {
  const query = `
    SELECT 
      j.id,
      j.title,
      j.description,
      j.job_type,
      j.budget,
      j.duration,
      j.location,
      j.experience_level,
      j.status,
      j.created_at,
      u.name AS recruiter_name
    FROM jobs j
    JOIN users u ON j.posted_by = u.id
    ORDER BY j.created_at DESC
  `;

  db.query(query, (err, jobs) => {
    if (err) {
      return res.status(500).json({
        error: "Failed to fetch jobs",
        message: err.message,
      });
    }

    res.json(jobs);
  });
};

/**
 * GET JOB DETAILS
 */
export const getJobDetails = (req, res) => {
  const { id } = req.params;

  db.query("SELECT * FROM jobs WHERE id = ?", [id], (err, jobResult) => {
    if (err) {
      return res.status(500).json({
        error: "Database error",
        message: err.message,
      });
    }

    if (jobResult.length === 0) {
      return res.status(404).json({
        error: "Job not found",
      });
    }

    db.query(
      `
        SELECT s.name 
        FROM job_skills js
        JOIN skills s ON js.skill_id = s.id
        WHERE js.job_id = ?
        `,
      [id],
      (skillErr, skills) => {
        if (skillErr) {
          return res.status(500).json({
            error: "Failed to load job skills",
            message: skillErr.message,
          });
        }

        res.json({
          ...jobResult[0],
          skills: skills.map((s) => s.name),
        });
      }
    );
  });
};
