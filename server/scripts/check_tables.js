import db from '../config/db.js';

db.query("SHOW TABLES", (err, results) => {
  if (err) {
    console.error("Error listing tables:", err);
    process.exit(1);
  }
  console.log("Existing Tables:");
  results.forEach(row => {
    console.log("- ", row[Object.keys(row)[0]]);
  });
  process.exit(0);
});
