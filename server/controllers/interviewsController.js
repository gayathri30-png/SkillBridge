import db from "../config/db.js";

// CREATE INTERVIEW INVITATION
export const createInterview = (req, res) => {
    const { application_id, recruiter_id, student_id, scheduled_at, meeting_link, instructions } = req.body;

    if (!application_id || !recruiter_id || !student_id || !scheduled_at) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const query = `
        INSERT INTO interviews (application_id, recruiter_id, student_id, scheduled_at, meeting_link, instructions)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [application_id, recruiter_id, student_id, scheduled_at, meeting_link, instructions], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        
        const interviewId = result.insertId;

        // Fetch job title for notification
        db.query("SELECT title FROM jobs JOIN applications ON jobs.id = applications.job_id WHERE applications.id = ?", [application_id], (err, jobResult) => {
            const jobTitle = jobResult && jobResult[0] ? jobResult[0].title : "a job";
            
            // Create in-app notification for student
            const notificationQuery = `
                INSERT INTO notifications (user_id, title, message, type)
                VALUES (?, ?, ?, ?)
            `;
            const content = `You have been invited for an interview for ${jobTitle} on ${new Date(scheduled_at).toLocaleString()}. Click to respond.`;
            
            db.query(notificationQuery, [student_id, "Interview Invitation", content, "interview_invitation"], (err) => {
                if (err) console.error("Failed to create notification:", err);
                
                res.status(201).json({ 
                    success: true, 
                    message: "Interview invitation sent successfully",
                    interview_id: interviewId
                });
            });
        });
    });
};

// GET INTERVIEW BY ID
export const getInterviewById = (req, res) => {
    const { id } = req.params;

    const query = `
        SELECT i.*, j.title as job_title, u.company_name, u.name as recruiter_name
        FROM interviews i
        JOIN applications a ON i.application_id = a.id
        JOIN jobs j ON a.job_id = j.id
        JOIN users u ON i.recruiter_id = u.id
        WHERE i.id = ?
    `;

    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length === 0) return res.status(404).json({ error: "Interview not found" });
        res.json(result[0]);
    });
};

// RESPOND TO INTERVIEW
export const respondToInterview = (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // 'accepted' or 'declined'

    if (!['accepted', 'declined'].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
    }

    db.query("UPDATE interviews SET status = ? WHERE id = ?", [status, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        if (status === 'accepted') {
            // Update application status
            db.query("UPDATE applications SET status = 'interview_scheduled' WHERE id = (SELECT application_id FROM interviews WHERE id = ?)", [id], (err) => {
                if (err) console.error("Failed to update application status:", err);
            });
        }

        // Notify recruiter
        db.query("SELECT recruiter_id, student_id, (SELECT name FROM users WHERE id = student_id) as student_name FROM interviews WHERE id = ?", [id], (err, iResult) => {
            if (iResult && iResult[0]) {
                const { recruiter_id, student_name } = iResult[0];
                const content = `Student ${student_name} has ${status} your interview invitation.`;
                db.query("INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)", [recruiter_id, "Interview Response", content, "info"], (err) => {
                    if (err) console.error("Failed to notify recruiter:", err);
                });
            }
        });

        res.json({ success: true, message: `Interview ${status}` });
    });
};

// AUTO-INVITE TOP APPLICANTS
export const autoInviteTopApplicants = (req, res) => {
    const { jobId } = req.params;
    const { count = 3, scheduled_at, meeting_link, instructions } = req.body;
    const recruiter_id = req.user.id;

    if (!scheduled_at) return res.status(400).json({ error: "Default scheduled_at is required" });

    // Find top N applicants who are not invited yet and not rejected
    const selectQuery = `
        SELECT a.id as application_id, a.student_id, a.ai_match_score 
        FROM applications a
        LEFT JOIN interviews i ON a.id = i.application_id
        WHERE a.job_id = ? AND a.status != 'rejected' AND i.id IS NULL
        ORDER BY a.ai_match_score DESC
        LIMIT ?
    `;

    db.query(selectQuery, [jobId, parseInt(count)], (err, applicants) => {
        if (err) return res.status(500).json({ error: err.message });

        if (applicants.length === 0) {
            return res.json({ success: true, message: "No eligible applicants found for auto-invite" });
        }

        let completed = 0;
        const results = [];

        applicants.forEach(app => {
            const insertQuery = `
                INSERT INTO interviews (application_id, recruiter_id, student_id, scheduled_at, meeting_link, instructions)
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            db.query(insertQuery, [app.application_id, recruiter_id, app.student_id, scheduled_at, meeting_link, instructions], (err, result) => {
                completed++;
                if (!err) {
                    results.push(app.application_id);
                    // Notify student (simplified notify logic for loop)
                    db.query("INSERT INTO notifications (user_id, title, message, type) VALUES (?, 'Interview Invitation', 'You have been automatically shortlisted and invited for an interview. Click to respond.', 'interview_invitation')", [app.student_id]);
                }

                if (completed === applicants.length) {
                    res.json({ 
                        success: true, 
                        message: `Successfully invited ${results.length} top applicants`,
                        invited_applications: results
                    });
                }
            });
        });
    });
};

// GET USER INTERVIEWS (STUDENT OR RECRUITER)
export const getUserInterviews = (req, res) => {
    const user_id = req.user.id;
    const role = req.user.role;

    let query = `
        SELECT i.*, j.title as job_title, u1.company_name, 
               u1.name as recruiter_name, u2.name as student_name
        FROM interviews i
        JOIN applications a ON i.application_id = a.id
        JOIN jobs j ON a.job_id = j.id
        JOIN users u1 ON i.recruiter_id = u1.id
        JOIN users u2 ON i.student_id = u2.id
        WHERE (${role === 'student' ? 'i.student_id = ?' : 'i.recruiter_id = ?'})
          AND i.status != 'declined'
          AND i.scheduled_at >= NOW()
        ORDER BY i.scheduled_at ASC
    `;

    db.query(query, [user_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};
