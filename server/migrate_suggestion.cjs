const mysql = require('mysql2');
const connection = mysql.createConnection({host:'localhost',user:'root',password:'gayathri',database:'skillbridge'});

connection.query(`ALTER TABLE applications ADD COLUMN suggestion_sent BOOLEAN DEFAULT FALSE;`, (err) => {
  if (err && err.code !== 'ER_DUP_FIELDNAME') {
    console.error("Migration failed:", err);
  } else {
    console.log("Migration successful or column already exists.");
  }
  connection.end();
});
