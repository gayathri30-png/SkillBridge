import db from './server/config/db.js';

async function migrate() {
  try {
    console.log('--- MIGRATING APPLICATIONS TABLE ---');
    
    const queries = [
      "ALTER TABLE applications ADD COLUMN IF NOT EXISTS is_offer_accepted BOOLEAN DEFAULT FALSE",
      "ALTER TABLE applications ADD COLUMN IF NOT EXISTS offer_accepted_at DATETIME",
      "ALTER TABLE applications ADD COLUMN IF NOT EXISTS start_date DATE",
      "ALTER TABLE applications ADD COLUMN IF NOT EXISTS salary VARCHAR(255)",
      "ALTER TABLE applications ADD COLUMN IF NOT EXISTS contract_type VARCHAR(255)",
      "ALTER TABLE applications ADD COLUMN IF NOT EXISTS offer_letter TEXT",
      "ALTER TABLE applications ADD COLUMN IF NOT EXISTS additional_notes TEXT",
      "ALTER TABLE applications ADD COLUMN IF NOT EXISTS hired_at DATETIME",
      "ALTER TABLE applications ADD COLUMN IF NOT EXISTS suggestion_sent BOOLEAN DEFAULT FALSE"
    ];

    for (const q of queries) {
      try {
        await db.promise().query(q);
        console.log(`✅ Executed: ${q}`);
      } catch (e) {
        if (e.code === 'ER_DUP_COLUMN_NAME') {
          console.log(`⏩ Skipping (already exists): ${q}`);
        } else {
          console.error(`❌ Error executing: ${q}`, e.message);
        }
      }
    }

    console.log('--- SUCCESS ---');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

migrate();
