import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import axios from 'axios';
import mysql from 'mysql2/promise';

dotenv.config();

async function testAll() {
  try {
    const token = jwt.sign({ id: 1, role: 'admin' }, process.env.JWT_SECRET || 'fallbacksecret', { expiresIn: '1h' });
    
    const db = await mysql.createConnection({host:'localhost',user:'root',password:'gayathri',database:'skillbridge'});
    const [apps] = await db.query('SELECT id FROM applications');
    await db.end();

    console.log(`Found ${apps.length} applications. Testing endpoint for each...`);
    
    for (const app of apps) {
      try {
        const response = await axios.get(`http://localhost:5001/api/ai/evaluate/${app.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log(`[OK] ID: ${app.id}`);
      } catch (error) {
        if (error.response) {
            console.error(`[ERROR 500] ID: ${app.id} - ${JSON.stringify(error.response.data)}`);
        } else {
            console.error(`[ERROR] ID: ${app.id} - ${error.message}`);
        }
      }
    }
  } catch (err) {
    console.error("Setup error:", err);
  }
}

testAll();
