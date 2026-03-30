import db from "./config/db.js";

db.query("DESCRIBE user_skills", (err, results) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(JSON.stringify(results, null, 2));
  process.exit(0);
});
