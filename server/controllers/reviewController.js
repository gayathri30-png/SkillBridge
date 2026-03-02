import db from "../config/db.js";

// GET REVIEWS FOR A STUDENT
export const getStudentReviews = (req, res) => {
  const { studentId } = req.params;

  const query = `
    SELECT r.*, u.name as recruiter_name, u.avatar as recruiter_avatar 
    FROM reviews r
    JOIN users u ON r.recruiter_id = u.id
    WHERE r.student_id = ?
    ORDER BY r.created_at DESC
  `;

  db.query(query, [studentId], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// SUBMIT A REVIEW (Recruiters only)
export const submitReview = (req, res) => {
  const recruiterId = req.user.id;
  const { studentId, rating, comment } = req.body;

  if (!studentId || !rating) {
    return res.status(400).json({ error: "Student ID and rating are required" });
  }

  const query = "INSERT INTO reviews (student_id, recruiter_id, rating, comment) VALUES (?, ?, ?, ?)";
  
  db.query(
    query,
    [studentId, recruiterId, rating, comment],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Review submitted successfully", id: result.insertId });
    }
  );
};
