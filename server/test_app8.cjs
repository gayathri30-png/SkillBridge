const m = require('mysql2');
const c = m.createConnection({host:'localhost',user:'root',password:'gayathri',database:'skillbridge'});

const sql = `
  SELECT 
    a.id as application_id, a.student_id, a.job_id, a.proposal, 
    a.ai_match_score, a.status, a.created_at,
    u.id as user_id, u.name as student_name, u.email as student_email,
    u.bio as student_bio, u.avatar, u.location as student_location,
    u.github_url, u.linkedin_url,
    j.title as job_title, j.description as job_desc, j.location as job_location,
    j.budget, j.job_type, j.experience_level,
    (SELECT GROUP_CONCAT(s.name) FROM user_skills us JOIN skills s ON us.skill_id = s.id WHERE us.user_id = u.id) as student_skills,
    (SELECT GROUP_CONCAT(s.name) FROM job_skills js JOIN skills s ON js.skill_id = s.id WHERE js.job_id = j.id) as job_skills
  FROM applications a
  JOIN users u ON a.student_id = u.id
  JOIN jobs j ON a.job_id = j.id
  WHERE a.id = 8
`;

c.query(sql, (e, r) => {
  if (e) console.error('QUERY ERROR:', e.message);
  else console.log('SUCCESS:', JSON.stringify(r[0], null, 2));
  c.end();
});
