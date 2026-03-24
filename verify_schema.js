import db from './server/config/db.js';

async function check() {
  try {
    const [apps] = await db.promise().query('DESCRIBE applications');
    console.log('--- APPLICATIONS TABLE ---');
    console.table(apps);

    const [jobs] = await db.promise().query('DESCRIBE jobs');
    console.log('--- JOBS TABLE ---');
    console.table(jobs);

    const [users] = await db.promise().query('DESCRIBE users');
    console.log('--- USERS TABLE ---');
    console.table(users);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
