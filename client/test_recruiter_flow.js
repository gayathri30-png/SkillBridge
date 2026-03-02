const axios = require('axios');

async function testRecruiterFlow() {
  try {
    console.log("1. Logging in as recruiter...");
    const loginRes = await axios.post('http://localhost:5001/api/auth/login', {
      email: 'gayathri.akshaya2005@gmail.com',
      password: 'gayathrikumar2005'
    });
    
    const token = loginRes.data.token;
    console.log(`✅ Logged in successfully. Expected Role: recruiter | Actual Role: ${loginRes.data.user.role}`);

    console.log("\n2. Posting a new job...");
    const newJob = {
      title: "Senior AI Engineer Internship",
      description: "We are looking for a talented AI Engineer to help us build next-generation machine learning models for our educational platform.",
      job_type: "internship",
      budget: 45.00,
      duration: "6 months",
      location: "San Francisco, CA (Remote)",
      experience_level: "intermediate",
      skills: [1, 2, 3] // Assuming some skill IDs exist
    };

    const postJobRes = await axios.post('http://localhost:5001/api/jobs', newJob, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log(`✅ Job posted successfully! Job ID: ${postJobRes.data.insertId}`);

    console.log("\n3. Verifying Job in Recruiter Dashboard Stats...");
    const dashboardRes = await axios.get('http://localhost:5001/api/jobs/dashboard', {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log("Dashboard Stats:");
    console.log(`Active Jobs: ${dashboardRes.data.stats.activeJobs}`);
    console.log(`Total Applicants: ${dashboardRes.data.stats.totalApplicants}`);
    console.log("\nRecent Jobs Array:");
    dashboardRes.data.recentJobs.forEach(job => {
      console.log(`- ${job.title} at ${job.company} (ID: ${job.id})`);
    });

  } catch (err) {
    console.error("❌ Test Failed:", err.response ? err.response.data : err.message);
  }
}

testRecruiterFlow();
