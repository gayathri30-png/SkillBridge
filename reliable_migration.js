import db from './server/config/db.js';

async function migrate() {
  try {
    const [columns] = await db.promise().query('SHOW COLUMNS FROM applications');
    const existingColumns = columns.map(c => c.Field);

    const newColumns = [
      { name: 'is_offer_accepted', type: 'BOOLEAN DEFAULT FALSE' },
      { name: 'offer_accepted_at', type: 'DATETIME' },
      { name: 'start_date', type: 'DATE' },
      { name: 'salary', type: 'VARCHAR(255)' },
      { name: 'contract_type', type: 'VARCHAR(255)' },
      { name: 'offer_letter', type: 'TEXT' },
      { name: 'additional_notes', type: 'TEXT' },
      { name: 'hired_at', type: 'DATETIME' },
      { name: 'suggestion_sent', type: 'BOOLEAN DEFAULT FALSE' }
    ];

    for (const col of newColumns) {
      if (!existingColumns.includes(col.name)) {
        await db.promise().query(`ALTER TABLE applications ADD COLUMN ${col.name} ${col.type}`);
        console.log(`✅ Added: ${col.name}`);
      } else {
        console.log(`⏩ Already exists: ${col.name}`);
      }
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

migrate();
