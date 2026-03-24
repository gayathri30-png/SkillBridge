import axios from "axios";

async function test() {
  try {
    // 1. Login to get token
    console.log("Logging in...");
    const loginRes = await axios.post("http://localhost:5001/api/auth/login", {
        email: "student@gmail.com",
        password: "password123"
    });
    
    if (loginRes.data.success) {
        const token = loginRes.data.token;
        console.log("✅ Logged in! Testing interview-prep endpoint...");
        
        // 2. Test endpoint (assume interview 1 exists)
        try {
            const prepRes = await axios.get("http://localhost:5001/api/ai/interview-prep/1", {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("✅ Endpoint Response:", JSON.stringify(prepRes.data, null, 2));
        } catch (e) {
            console.error("❌ Endpoint Failed:", e.response ? e.response.status : e.message);
            if (e.response) console.error("Error Data:", e.response.data);
        }
    } else {
        console.error("❌ Login failed:", loginRes.data);
    }
  } catch (err) {
    console.error("❌ Test Script Error:", err.message);
  } finally {
    process.exit();
  }
}

test();
