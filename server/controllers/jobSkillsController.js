import db from "../config/db.js";

/*
  Add skill requirement to a job
  Only recruiter who owns the job should do this (we'll trust auth for now)
*/
export const addJobSkill = (req, res) => {
  const { job_id, skill_id } = req.body;

  if (!job_id || !skill_id) {
    return res.status(400).json({ error: "job_id and skill_id required" });
  }

  // 1. Check if job exists
  db.query("SELECT id FROM jobs WHERE id = ?", [job_id], (err, jobRows) => {
    if (err) return res.status(500).json(err);
    if (jobRows.length === 0)
      return res.status(404).json({ error: "Job not found" });

    // 2. Check if skill exists
    db.query(
      "SELECT id FROM skills WHERE id = ?",
      [skill_id],
      (err, skillRows) => {
        if (err) return res.status(500).json(err);
        if (skillRows.length === 0)
          return res.status(404).json({ error: "Skill not found" });

        // 3. Prevent duplicate skill requirement
        db.query(
          "SELECT id FROM job_skills WHERE job_id = ? AND skill_id = ?",
          [job_id, skill_id],
          (err, existing) => {
            if (err) return res.status(500).json(err);

            if (existing.length > 0) {
              return res
                .status(409)
                .json({ error: "Skill already added to this job" });
            }

            // 4. Insert job skill
            db.query(
              "INSERT INTO job_skills (job_id, skill_id) VALUES (?, ?)",
              [job_id, skill_id],
              (err, result) => {
                if (err) return res.status(500).json(err);

                res.status(201).json({
                  success: true,
                  message: "Skill added to job",
                  id: result.insertId,
                });
              },
            );
          },
        );
      },
    );
  });
};

/*
  Get all skills required for a job
*/
export const getJobSkills = (req, res) => {
  const jobId = req.params.jobId;

  db.query(
    `
    SELECT js.id, s.id AS skill_id, s.name
    FROM job_skills js
    JOIN skills s ON js.skill_id = s.id
    WHERE js.job_id = ?
    `,
    [jobId],
    (err, results) => {
      if (err) return res.status(500).json(err);

      res.json({
        success: true,
        count: results.length,
        skills: results,
      });
    },
  );
};

/*
  Remove a skill requirement from a job
*/
export const removeJobSkill = (req, res) => {
  const jobSkillId = req.params.id;

  db.query(
    "DELETE FROM job_skills WHERE id = ?",
    [jobSkillId],
    (err, result) => {
      if (err) return res.status(500).json(err);

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Job skill not found" });
      }

      res.json({
        success: true,
        message: "Skill removed from job",
      });
    },
  );
};
