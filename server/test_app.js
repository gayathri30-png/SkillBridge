import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();

async function testFrontendAppObjName() {
  try {
    const token = jwt.sign({ id: 1, role: 'admin' }, process.env.JWT_SECRET || 'fallbacksecret', { expiresIn: '1h' });
    const response = await axios.get('http://localhost:5001/api/applications/job/7/sorted', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Applicants array first item:");
    console.log(response.data.applicants[0]);
  } catch (error) {
    console.error("ERROR:");
    console.error(error.message);
  }
}

testFrontendAppObjName();
