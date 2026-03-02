import db from "../config/db.js";

// 1. GET ALL REPORTS (Aggregated Data)
export const getSystemReports = (req, res) => {
    const queries = {
        userGrowth: "SELECT DATE(created_at) as date, COUNT(*) as count FROM users GROUP BY DATE(created_at) ORDER BY date DESC LIMIT 30",
        roleDistribution: "SELECT role, COUNT(*) as count FROM users GROUP BY role",
        jobStats: "SELECT status, COUNT(*) as count FROM jobs GROUP BY status",
        applicationStats: "SELECT status, COUNT(*) as count FROM applications GROUP BY status",
        skillsCount: "SELECT COUNT(*) as count FROM skills",
        totalUsers: "SELECT COUNT(*) as count FROM users",
        studentCount: "SELECT COUNT(*) as count FROM users WHERE role = 'student'",
        recruiterCount: "SELECT COUNT(*) as count FROM users WHERE role = 'recruiter'",
        totalJobs: "SELECT COUNT(*) as count FROM jobs",
        totalApps: "SELECT COUNT(*) as count FROM applications",
        hiredCount: "SELECT COUNT(*) as count FROM applications WHERE status = 'accepted'",
        pendingVerifications: "SELECT id, name, email, created_at FROM users WHERE role = 'recruiter' AND is_verified = 0 LIMIT 10",
        recentActivity: `
            (SELECT 'user' as type, name as detail, created_at FROM users)
            UNION
            (SELECT 'job' as type, title as detail, created_at FROM jobs)
            UNION
            (SELECT 'application' as type, status as detail, created_at FROM applications)
            ORDER BY created_at DESC LIMIT 10
        `
    };

    const results = {};
    let completed = 0;
    const keys = Object.keys(queries);

    keys.forEach(key => {
        db.query(queries[key], (err, data) => {
            if (err) return res.status(500).json({ error: err.message });
            results[key] = data;
            completed++;
            if (completed === keys.length) {
                res.json(results);
            }
        });
    });
};
