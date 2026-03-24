import { evaluateApplication } from './controllers/aiController.js';
import mysql from 'mysql2/promise';

async function simulate() {
  const req = { params: { applicationId: 8 } };
  const res = {
    status: (code) => {
      console.log(`[RES.STATUS] ${code}`);
      return res;
    },
    json: (data) => {
      console.log(`[RES.JSON] Called. Has error? ${!!data.error}`);
      if (data.error) console.error(data);
    }
  };

  try {
    console.log("Starting evaluation...");
    await evaluateApplication(req, res);
    console.log("Evaluation finished without thrown error.");
  } catch (err) {
    console.error("FATAL UNCAUGHT ERROR:");
    console.error(err.stack);
  }
}

simulate().then(() => {
  setTimeout(() => process.exit(0), 1000);
}).catch(console.error);
