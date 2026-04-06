import mysql from 'mysql2/promise';

async function describeSchema() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'gayathri',
    database: 'skillbridge',
  });

  try {
    const [tables] = await conn.query('SHOW TABLES');
    const tableList = tables.map(row => Object.values(row)[0]);

    for (const table of tableList) {
      console.log(`\n--- TABLE: ${table} ---`);
      const [columns] = await conn.query(`DESCRIBE \`${table}\``);
      console.log(JSON.stringify(columns, null, 2));
    }
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await conn.end();
  }
}

describeSchema();
