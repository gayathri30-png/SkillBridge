import db from "./config/db.js";

console.log("🔍 Checking database...");

db.query("DESCRIBE interviews", (err, fields) => {
    if (err) {
        console.error("❌ Table 'interviews' does NOT exist or error:", err.message);
        process.exit(1);
    }
    console.log("✅ Table 'interviews' exists with columns:");
    fields.forEach(f => console.log(` - ${f.Field} (${f.Type})`));

    db.query("SELECT COUNT(*) AS count FROM interviews", (err, result) => {
        if (err) {
            console.error("❌ Failed to query interview count:", err.message);
        } else {
            console.log(`📊 Current interview count: ${result[0].count}`);
        }
        process.exit(0);
    });
});
