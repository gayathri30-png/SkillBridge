import db from "../config/db.js";

// ----------------------
// 1. APPLY TO JOB
// ----------------------
export const applyToJob = (req, res) => {
  const { job_id, student_id, proposal } = req.body;

  if (!job_id || !student_id || !proposal)
    return res.status(400).json({ error: "Missing required fields" });

  // Check if already applied
  db.query(
    "SELECT * FROM applications WHERE job_id = ? AND student_id = ?",
    [job_id, student_id],
    (err, result) => {
      if (err) return res.status(500).json(err);

      if (result.length > 0)
        return res.status(400).json({ error: "Already applied" });

      // Insert new application
      db.query(
        `INSERT INTO applications (job_id, student_id, proposal)
         VALUES (?, ?, ?)`,
        [job_id, student_id, proposal],
        (err) => {
          if (err) return res.status(500).json(err);

          res.json({ message: "Application submitted successfully" });
        }
      );
    }
  );
};

// ----------------------
// 2. GET APPLICATIONS FOR A JOB (Recruiter view)
// ----------------------
export const getJobApplications = (req, res) => {
  const { job_id } = req.params;

  db.query(
    `SELECT a.*, u.name AS student_name, u.email AS student_email
     FROM applications a
     JOIN users u ON a.student_id = u.id
     WHERE a.job_id = ?
     ORDER BY a.created_at DESC`,
    [job_id],
    (err, data) => {
      if (err) return res.status(500).json(err);
      res.json(data);
    }
  );
};

// ----------------------
// 3. GET APPLICATIONS BY STUDENT
// ----------------------
export const getStudentApplications = (req, res) => {
  const { student_id } = req.params;

  db.query(
    `SELECT a.*, j.title, j.job_type, j.budget, j.experience_level
     FROM applications a
     JOIN jobs j ON a.job_id = j.id
     WHERE a.student_id = ?
     ORDER BY a.created_at DESC`,
    [student_id],
    (err, data) => {
      if (err) return res.status(500).json(err);
      res.json(data);
    }
  );
};

// ----------------------
// 4. UPDATE APPLICATION STATUS (Recruiter)
// ----------------------
export const updateStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) return res.status(400).json({ error: "Status required" });

  db.query(
    "UPDATE applications SET status = ? WHERE id = ?",
    [status, id],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({ message: "Status updated" });
    }
  );
};
