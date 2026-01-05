import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SkillsManager.css";

function SkillsManager() {
  const [allSkills, setAllSkills] = useState([]);
  const [mySkills, setMySkills] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProficiency, setSelectedProficiency] = useState("Beginner");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch skills on load
  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      setError("");

      console.log("🔄 Fetching all skills...");
      const allRes = await axios.get("http://localhost:5001/api/skills/all");
      console.log("✅ All skills:", allRes.data);
      setAllSkills(allRes.data);

      console.log("🔄 Fetching my skills...");
      const myRes = await axios.get(
        "http://localhost:5001/api/skills/my-skills",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("✅ My skills:", myRes.data);
      setMySkills(myRes.data);

      setLoading(false);
    } catch (error) {
      console.error("❌ Error fetching skills:", error);
      setError("Failed to load skills. Please try again.");
      setLoading(false);
    }
  };

  const addSkill = async (skillId, skillName) => {
    try {
      console.log(`➕ Adding skill: ${skillName} (ID: ${skillId})`);
      console.log(`📤 Sending to backend:`, {
        skillId,
        proficiency: selectedProficiency,
      });
      console.log(`🔑 Token exists:`, !!token);

      const response = await axios.post(
        "http://localhost:5001/api/skills/add",
        {
          skillId,
          proficiency: selectedProficiency,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ Backend response:", response.data);

      if (response.data.success) {
        alert(`✅ ${skillName} added successfully!`);
        fetchSkills();
      } else {
        alert(`❌ ${response.data.error || "Failed to add skill"}`);
      }
    } catch (error) {
      console.error("❌ Error adding skill:", error);

      if (error.response) {
        // Server responded with error
        console.error("Server error:", error.response.data);
        console.error("Status:", error.response.status);
        alert(
          `❌ Server Error: ${
            error.response.data?.error || "Failed to add skill"
          }`
        );
      } else if (error.request) {
        // No response received
        console.error("No response received:", error.request);
        alert(
          "❌ No response from server. Check if backend is running on port 5000."
        );
      } else {
        // Request setup error
        console.error("Request error:", error.message);
        alert(`❌ Request Error: ${error.message}`);
      }
    }
  };

  const removeSkill = async (userSkillId, skillName) => {
    if (!window.confirm(`Are you sure you want to remove "${skillName}"?`))
      return;

    try {
      const response = await axios.delete(
        `http://localhost:5001/api/skills/remove/${userSkillId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ Remove response:", response.data);

      if (response.data.success) {
        alert(`✅ ${skillName} removed successfully!`);
        fetchSkills();
      }
    } catch (error) {
      console.error("Error removing skill:", error);
      alert("❌ Failed to remove skill");
    }
  };

  const updateProficiency = async (userSkillId, proficiency, skillName) => {
    try {
      console.log(`🔄 Updating ${skillName} to ${proficiency}`);

      const response = await axios.put(
        `http://localhost:5001/api/skills/update/${userSkillId}`,
        { proficiency },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ Update response:", response.data);

      // Update local state
      setMySkills(
        mySkills.map((skill) =>
          skill.id === userSkillId ? { ...skill, proficiency } : skill
        )
      );
    } catch (error) {
      console.error("Error updating proficiency:", error);
      alert(`❌ Failed to update ${skillName}`);
    }
  };

  // IDs of skills user already has
  const mySkillIds = mySkills.map((s) => s.skill_id);

  // Filter available skills
  const availableSkills = allSkills.filter(
    (skill) =>
      !mySkillIds.includes(skill.id) &&
      skill.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading">Loading skills...</div>;

  return (
    <div className="skills-manager">
      <h1>My Skills</h1>

      {error && <div className="error-message">{error}</div>}

      <div
        className="debug-info"
        style={{
          background: "#f0f0f0",
          padding: "10px",
          marginBottom: "20px",
          borderRadius: "5px",
          fontSize: "12px",
        }}
      >
        <strong>Debug Info:</strong>
        User: {user?.name} ({user?.role}) | Token:{" "}
        {token ? "Present ✅" : "Missing ❌"} | All Skills: {allSkills.length} |
        My Skills: {mySkills.length}
      </div>

      {/* My Skills */}
      <div className="my-skills-section">
        <h2>Your Current Skills ({mySkills.length})</h2>

        {mySkills.length === 0 ? (
          <div className="no-skills">
            <p>You haven't added any skills yet. Add some below!</p>
          </div>
        ) : (
          <div className="skills-grid">
            {mySkills.map((skill) => (
              <div key={skill.id} className="skill-card">
                <div className="skill-header">
                  <h3>{skill.name}</h3>
                  <button
                    className="remove-btn"
                    onClick={() => removeSkill(skill.id, skill.name)}
                    title={`Remove ${skill.name}`}
                  >
                    ×
                  </button>
                </div>

                <div className="proficiency-selector">
                  <label>Proficiency:</label>
                  <select
                    value={skill.proficiency}
                    onChange={(e) =>
                      updateProficiency(skill.id, e.target.value, skill.name)
                    }
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div
                  className={`proficiency-badge ${skill.proficiency.toLowerCase()}`}
                >
                  {skill.proficiency}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Skills */}
      <div className="add-skills-section">
        <h2>Add New Skills</h2>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="proficiency-filter">
            <label>Set proficiency:</label>
            <select
              value={selectedProficiency}
              onChange={(e) => setSelectedProficiency(e.target.value)}
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        {availableSkills.length === 0 ? (
          <p className="no-results">
            {searchTerm
              ? "No skills found matching your search"
              : "No more skills to add!"}
          </p>
        ) : (
          <div className="available-skills">
            {availableSkills.map((skill) => (
              <button
                key={skill.id}
                className="skill-btn"
                onClick={() => addSkill(skill.id, skill.name)}
                title={`Add ${skill.name} as ${selectedProficiency}`}
              >
                {skill.name}
                <span className="proficiency-preview">
                  ({selectedProficiency})
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="skills-stats">
        <p>Total Skills Available: {allSkills.length}</p>
        <p>Your Skills: {mySkills.length}</p>
        <p>Skills Remaining: {availableSkills.length}</p>
      </div>
    </div>
  );
}

export default SkillsManager;
