import db from "../config/db.js";
import { createNotification } from "./notificationController.js";

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
    async (err, result) => {
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

            // --- JOB MATCH NOTIFICATIONS ---
            // Find students who have matched skills
            const matchQuery = `
              SELECT DISTINCT user_id 
              FROM user_skills 
              WHERE skill_id IN (?)
            `;
            db.query(matchQuery, [skills], (matchErr, matchedUsers) => {
              if (!matchErr) {
                matchedUsers.forEach(user => {
                  createNotification(
                    user.user_id,
                    'job_match',
                    `New job match: ${title} matches your skills!`,
                    jobId
                  ).catch(console.error);
                });
              }
            });

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
 * GET ALL JOBS (Enhanced with skills for matching)
 */
export const getAllJobs = (req, res) => {
  const { status, type, experience, location } = req.query;
  
  let query = `
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
      u.name AS recruiter_name,
      GROUP_CONCAT(s.name) AS skills_required
    FROM jobs j
    JOIN users u ON j.posted_by = u.id
    LEFT JOIN job_skills js ON j.id = js.job_id
    LEFT JOIN skills s ON js.skill_id = s.id
    WHERE 1=1
  `;
  
  const queryParams = [];
  
  if (status) {
    query += " AND j.status = ?";
    queryParams.push(status);
  }
  if (type) {
    query += " AND j.job_type = ?";
    queryParams.push(type);
  }
  if (experience) {
    query += " AND j.experience_level = ?";
    queryParams.push(experience);
  }
  if (location) {
    query += " AND j.location LIKE ?";
    queryParams.push(`%${location}%`);
  }
  if (req.query.search) {
    query += " AND (j.title LIKE ? OR u.name LIKE ?)";
    const searchVal = `%${req.query.search}%`;
    queryParams.push(searchVal, searchVal);
  }
  if (req.query.skill) {
    query += " AND j.id IN (SELECT js2.job_id FROM job_skills js2 JOIN skills s2 ON js2.skill_id = s2.id WHERE LOWER(s2.name) = LOWER(?))";
    queryParams.push(req.query.skill);
  }

  query += " GROUP BY j.id ORDER BY j.created_at DESC";

  db.query(query, queryParams, (err, jobs) => {
    if (err) {
      return res.status(500).json({
        error: "Failed to fetch jobs",
        message: err.message,
      });
    }

    // Convert comma-separated skills back to array
    const localizedJobs = jobs.map(job => ({
      ...job,
      skills_required: job.skills_required ? job.skills_required.split(',') : []
    }));

    res.json(localizedJobs);
  });
};

/**
 * TOGGLE SAVE JOB (Heart Icon)
 */
export const toggleSaveJob = (req, res) => {
  const userId = req.user.id;
  const jobId = req.params.id;

  // Check if already saved
  db.query(
    "SELECT id FROM saved_jobs WHERE user_id = ? AND job_id = ?",
    [userId, jobId],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });

      if (results.length > 0) {
        // Unsave
        db.query(
          "DELETE FROM saved_jobs WHERE user_id = ? AND job_id = ?",
          [userId, jobId],
          (delErr) => {
            if (delErr) return res.status(500).json({ error: "Failed to unsave" });
            res.json({ success: true, saved: false });
          }
        );
      } else {
        // Save
        db.query(
          "INSERT INTO saved_jobs (user_id, job_id) VALUES (?, ?)",
          [userId, jobId],
          (insErr) => {
            if (insErr) return res.status(500).json({ error: "Failed to save" });
            res.json({ success: true, saved: true });
          }
        );
      }
    }
  );
};

/**
 * GET SAVED JOBS
 */
export const getSavedJobs = (req, res) => {
  const userId = req.user.id;

  const query = `
    SELECT j.*, u.name as recruiter_name, GROUP_CONCAT(s.name) as skills_required
    FROM saved_jobs sj
    JOIN jobs j ON sj.job_id = j.id
    JOIN users u ON j.posted_by = u.id
    LEFT JOIN job_skills js ON j.id = js.job_id
    LEFT JOIN skills s ON js.skill_id = s.id
    WHERE sj.user_id = ?
    GROUP BY j.id
    ORDER BY sj.created_at DESC
  `;

  db.query(query, [userId], (err, jobs) => {
    if (err) return res.status(500).json({ error: "Failed to fetch saved jobs" });
    
    const localizedJobs = jobs.map(job => ({
      ...job,
      skills_required: job.skills_required ? job.skills_required.split(',') : []
    }));

    res.json(localizedJobs);
  });
};

/**
 * GET RECRUITER'S OWN JOBS
 */
export const getMyJobs = (req, res) => {
  const userId = req.user.id;

  const query = `
    SELECT 
      j.*,
      COUNT(a.id) as applicant_count
    FROM jobs j
    LEFT JOIN applications a ON j.id = a.job_id
    WHERE j.posted_by = ?
    GROUP BY j.id
    ORDER BY j.created_at DESC
  `;

  db.query(query, [userId], (err, jobs) => {
    if (err) {
      return res.status(500).json({
        error: "Failed to fetch your jobs",
        message: err.message,
      });
    }
    res.json(jobs);
  });
};

/**
 * UPDATE JOB (Edit/Close)
 */
