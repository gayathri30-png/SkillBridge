import React, { useState } from 'react';
import axios from 'axios';
import { X, Layout, Type, Link as LinkIcon, Image as ImageIcon, Plus, Tag } from 'lucide-react';
import './AddProjectModal.css';

const AddProjectModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    link_url: '',
    image_url: ''
  });
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tag = currentTag.trim();
      if (tag && !tags.includes(tag)) {
        setTags([...tags, tag]);
        setCurrentTag('');
      }
    }
  };

  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        // In a real app, you'd upload this to a server first
        setFormData({ ...formData, image_url: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/portfolio/projects', {
        ...formData,
        technologies: tags.join(','),
        type: 'project'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onSuccess();
    } catch (error) {
      console.error('Error adding project:', error);
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay-v2">
      <div className="modal-content-v2 project-modal">
        <div className="modal-header-v2">
          <h3>Add New Project</h3>
          <button className="close-btn-v2" onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body-v2">
          <div className="input-group-v2">
            <label><Type size={14} /> Project Title</label>
            <input 
              type="text" 
              required 
              placeholder="e.g. E-learning Platform"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="input-group-v2">
            <label><Layout size={14} /> Description</label>
            <textarea 
              rows="3" 
              placeholder="Briefly describe what your project does..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            ></textarea>
          </div>

          <div className="input-group-v2">
            <label><Tag size={14} /> Technologies Used (Press Enter to add)</label>
            <div className="tags-input-container">
              {tags.map((tag, index) => (
                <span key={index} className="tag-chip">
                  {tag}
                  <button type="button" onClick={() => removeTag(index)}><X size={12} /></button>
                </span>
              ))}
              <input 
                type="text" 
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder={tags.length === 0 ? "e.g. React, Node.js..." : ""}
              />
            </div>
          </div>

          <div className="input-grid-v2">
            <div className="input-group-v2">
              <label><LinkIcon size={14} /> Project URL</label>
              <input 
                type="url" 
                placeholder="https://github.com/..."
                value={formData.link_url}
                onChange={(e) => setFormData({...formData, link_url: e.target.value})}
              />
            </div>
          </div>

          <div className="input-group-v2">
            <label><ImageIcon size={14} /> Project Cover Image</label>
            <div className="image-upload-dropzone">
              <input 
                type="file" 
                id="project-image" 
                hidden 
                accept="image/*"
                onChange={handleImageChange}
              />
              <label htmlFor="project-image" className="dropzone-label">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="preview-img" />
                ) : (
                  <div className="placeholder">
                    <Plus size={24} />
                    <span>Click to upload project cover</span>
                  </div>
                )}
              </label>
            </div>
          </div>

          <div className="modal-footer-v2">
            <button type="button" className="cancel-btn-v2" onClick={onClose}>Cancel</button>
            <button type="submit" className="save-btn-v2" disabled={loading}>
              {loading ? 'Saving...' : 'Save Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProjectModal;
