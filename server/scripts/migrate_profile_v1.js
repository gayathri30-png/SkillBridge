import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function migrate() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'gayathri',
    database: process.env.DB_NAME || 'skillbridge'
  });

  console.log('Migrating users table...');

  const columnsToAdd = [
    { name: 'bio', type: 'TEXT' },
    { name: 'phone', type: 'VARCHAR(20)' },
    { name: 'location', type: 'VARCHAR(255)' },
    { name: 'avatar', type: 'VARCHAR(255)' },
    { name: 'github_url', type: 'VARCHAR(255)' },
    { name: 'linkedin_url', type: 'VARCHAR(255)' }
  ];

  const [existingCols] = await connection.execute('DESCRIBE users');
  const existingColNames = existingCols.map(col => col.Field);

  for (const col of columnsToAdd) {
    if (!existingColNames.includes(col.name)) {
      console.log(`Adding column: ${col.name}`);
      await connection.execute(`ALTER TABLE users ADD COLUMN ${col.name} ${col.type}`);
    } else {
      console.log(`Column ${col.name} already exists.`);
    }
  }

  console.log('Migration complete.');
  await connection.end();
}

migrate().catch(console.error);
