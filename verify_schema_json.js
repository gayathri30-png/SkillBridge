import db from './server/config/db.js';

async function check() {
  try {
    const [apps] = await db.promise().query('DESCRIBE applications');
    const [jobs] = await db.promise().query('DESCRIBE jobs');
    const [users] = await db.promise().query('DESCRIBE users');
    
    console.log(JSON.stringify({ 
      applications: apps.map(r => r.Field), 
      jobs: jobs.map(r => r.Field),
      users: users.map(r => r.Field)
    }, null, 2));

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
