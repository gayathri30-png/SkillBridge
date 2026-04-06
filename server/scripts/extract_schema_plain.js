import mysql from 'mysql2/promise';
import fs from 'fs';

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
    let fullText = '';

    for (const table of tableList) {
      fullText += `\n--- TABLE: ${table} ---\n`;
      const [columns] = await conn.query(`DESCRIBE \`${table}\``);
      columns.forEach(col => {
        fullText += `${col.Field} | ${col.Type} | ${col.Null} | ${col.Key} | ${col.Default} | ${col.Extra}\n`;
      });
    }
    fs.writeFileSync('schema_plain.txt', fullText, 'utf8');
    console.log('Schema written to schema_plain.txt');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await conn.end();
  }
}

describeSchema();
