import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function checkColumns() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'gayathri',
    database: process.env.DB_NAME || 'skillbridge'
  });

  const [rows] = await connection.execute('DESCRIBE users');
  console.log('Columns in users table:');
  rows.forEach(row => {
    console.log(`- ${row.Field} (${row.Type})`);
  });
  
  await connection.end();
}

checkColumns().catch(console.error);