export const updateJob = (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const {
    title,
    description,
    job_type,
    budget,
    duration,
    location,
    experience_level,
    status,
    skills
  } = req.body;

  // 1. Verify ownership (unless admin)
  db.query("SELECT posted_by FROM jobs WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (results.length === 0) return res.status(404).json({ error: "Job not found" });

    if (results[0].posted_by !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: "Unauthorized to update this job" });
    }

    // 2. Build dynamic update
    let updateQuery = "UPDATE jobs SET ";
    const fields = [];
    const values = [];

    if (title) { fields.push("title = ?"); values.push(title); }
    if (description) { fields.push("description = ?"); values.push(description); }
    if (job_type) { fields.push("job_type = ?"); values.push(job_type); }
    if (budget) { fields.push("budget = ?"); values.push(budget); }
    if (duration) { fields.push("duration = ?"); values.push(duration); }
    if (location) { fields.push("location = ?"); values.push(location); }
    if (experience_level) { fields.push("experience_level = ?"); values.push(experience_level); }
    if (status) { fields.push("status = ?"); values.push(status); }

    if (fields.length === 0) return res.status(400).json({ error: "No fields to update" });

    updateQuery += fields.join(", ") + " WHERE id = ?";
    values.push(id);

    db.query(updateQuery, values, (updateErr) => {
      if (updateErr) return res.status(500).json({ error: "Update failed", message: updateErr.message });
      
      if (skills && Array.isArray(skills)) {
        db.query("DELETE FROM job_skills WHERE job_id = ?", [id], (delErr) => {
          if (delErr) {
            console.error("Failed to clear old skills for update", delErr);
            return res.json({ success: true, message: "Job updated, but skills failed" });
          }
          if (skills.length > 0) {
            const skillValues = skills.map(skillId => [id, skillId]);
            db.query("INSERT INTO job_skills (job_id, skill_id) VALUES ?", [skillValues], (insErr) => {
              if (insErr) console.error("Failed to insert new skills", insErr);
              return res.json({ success: true, message: "Job and skills updated successfully" });
            });
          } else {
             return res.json({ success: true, message: "Job updated successfully (skills cleared)" });
          }
        });
      } else {
        res.json({ success: true, message: "Job updated successfully" });
      }
    });
  });
};

export const getJobDetails = (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT 
      j.*, 
      j.budget AS salary_range,
      u.name AS recruiter_name, 
      u.email AS recruiter_email,
      COALESCE(u.company_name, u.name) AS company,
      u.company_bio AS company_bio
    FROM jobs j
    JOIN users u ON j.posted_by = u.id
    WHERE j.id = ?
  `;

  db.query(query, [id], (err, jobResult) => {
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
        SELECT s.id, s.name 
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
          skills_required: skills.map((s) => s.name),
          skills_required_ids: skills.map((s) => s.id),
        });
      }
    );
  });
};

/**
 * DELETE JOB
 * Admin or Job Owner (Recruiter)
 */
export const deleteJob = (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const userRole = req.user.role;

  let query = "DELETE FROM jobs WHERE id = ?";
  let params = [id];

  if (userRole !== 'admin') {
    query += " AND posted_by = ?";
    params.push(userId);
  }

  db.query(query, params, (err, result) => {
    if (err) {
      return res.status(500).json({
        error: "Failed to delete job",
        message: err.message,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Job not found or you don't have permission to delete it" });
    }

    res.json({ message: "Job deleted successfully" });
  });
};

/**
 * GET RECRUITER DASHBOARD STATS
 */
export const getRecruiterDashboardStats = async (req, res) => {
  const recruiterId = req.user.id;
  try {
    const promiseQuery = db.promise().query.bind(db.promise());
    
    // 1. Core Stats
    const [[stats]] = await promiseQuery(`
      SELECT 
        COUNT(DISTINCT j.id) as active_jobs,
        COUNT(a.id) as total_applicants,
        SUM(CASE WHEN a.status = 'pending' THEN 1 ELSE 0 END) as pending_reviews,
        SUM(CASE WHEN a.status IN ('accepted', 'hired') THEN 1 ELSE 0 END) as shortlisted,
        AVG(CASE WHEN a.ai_match_score IS NOT NULL THEN a.ai_match_score ELSE 0 END) as avg_match_score
      FROM jobs j
      LEFT JOIN applications a ON j.id = a.job_id
      WHERE j.posted_by = ? AND j.status = 'open'
    `, [recruiterId]);

    // 2. Recent Jobs
    const [recentJobs] = await promiseQuery(`
      SELECT 
        j.id, j.title, j.status,
        j.created_at as posted,
        COUNT(a.id) as applicants
      FROM jobs j
      LEFT JOIN applications a ON j.id = a.job_id
      WHERE j.posted_by = ?
      GROUP BY j.id, j.title, j.status, j.created_at
      ORDER BY j.created_at DESC
      LIMIT 4
    `, [recruiterId]);

    // 3. Recent Applications
    const [recentApplications] = await promiseQuery(`
      SELECT 
        a.id as application_id,
        u.name as candidate_name,
        j.id as job_id,
        j.title as job_title,
        a.ai_match_score as match_score,
        a.created_at as applied_at,
        a.status
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      JOIN users u ON a.student_id = u.id
      WHERE j.posted_by = ?
      ORDER BY a.created_at DESC
      LIMIT 10
    `, [recruiterId]);

    res.json({
      stats: {
        activeJobs: stats.active_jobs || 0,
        totalApplicants: stats.total_applicants || 0,
        pendingReviews: stats.pending_reviews || 0,
        shortlisted: stats.shortlisted || 0,
        avgMatchScore: Math.round(stats.avg_match_score || 0)
      },
      recentJobs: recentJobs.map(j => ({
        id: j.id,
        title: j.title,
        status: j.status,
        posted: j.posted,
        applicants: j.applicants
      })),
      recentApplications: recentApplications.map(app => ({
        id: app.application_id,
        candidateName: app.candidate_name,
        jobId: app.job_id,
        jobTitle: app.job_title,
        matchScore: app.match_score || 0,
        appliedAt: app.applied_at,
        status: app.status
      }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch dashboard stats", message: error.message });
  }
};

