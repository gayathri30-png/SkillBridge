import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Search, Zap, Star, Shield, Info } from 'lucide-react';
import './AddSkillModal.css';

const AddSkillModal = ({ onClose, onSuccess }) => {
  const [skills, setSkills] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [proficiency, setProficiency] = useState('Beginner');
  const [experience, setExperience] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filteredSkills, setFilteredSkills] = useState([]);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const res = await axios.get('/api/skills/');
      setSkills(res.data);
    } catch (err) {
      console.error("Error fetching skill list:", err);
    }
  };

  useEffect(() => {
    if (search.trim()) {
      const filtered = skills.filter(s => 
        s.name.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredSkills(filtered);
    } else {
      setFilteredSkills([]);
    }
  }, [search, skills]);

  const handleSave = async () => {
    if (!selectedSkill) return;
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/skills/user', {
        skillId: selectedSkill.id,
        proficiency,
        years_of_experience: experience
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onSuccess();
    } catch (err) {
      console.error("Error adding skill:", err);
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay-v2">
      <div className="modal-content-v2">
        <div className="modal-header-v2">
          <h3>Add New Skill</h3>
          <button className="close-btn-v2" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="modal-body-v2">
          {/* Skill Search */}
          <div className="input-group-v2">
            <label><Search size={14} /> Search Skill</label>
            <div className="search-box-v2">
              <input 
                type="text" 
                placeholder="e.g. JavaScript, React..." 
                value={selectedSkill ? selectedSkill.name : search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSelectedSkill(null);
                }}
              />
              {filteredSkills.length > 0 && !selectedSkill && (
                <div className="search-results-v2">
                  {filteredSkills.map(s => (
                    <div 
                      key={s.id} 
                      className="result-item-v2"
                      onClick={() => setSelectedSkill(s)}
                    >
                      {s.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Proficiency Level */}
          <div className="input-group-v2">
            <label><Zap size={14} /> Proficiency Level</label>
            <div className="proficiency-options-v2">
              {['Beginner', 'Intermediate', 'Advanced'].map(level => (
                <button 
                  key={level}
                  className={`level-btn-v2 ${proficiency === level ? 'active' : ''}`}
                  onClick={() => setProficiency(level)}
                >
                  {level === 'Beginner' && <Star size={14} />}
                  {level === 'Intermediate' && <Shield size={14} />}
                  {level === 'Advanced' && <Zap size={14} />}
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div className="input-group-v2">
            <label><Info size={14} /> Years of Experience (optional)</label>
            <input 
              type="number" 
              min="0" 
              value={experience} 
              onChange={(e) => setExperience(e.target.value)} 
              placeholder="e.g. 2"
            />
          </div>
        </div>

        <div className="modal-footer-v2">
          <button className="cancel-btn-v2" onClick={onClose}>Cancel</button>
          <button 
            className="save-btn-v2" 
            disabled={!selectedSkill || loading}
            onClick={handleSave}
          >
            {loading ? 'Adding...' : 'Save Skill'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSkillModal;
