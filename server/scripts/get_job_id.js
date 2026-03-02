import db from '../config/db.js';

const query = process.argv[2] || 'SELECT id, title FROM jobs LIMIT 1';

db.query(query, (err, rows) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(JSON.stringify(rows));
    process.exit(0);
});
