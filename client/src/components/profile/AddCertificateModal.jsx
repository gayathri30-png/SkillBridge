import React, { useState } from 'react';
import axios from 'axios';
import { X, Award, Building, Calendar, Link as LinkIcon, Image as ImageIcon, Plus } from 'lucide-react';
import './AddProjectModal.css'; // Reusing the same premium modal styles

const AddCertificateModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '', // Used for "Issuing Organization" or details
    link_url: '',
    image_url: ''
  });
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
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
      await axios.post('/api/portfolio/certificates', {
        ...formData,
        type: 'certificate'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onSuccess();
    } catch (error) {
      console.error('Error adding certificate:', error);
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay-v2">
      <div className="modal-content-v2 project-modal">
        <div className="modal-header-v2">
          <h3>Add Certification</h3>
          <button className="close-btn-v2" onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body-v2">
          <div className="input-group-v2">
            <label><Award size={14} /> Certificate Title</label>
            <input 
              type="text" 
              required 
              placeholder="e.g. Google Data Analytics Professional"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="input-group-v2">
            <label><Building size={14} /> Issuing Organization</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Coursera, Google, Microsoft"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="input-grid-v2">
            <div className="input-group-v2">
              <label><LinkIcon size={14} /> Credential URL (Optional)</label>
              <input 
                type="url" 
                placeholder="https://coursera.org/verify/..."
                value={formData.link_url}
                onChange={(e) => setFormData({...formData, link_url: e.target.value})}
              />
            </div>
          </div>

          <div className="input-group-v2">
            <label><ImageIcon size={14} /> Certificate Image / Badge</label>
            <div className="image-upload-dropzone">
              <input 
                type="file" 
                id="cert-image" 
                hidden 
                accept="image/*"
                onChange={handleImageChange}
              />
              <label htmlFor="cert-image" className="dropzone-label">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="preview-img" />
                ) : (
                  <div className="placeholder">
                    <Plus size={24} />
                    <span>Upload certificate copy</span>
                  </div>
                )}
              </label>
            </div>
          </div>

          <div className="modal-footer-v2">
            <button type="button" className="cancel-btn-v2" onClick={onClose}>Cancel</button>
            <button type="submit" className="save-btn-v2" disabled={loading}>
              {loading ? 'Saving...' : 'Save Certificate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCertificateModal;
