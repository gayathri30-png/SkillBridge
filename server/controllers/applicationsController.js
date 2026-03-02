import db from "../config/db.js";
import { createNotification } from "./notificationController.js";

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
    "SELECT id, status, posted_by, title FROM jobs WHERE id = ?",
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

                  // NOTIFY RECRUITER
                  const recruiterId = jobs[0].posted_by;
                  const jobTitle = jobs[0].title;
                  createNotification(
                      recruiterId, 
                      'application', 
                      `New application for ${jobTitle}`,
                      job_id
                  ).catch(console.error);


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
      u.email AS student_email,
      (SELECT GROUP_CONCAT(s.name) 
       FROM user_skills us 
       JOIN skills s ON us.skill_id = s.id 
       WHERE us.user_id = u.id) as student_skills
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
      j.id AS job_id,
      j.title AS job_title,
      j.job_type,
      j.budget,
      j.experience_level,
      j.location,
      j.description AS job_description,
      u.name AS company_name
    FROM applications a
    JOIN jobs j ON a.job_id = j.id
    JOIN users u ON j.posted_by = u.id
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
  const { status, hiringDetails } = req.body;
  const recruiter_id = req.user.id;

  const allowedStatus = ["pending", "accepted", "rejected", "hired"];
  if (!allowedStatus.includes(status)) {
    return res.status(400).json({ error: "Invalid status value" });
  }

  // SECURITY: recruiter can update ONLY their job’s applications
  let query = `
    UPDATE applications a
    JOIN jobs j ON a.job_id = j.id
    SET a.status = ?
  `;
  let params = [status];

  if (status === 'hired' && hiringDetails) {
    query += `, a.start_date = ?, a.salary = ?, a.contract_type = ?, a.offer_letter = ?, a.additional_notes = ?, a.hired_at = NOW()`;
    params.push(
      hiringDetails.start_date,
      hiringDetails.salary,
      hiringDetails.contract_type,
      hiringDetails.offer_letter,
      hiringDetails.additional_notes
    );
  }

  query += ` WHERE a.id = ? AND j.posted_by = ?`;
  params.push(id, recruiter_id);

  db.query(query, params, (err, result) => {
      if (err) return res.status(500).json({ error: "Database error" });

      if (result.affectedRows === 0) {
        return res.status(404).json({
          error: "Application not found or not authorized",
        });
      }

      // NOTIFY STUDENT
      // We need to fetch student_id first to notify them. 
      // The update query doesn't return the record.
      // Optimization: We can do this async or fetch before update.
      // Let's just fetch student_id from application first or use a subquery if we were using raw SQL for insert.
      // Since we already did the update, let's fetch the application details to notify.
      db.query("SELECT student_id, job_id FROM applications WHERE id = ?", [id], (err, appRows) => {
          if(!err && appRows.length > 0) {
              const studentId = appRows[0].student_id;
              const jobId = appRows[0].job_id;
              
              db.query("SELECT title FROM jobs WHERE id = ?", [jobId], (err, jobRows) => {
                  const jobTitle = jobRows[0]?.title || "Job";
                  createNotification(
                      studentId,
                      'status_update',
                      `Your application for ${jobTitle} was ${status}`,
                      jobId
                  ).catch(console.error);
              });
          }
      });

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
      u.email AS student_email,
      (SELECT GROUP_CONCAT(s.name) 
       FROM user_skills us 
       JOIN skills s ON us.skill_id = s.id 
       WHERE us.user_id = u.id) as student_skills

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

// --------------------------------
// 7. ADMIN: GET ALL APPLICATIONS (FOR DASHBOARD / STATS)
// --------------------------------
export const getAllApplications = (req, res) => {
  const query = `
    SELECT 
      a.id,
      a.status,
      a.ai_match_score,
      a.created_at,
      j.title AS job_title,
      u.name AS student_name,
      r.name AS recruiter_name
    FROM applications a
    JOIN jobs j ON a.job_id = j.id
    JOIN users u ON a.student_id = u.id
    JOIN users r ON j.posted_by = r.id
    ORDER BY a.created_at DESC
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(results);
  });
};

// --------------------------------
// 8. STUDENT: WITHDRAW APPLICATION
// --------------------------------
export const withdrawApplication = (req, res) => {
  const { id } = req.params;
  const student_id = req.user.id;

  // Security: Students can only delete their own PENDING applications
  db.query(
    "DELETE FROM applications WHERE id = ? AND student_id = ? AND status = 'pending'",
    [id, student_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Database error" });

      if (result.affectedRows === 0) {
        return res.status(404).json({
          error: "Application not found, not authorized, or already processed by recruiter",
        });
      }

      res.json({
        success: true,
        message: "Application withdrawn successfully",
      });
    }
  );
};

// --------------------------------
// 9. STUDENT: ACCEPT OFFER
// --------------------------------
export const acceptOffer = (req, res) => {
  const { id } = req.params;
  const student_id = req.user.id;

  db.query(
    `UPDATE applications SET is_offer_accepted = TRUE, offer_accepted_at = NOW() WHERE id = ? AND student_id = ? AND status = 'hired'`,
    [id, student_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Database error" });
      if (result.affectedRows === 0)
        return res
          .status(404)
          .json({ error: "Offer not found or already processed" });

      // Notify Recruiter
      db.query(
        "SELECT job_id FROM applications WHERE id = ?",
        [id],
        (err, rows) => {
          if (!err && rows.length > 0) {
            const jobId = rows[0].job_id;
            db.query(
              "SELECT posted_by, title FROM jobs WHERE id = ?",
              [jobId],
              (err, job) => {
                if (!err && job.length > 0) {
                  createNotification(
                    job[0].posted_by,
                    "offer_accepted",
                    `Offer for ${job[0].title} was accepted!`,
                    jobId
                  ).catch(console.error);
                }
              },
            );
          }
        },
      );

      res.json({ success: true, message: "Offer accepted successfully" });
    },
  );
};

// --------------------------------
// 10. GET OFFER DETAILS (FOR STUDENT OR RECRUITER)
// --------------------------------
export const getOfferDetails = (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;

  db.query(
    `
        SELECT 
            a.*, 
            j.title as job_title, 
            j.budget as job_budget,
            j.job_type as job_type,
            u.name as recruiter_name,
            u.email as recruiter_email,
            s.name as student_name
        FROM applications a
        JOIN jobs j ON a.job_id = j.id
        JOIN users u ON j.posted_by = u.id
        JOIN users s ON a.student_id = s.id
        WHERE a.id = ? AND (a.student_id = ? OR j.posted_by = ?)
        `,
    [id, user_id, user_id],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });
      if (results.length === 0)
        return res.status(404).json({ error: "Offer details not found" });
      res.json(results[0]);
    },
  );
};
