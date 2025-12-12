import db from "../config/db.js";

export const createJob = (req, res) => {
  const {
    title,
    description,
    job_type,
    budget,
    duration,
    location,
    experience_level,
    posted_by,
    skills,
  } = req.body;

  if (
    !title ||
    !description ||
    !job_type ||
    !budget ||
    !experience_level ||
    !posted_by
  )
    return res.status(400).json({ error: "Missing required fields" });

  db.query(
    `INSERT INTO jobs (title, description, job_type, budget, duration, location, experience_level, posted_by)
     VALUES (?,?,?,?,?,?,?,?)`,
    [
      title,
      description,
      job_type,
      budget,
      duration,
      location,
      experience_level,
      posted_by,
    ],
    (err, result) => {
      if (err) return res.status(500).json(err);

      const jobId = result.insertId;

      // insert job skills
      if (skills && skills.length > 0) {
        const values = skills.map((skillId) => [jobId, skillId]);
        db.query(`INSERT INTO job_skills (job_id, skill_id) VALUES ?`, [
          values,
        ]);
      }

      res.json({ message: "Job posted", job_id: jobId });
    }
  );
};

export const getAllJobs = (_, res) => {
  db.query(
    `SELECT j.*, u.name AS recruiter_name 
     FROM jobs j 
     JOIN users u ON j.posted_by = u.id 
     ORDER BY j.created_at DESC`,
    (err, data) => {
      if (err) return res.status(500).json(err);
      res.json(data);
    }
  );
};

export const getJobDetails = (req, res) => {
  const { id } = req.params;

  db.query("SELECT * FROM jobs WHERE id = ?", [id], (err, job) => {
    if (err) return res.status(500).json(err);
    if (job.length === 0)
      return res.status(404).json({ error: "Job not found" });

    db.query(
      `SELECT s.name FROM job_skills js
       JOIN skills s ON js.skill_id = s.id
       WHERE js.job_id = ?`,
      [id],
      (err, skills) => {
        if (err) return res.status(500).json(err);

        res.json({
          ...job[0],
          skills: skills.map((s) => s.name),
        });
      }
    );
  });
};
