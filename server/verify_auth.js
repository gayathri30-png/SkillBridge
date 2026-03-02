const API_URL = "http://localhost:5001/api/auth";

const testAuth = async () => {
    console.log("🚀 Starting Auth Verification (using native fetch)...");

    // Check if server is reachable first
    try {
        const verifyRes = await fetch("http://localhost:5001/api/verify");
        if (verifyRes.ok) {
            console.log("✅ Server is reachable.");
        } else {
            console.error("❌ Server verify route returned error status:", verifyRes.status);
            process.exit(1);
        }
    } catch (err) {
        console.error("❌ Server is NOT reachable on http://localhost:5001. Make sure it's running!");
        process.exit(1);
    }

    const testUser = {
        name: "Test User_" + Math.floor(Math.random() * 1000),
        email: `test_${Date.now()}@example.com`,
        password: "password123",
        role: "student"
    };

    try {
        // 1. Register
        console.log("📝 Testing Registration...");
        const regRes = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testUser)
        });
        const regData = await regRes.json();

        if (regRes.ok) {
            console.log("✅ Registration successful:", regData.message);
        } else {
            throw new Error(`Registration failed: ${regData.error || regRes.statusText}`);
        }

        // 2. Login
        console.log("🔑 Testing Login...");
        const loginRes = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: testUser.email,
                password: testUser.password
            })
        });
        const loginData = await loginRes.json();

        if (loginRes.ok) {
            console.log("✅ Login successful, token received.");
        } else {
            throw new Error(`Login failed: ${loginData.error || loginRes.statusText}`);
        }

        // 3. Verify Token
        const token = loginData.token;
        if (token) {
            console.log("✅ Token exists and looks valid.");
        } else {
            throw new Error("Token missing from login response");
        }

        console.log("\n🎉 ALL AUTH TESTS PASSED!");
    } catch (err) {
        console.error("❌ Auth Test Failed:", err.message);
    }
};

testAuth();
