import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SkillsManager.css";

function SkillsManager() {
  const [allSkills, setAllSkills] = useState([]);
  const [mySkills, setMySkills] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProficiency, setSelectedProficiency] = useState("Beginner");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // Fetch skills on load
  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);

      const allRes = await axios.get("http://localhost:5000/api/skills/all");
      setAllSkills(allRes.data);

      const myRes = await axios.get(
        "http://localhost:5000/api/skills/my-skills",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMySkills(myRes.data);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching skills:", error);
      setLoading(false);
    }
  };

  const addSkill = async (skillId) => {
    try {
      await axios.post(
        "http://localhost:5000/api/skills/add",
        { skillId, proficiency: selectedProficiency },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchSkills();
      alert("Skill added successfully!");
    } catch (error) {
      console.error("Error adding skill:", error);
      alert(error.response?.data?.error || "Failed to add skill");
    }
  };

  const removeSkill = async (userSkillId) => {
    if (!window.confirm("Are you sure you want to remove this skill?")) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/skills/remove/${userSkillId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchSkills();
      alert("Skill removed successfully!");
    } catch (error) {
      console.error("Error removing skill:", error);
      alert("Failed to remove skill");
    }
  };

  const updateProficiency = async (userSkillId, proficiency) => {
    try {
      await axios.put(
        `http://localhost:5000/api/skills/update/${userSkillId}`,
        { proficiency },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMySkills(
        mySkills.map((skill) =>
          skill.id === userSkillId ? { ...skill, proficiency } : skill
        )
      );
    } catch (error) {
      console.error("Error updating proficiency:", error);
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
                    onClick={() => removeSkill(skill.id)}
                  >
                    ×
                  </button>
                </div>

                <div className="proficiency-selector">
                  <label>Proficiency:</label>
                  <select
                    value={skill.proficiency}
                    onChange={(e) =>
                      updateProficiency(skill.id, e.target.value)
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
                onClick={() => addSkill(skill.id)}
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
