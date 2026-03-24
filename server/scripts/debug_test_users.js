import mysql from 'mysql2/promise';

const conn = await mysql.createConnection({
  host: 'localhost', user: 'root', password: 'gayathri', database: 'skillbridge',
});
try {
  const [users] = await conn.query("SELECT id, name, email, role FROM users WHERE email LIKE '%test_%@example.com' OR email LIKE '%student%' OR email LIKE '%recruiter%' ORDER BY id DESC LIMIT 20");
  console.log("USERS:", JSON.stringify(users, null, 2));

  if (users.length > 0) {
    const ids = users.map(u => u.id);
    const [apps] = await conn.query("SELECT * FROM applications WHERE student_id IN (?)", [ids]);
    console.log("APPS FOR THESE USERS:", JSON.stringify(apps, null, 2));
    
    const [notifs] = await conn.query("SELECT * FROM notifications WHERE user_id IN (?)", [ids]);
    console.log("NOTIFS FOR THESE USERS:", JSON.stringify(notifs, null, 2));
  }
} catch(e) { console.error(e.message); }
finally { await conn.end(); }
