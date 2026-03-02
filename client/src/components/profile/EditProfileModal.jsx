import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  X, User, Info, MapPin, Phone, Github, Linkedin, Globe, 
  FileText, Upload, Save, AlertCircle 
} from 'lucide-react';
import './AddProjectModal.css'; // Reusing modal base styles

const EditProfileModal = ({ userData, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: userData.name || '',
    bio: userData.bio || '',
    phone: userData.phone || '',
    location: userData.location || '',
    github_url: userData.github_url || '',
    linkedin_url: userData.linkedin_url || '',
    portfolio_url: userData.portfolio_url || '',
    resume_url: userData.resume_url || ''
  });
  
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const token = localStorage.getItem('token');
      const uploadData = new FormData();
      uploadData.append('file', file);

      const res = await axios.post('/api/upload', uploadData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setFormData(prev => ({ ...prev, resume_url: res.data.url }));
    } catch (err) {
      console.error("Upload failed", err);
      alert("Resume upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      await axios.put('/api/users/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onSuccess();
    } catch (err) {
      console.error("Update failed", err);
      setError("Failed to update profile. Please check your data.");
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay-v2">
      <div className="modal-content-v2 project-modal">
        <div className="modal-header-v2">
          <h3>Edit Profile Information</h3>
          <button className="close-btn-v2" onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body-v2">
          {error && <div className="error-alert"><AlertCircle size={16} /> {error}</div>}

          {/* Core Info */}
          <div className="input-group-v2">
            <label><User size={14} /> Full Name</label>
            <input 
              type="text" 
              name="name"
              required 
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>

          <div className="input-group-v2">
            <label><Info size={14} /> Professional Bio</label>
            <textarea 
              name="bio"
              rows="3" 
              placeholder="Tell us about yourself..."
              value={formData.bio}
              onChange={handleInputChange}
            ></textarea>
          </div>

          <div className="input-grid-v2">
            <div className="input-group-v2">
              <label><MapPin size={14} /> Location</label>
              <input 
                type="text" 
                name="location"
                placeholder="e.g. London, Remote"
                value={formData.location}
                onChange={handleInputChange}
              />
            </div>
            <div className="input-group-v2">
              <label><Phone size={14} /> Phone</label>
              <input 
                type="text" 
                name="phone"
                placeholder="e.g. +1 234 567 890"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Links */}
          <div className="input-group-v2">
            <label><Github size={14} /> GitHub Profile</label>
            <input 
              type="url" 
              name="github_url"
              placeholder="https://github.com/..."
              value={formData.github_url}
              onChange={handleInputChange}
            />
          </div>

          <div className="input-group-v2">
            <label><Linkedin size={14} /> LinkedIn Profile</label>
            <input 
              type="url" 
              name="linkedin_url"
              placeholder="https://linkedin.com/in/..."
              value={formData.linkedin_url}
              onChange={handleInputChange}
            />
          </div>

          {/* Resume Upload */}
          <div className="input-group-v2">
            <label><FileText size={14} /> Official Resume (PDF/DOC)</label>
            <div className="flex gap-4 items-center">
                <div className="flex-1">
                    <input 
                        type="text" 
                        readOnly 
                        className="bg-slate-50 cursor-not-allowed"
                        placeholder="No file uploaded"
                        value={formData.resume_url}
                    />
                </div>
                <label className="btn btn-outline py-3 px-4 flex items-center gap-2 cursor-pointer bg-white mb-0">
                    {uploading ? "..." : <Upload size={16} />}
                    <input type="file" hidden accept=".pdf,.doc,.docx" onChange={handleResumeUpload} />
                </label>
            </div>
          </div>

          <div className="modal-footer-v2">
            <button type="button" className="cancel-btn-v2" onClick={onClose}>Cancel</button>
            <button type="submit" className="save-btn-v2" disabled={loading || uploading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
