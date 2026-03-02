import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Briefcase, Link as LinkIcon, Plus, Trash2, ExternalLink, Code2, Award } from 'lucide-react';

const Portfolio = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    type: 'project',
    title: '',
    description: '',
    link_url: '',
    image_url: '',
    technologies: ''
  });

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/portfolio', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(res.data);
    } catch (err) {
      console.error('Failed to fetch portfolio:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const endpoint = formData.type === 'project' 
        ? '/api/portfolio/projects' 
        : '/api/portfolio/certificates';
        
      await axios.post(endpoint, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowForm(false);
      setFormData({ type: 'project', title: '', description: '', link_url: '', image_url: '', technologies: '' });
      fetchPortfolio();
    } catch (err) {
      alert('Failed to add item. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/portfolio/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(items.filter(item => item.id !== id));
    } catch (err) {
      alert('Failed to delete item.');
    }
  };

  const projects = items.filter(item => item.type === 'project');
  const certificates = items.filter(item => item.type === 'certificate');

  if (loading) return <div className="p-10 text-center text-slate-500 font-bold animate-pulse">Loading Portfolio Data...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-10 mt-4">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight leading-tight">My Showcase</h1>
          <p className="text-slate-500 font-medium mt-1 tracking-wide">Manage your projects, certificates, and achievements.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="bg-[#0f172a] hover:bg-[#1e293b] flex items-center justify-center rounded-[20px] px-6 py-3 shadow-[0_10px_20px_rgba(15,23,42,0.15)] hover:shadow-[0_15px_30px_rgba(15,23,42,0.25)] transition-all hover:-translate-y-1 text-white font-black text-[12px] tracking-widest uppercase border border-slate-700/50"
        >
          {showForm ? 'Cancel Entry' : <><Plus size={16} className="mr-2" /> Add Item</>}
        </button>
      </div>

      {showForm && (
        <div className="bg-white/80 backdrop-blur-3xl p-8 rounded-[32px] shadow-2xl border border-white/50 mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Briefcase className="text-indigo-500" /> New Portfolio Item
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black tracking-widest text-slate-400 uppercase">Item Type</label>
                <select name="type" value={formData.type} onChange={handleChange} className="w-full bg-slate-50 border-none p-4 rounded-2xl font-bold text-slate-700 outline-none ring-2 ring-transparent focus:ring-indigo-500/20 transition-all">
                  <option value="project">Development Project</option>
                  <option value="certificate">Certification / Award</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black tracking-widest text-slate-400 uppercase">Title</label>
                <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full bg-slate-50 border-none p-4 rounded-2xl font-bold text-slate-700 outline-none ring-2 ring-transparent focus:ring-indigo-500/20 transition-all" placeholder="e.g. AI Content Generator" />
              </div>
            </div>
            
            <div className="space-y-2">
                <label className="text-[11px] font-black tracking-widest text-slate-400 uppercase">Description (Required for AI Analysis)</label>
                <textarea required name="description" value={formData.description} onChange={handleChange} className="w-full bg-slate-50 border-none p-4 rounded-2xl font-bold text-slate-700 min-h-[120px] outline-none ring-2 ring-transparent focus:ring-indigo-500/20 transition-all" placeholder="Describe the problem, your solution, and your specific role..." />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black tracking-widest text-slate-400 uppercase">Tech Stack (Comma Separated)</label>
                <input type="text" name="technologies" value={formData.technologies} onChange={handleChange} className="w-full bg-slate-50 border-none p-4 rounded-2xl font-bold text-slate-700 outline-none ring-2 ring-transparent focus:ring-indigo-500/20 transition-all" placeholder="React, Node.js, Python..." />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black tracking-widest text-slate-400 uppercase">External Link (Optional)</label>
                <input type="url" name="link_url" value={formData.link_url} onChange={handleChange} className="w-full bg-slate-50 border-none p-4 rounded-2xl font-bold text-slate-700 outline-none ring-2 ring-transparent focus:ring-indigo-500/20 transition-all" placeholder="https://github.com/your/repo" />
              </div>
            </div>
            
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-[12px] p-4 rounded-2xl shadow-xl shadow-indigo-500/20 transition-all hover:-translate-y-1">
              Save Portfolio Item
            </button>
          </form>
        </div>
      )}

      {/* Projects Section */}
      <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2"><Code2 size={18} /> Featured Projects</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {projects.length > 0 ? projects.map(project => (
          <div key={project.id} className="group bg-white/70 backdrop-blur-2xl p-8 rounded-[40px] border border-white/60 shadow-[0_20px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.06)] transition-all duration-500 hover:-translate-y-2 flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-[20px] shadow-inner border border-white flex items-center justify-center text-blue-600">
                        <Briefcase size={24} />
                    </div>
                    <button onClick={() => handleDelete(project.id)} className="text-slate-300 hover:text-rose-500 transition-colors bg-white p-2 rounded-xl shadow-sm border border-slate-100">
                      <Trash2 size={16} />
                    </button>
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">{project.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed mb-6 line-clamp-3">{project.description}</p>
                
                {project.technologies && (
                  <div className="flex flex-wrap gap-2 mb-8">
                    {project.technologies.split(',').map((tech, i) => (
                        <span key={i} className="px-3 py-1.5 bg-slate-100/80 text-slate-600 text-[10px] font-bold uppercase tracking-widest rounded-lg border border-slate-200/50">
                            {tech.trim()}
                        </span>
                    ))}
                  </div>
                )}
            </div>
            
            {project.link_url && (
                <a href={project.link_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-4 bg-slate-50 hover:bg-slate-900 group-hover:text-white text-slate-700 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">
                    View Live Project <ExternalLink size={14} />
                </a>
            )}
          </div>
        )) : (
            <div className="col-span-full py-16 bg-white/50 backdrop-blur-md rounded-[40px] border border-dashed border-slate-200 text-center">
                <Code2 size={48} className="mx-auto text-slate-300 mb-4" />
                <h3 className="text-xl font-bold text-slate-800 mb-2">No Projects Added</h3>
                <p className="text-slate-500 font-medium max-w-sm mx-auto">Add your development projects to power up your AI portfolio analysis.</p>
            </div>
        )}
      </div>

      {/* Certificates Section */}
      <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2"><Award size={18} /> Credentials & Awards</h2>
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {certificates.length > 0 ? certificates.map(cert => (
          <div key={cert.id} className="bg-white/70 backdrop-blur-2xl p-6 rounded-[32px] border border-white/60 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:-translate-y-1 transition-all flex flex-col gap-4">
             <div className="flex justify-between items-start">
                <div className="w-12 h-12 bg-amber-50 rounded-[16px] flex items-center justify-center text-amber-500 border border-amber-100">
                    <Award size={20} />
                </div>
                 <button onClick={() => handleDelete(cert.id)} className="text-slate-300 hover:text-rose-500 transition-colors">
                  <Trash2 size={16} />
                </button>
             </div>
             <div>
                <h4 className="font-bold text-slate-800 mb-1 leading-snug">{cert.title}</h4>
                <p className="text-xs font-medium text-slate-500 line-clamp-2">{cert.description}</p>
             </div>
             {cert.link_url && (
                 <a href={cert.link_url} target="_blank" rel="noopener noreferrer" className="mt-auto text-[10px] font-black text-indigo-500 hover:text-indigo-600 uppercase tracking-widest flex items-center gap-1">
                     Verify Credential <ExternalLink size={12} />
                 </a>
             )}
          </div>
        )) : (
            <div className="col-span-full py-10 bg-slate-50/50 rounded-[32px] border border-dashed border-slate-200 text-center">
                <p className="text-slate-400 font-medium text-sm">No credentials added yet.</p>
            </div>
        )}
       </div>

    </div>
  );
};

export default Portfolio;
