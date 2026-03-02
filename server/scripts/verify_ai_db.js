import mysql from 'mysql2/promise';

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "gayathri",
  database: "skillbridge"
};

async function verifyDb() {
  const connection = await mysql.createConnection(dbConfig);
  
  try {
    console.log("=== CHECKING AI_PROPOSALS TABLE ===");
    const [proposals] = await connection.query("SELECT * FROM ai_proposals ORDER BY created_at DESC LIMIT 5");
    console.log(`Found ${proposals.length} saved proposals in database.`);
    if (proposals.length > 0) {
        console.log("Latest Proposal Target Job:", proposals[0].job_title);
        console.log("Latest Proposal Tone:", proposals[0].tone);
        console.log("Database Save: ✅ SUCCESS");
    }

    console.log("\n=== CHECKING SKILL_GAP_ANALYSIS TABLE ===");
    const [gaps] = await connection.query("SELECT * FROM skill_gap_analysis ORDER BY created_at DESC LIMIT 5");
    console.log(`Found ${gaps.length} saved skill gap records in database.`);
    if (gaps.length > 0) {
        console.log("Latest Target Job:", gaps[0].job_title);
        console.log("Missing Skills:", gaps[0].missing_skills);
        console.log("Database Save: ✅ SUCCESS");
    }

  } catch (err) {
    console.error("Verification failed:", err.message);
  } finally {
    await connection.end();
  }
}

verifyDb();
