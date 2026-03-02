import { getSkillGapPathways } from './controllers/aiController.js';
import db from './config/db.js';

async function test() {
  try {
    await db.promise().query("INSERT IGNORE INTO users (id, name, email, password, role) VALUES (999, 'TestUser', 'test@test.com', 'pass', 'student')");
    const req = { user: { id: 999 }, query: { jobTitle: 'Frontend Developer' } };
    const res = { 
      json: (data) => console.log('SUCCESS:', data), 
      status: (code) => ({ json: (err) => console.error('ERROR (', code, '):', err) }) 
    };
    await getSkillGapPathways(req, res);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}
test();
