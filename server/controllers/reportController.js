import db from "../config/db.js";

export const getSystemStats = async (req, res) => {
  try {
    const stats = {};

    // 1. User Stats
    const [userRows] = await db.promise().query(`
      SELECT role, COUNT(*) as count FROM users GROUP BY role
    `);
    stats.users = userRows.reduce((acc, row) => {
      acc[row.role] = row.count;
      return acc;
    }, {});
    stats.totalUsers = userRows.reduce((sum, row) => sum + row.count, 0);

    // 2. Job Stats
    const [jobRows] = await db.promise().query(`
      SELECT status, COUNT(*) as count FROM jobs GROUP BY status
    `);
    stats.jobs = jobRows.reduce((acc, row) => {
      acc[row.status] = row.count;
      return acc;
    }, {});
    stats.totalJobs = jobRows.reduce((sum, row) => sum + row.count, 0);

    // 3. Application Stats
    const [appRows] = await db.promise().query(`
      SELECT status, COUNT(*) as count FROM applications GROUP BY status
    `);
    stats.applications = appRows.reduce((acc, row) => {
      acc[row.status] = row.count;
      return acc;
    }, {});
    stats.totalApplications = appRows.reduce((sum, row) => sum + row.count, 0);

    // 4. Hired Stats (Accepted Applications)
    const [hiredRows] = await db.promise().query(`
      SELECT COUNT(*) as count FROM applications WHERE status = 'accepted'
    `);
    stats.totalHired = hiredRows[0].count;

    // 5. Recent Activity Mixed (Merged in JS to avoid SQL collation issues)
    const [userActivity] = await db.promise().query("SELECT 'signup' as type, name as detail, created_at FROM users ORDER BY created_at DESC LIMIT 10");
    const [jobActivity] = await db.promise().query("SELECT 'job' as type, title as detail, created_at FROM jobs ORDER BY created_at DESC LIMIT 10");
    const [appActivity] = await db.promise().query(`
      SELECT 'application' as type, j.title as detail, a.created_at 
      FROM applications a 
      JOIN jobs j ON a.job_id = j.id
      ORDER BY a.created_at DESC LIMIT 15
    `);

    const mixedActivity = [...userActivity, ...jobActivity, ...appActivity]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 10);

    stats.recentActivity = mixedActivity;

    // 6. Recruiter Verification Queue (Pending recruiters)
    const [queueRows] = await db.promise().query(`
      SELECT id, name, email, created_at FROM users WHERE role = 'recruiter' AND is_verified = FALSE ORDER BY created_at ASC
    `);
    stats.verificationQueue = queueRows;

    res.json(stats);
  } catch (error) {
    console.error("Report Error:", error);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
};
