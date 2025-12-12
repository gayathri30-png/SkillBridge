import mysql from "mysql2";

// Create connection (using callback style - compatible with your controller)
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "gayathri",
  database: "skillbridge",
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error("❌ MySQL Connection Failed!");
    console.error("❌ Error:", err.message);
    console.error("❌ Code:", err.code);
    console.error("❌ Please check:");
    console.error("   • MySQL is running");
    console.error("   • Database 'skillbridge' exists");
    console.error("   • Username/password is correct");
    console.error("   • Port 3306 is accessible");
    return;
  }

  console.log("✅ MySQL Connected Successfully!");
  console.log("✅ Database: skillbridge");
  console.log("✅ Host: localhost");
  console.log("✅ Thread ID:", db.threadId);

  // Test query to verify skills table exists
  db.query("SELECT COUNT(*) as count FROM skills", (err, results) => {
    if (err) {
      console.error("❌ Skills table check failed:", err.message);
    } else {
      console.log(`✅ Skills in database: ${results[0].count}`);
    }
  });
});

// Handle connection errors
db.on("error", (err) => {
  console.error("❌ MySQL Connection Error:", err.message);
  if (err.code === "PROTOCOL_CONNECTION_LOST") {
    console.log("⚠️ Reconnecting to MySQL...");
    // Attempt to reconnect
    setTimeout(() => {
      db.connect();
    }, 2000);
  }
});

export default db;
