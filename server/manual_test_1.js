import axios from "axios";

async function manualTest() {
  try {
    console.log("Logging in as Gayathri...");
    const loginRes = await axios.post("http://localhost:5001/api/auth/login", {
        email: "student@gmail.com",
        password: "password123"
    });
    
    const token = loginRes.data.token;
    console.log("✅ Logged in! Testing interview-prep for ID 1...");
    
    const prepRes = await axios.get("http://localhost:5001/api/ai/interview-prep/1", {
        headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log("✅ SUCCESS!");
    console.log(JSON.stringify(prepRes.data, null, 2));

  } catch (err) {
    console.error("❌ FAILED:", err.response ? err.response.status : err.message);
    if (err.response) console.error("Error Data:", err.response.data);
  } finally {
    process.exit();
  }
}
manualTest();
