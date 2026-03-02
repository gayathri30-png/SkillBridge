import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Plus, Trash2, Zap, Award, Star, Shield, 
  ChevronRight, ArrowLeft, Filter, RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './SkillsManager-v2.css';

const SkillsManager = () => {
  const [allSkills, setAllSkills] = useState([]);
  const [mySkills, setMySkills] = useState([]);
  const [search, setSearch] = useState('');
  const [proficiency, setProficiency] = useState('Beginner');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setRefreshing(true);
    try {
      const token = localStorage.getItem('token');
      const [allRes, myRes] = await Promise.all([
        axios.get('/api/skills/'),
        axios.get('/api/skills/my-skills', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setAllSkills(allRes.data);
      setMySkills(myRes.data);
    } catch (err) {
      console.error("Error fetching skills:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const addSkill = async (skillId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/skills/user', {
        skillId,
        proficiency,
        years_of_experience: 0
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      console.error("Error adding skill:", err);
    }
  };

  const removeSkill = async (userSkillId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/skills/user/${userSkillId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      console.error("Error removing skill:", err);
    }
  };

  const filteredAvailable = allSkills.filter(skill => 
    !mySkills.find(ms => ms.skill_id === skill.id) &&
    skill.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="p-8 text-center text-slate-500">Loading Expertise Center...</div>;

  return (
    <div className="skills-manager-v2 fade-in">
      <div className="skills-manager-header">
        <div>
           <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-2 font-semibold">
              <ArrowLeft size={16} /> Back to Dashboard
           </button>
           <h1>Expertise Center</h1>
        </div>
        <button onClick={fetchData} className={`icon-btn-large ${refreshing ? 'animate-spin' : ''}`}>
           <RefreshCw size={20} />
        </button>
      </div>

      <div className="skills-grid-wrapper">
        {/* Left: My Skills Hub */}
        <div className="skills-hub">
          <section className="skills-card-v2">
            <h2><Award className="text-blue-600" /> Your Endorsed Expertise</h2>
            <div className="skill-list-grid">
              <AnimatePresence>
                {mySkills.length > 0 ? mySkills.map(skill => (
                  <motion.div 
                    key={skill.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="skill-pill-v2"
                  >
                    <div className="skill-pill-header">
                      <h4>{skill.name}</h4>
                      <button onClick={() => removeSkill(skill.id)} className="skill-delete-btn">
                         <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="skill-meta-tags">
                      <span className={`skill-tag-v2 ${skill.proficiency.toLowerCase()}`}>
                        {skill.proficiency}
                      </span>
                    </div>
                    <div className="skill-exp-v2">
                       <Star size={12} className="text-amber-500" /> {skill.endorsements || 0} Endorsements
                    </div>
                  </motion.div>
                )) : (
                  <div className="col-span-full py-12 text-center text-slate-400">
                     <Zap size={48} className="mx-auto mb-4 opacity-20" />
                     <p>Your expertise is quiet... Start adding skills below!</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </section>
        </div>

        {/* Right: Search & Discover */}
        <div className="search-sidebar">
          <section className="skills-card-v2 search-section-v2">
            <h2><Filter className="text-blue-600" /> Discover Skills</h2>
            
            <div className="search-input-wrapper-v2">
              <Search className="search-icon-v2" size={20} />
              <input 
                type="text" 
                placeholder="Search technologies..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="proficiency-selector-v2 flex gap-2 mb-6">
               {['Beginner', 'Intermediate', 'Advanced'].map(level => (
                 <button 
                    key={level}
                    onClick={() => setProficiency(level)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border-2 transition-all ${
                      proficiency === level ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'border-slate-100 text-slate-500 hover:border-blue-200'
                    }`}
                 >
                    {level}
                 </button>
               ))}
            </div>

            <div className="available-pills">
              {filteredAvailable.slice(0, 15).map(skill => (
                <button 
                  key={skill.id} 
                  className="add-pill-btn"
                  onClick={() => addSkill(skill.id)}
                >
                  <span>{skill.name}</span>
                  <div className="plus-icon"><Plus size={16} /></div>
                </button>
              ))}
              {filteredAvailable.length === 0 && (
                <p className="text-sm text-center text-slate-400 py-4">No skills found.</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SkillsManager;
