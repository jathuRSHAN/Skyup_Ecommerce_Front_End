import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ContentEditor.css';
import Notification from '../Components/Notification/Notification'; 

const componentFields = {
  Hero: ['headline', 'subtext', 'subtext_img', 'line2', 'line3', 'buttonText', 'hero_img'],
  Navbar: ['logo', 'cart_icon', 'brandText'],
  Footer: ['logo', 'brandText', 'whatsapp_icon', 'instagram_icon', 'facebook_icon', 'twitter_icon', 'copyright'],
  DescriptionBox: ['heading', 'description'],
  Offers: ['heading1', 'heading2', 'offerText', 'offer_img', 'buttonText'],
  Categories: ['gaming_banner', 'phablet_banner', 'budget_banner'], 
};

const ContentEditor = () => {
  const [selectedComponent, setSelectedComponent] = useState('');
  const [fields, setFields] = useState([]);
  const [formData, setFormData] = useState({});
  const [existingData, setExistingData] = useState({});
  const [notification, setNotification] = useState({ message: '', type: '' });
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (selectedComponent) {
      const newFields = componentFields[selectedComponent] || [];
      setFields(newFields);
      fetchComponentContent(selectedComponent);
      setFormData({});
    } else {
      setFields([]);
      setExistingData({});
      setFormData({});
    }
  }, [selectedComponent]);

  const fetchComponentContent = async (component) => {
    try {
      const res = await axios.get(`http://localhost:8070/content/${component}`);
      setExistingData(res.data.data || {});
    } catch (error) {
      console.error('Fetch error:', error);
      setExistingData({});
    }
  };

  const handleFieldChange = (field, type, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: { type, value }
    }));
  };

  const handleTypeChange = (field, type) => {
    const existing = existingData[field];
    let value = '';

    if (type === 'text') {
      value = typeof existing === 'string' && !existing.startsWith('/uploads/')
        ? existing
        : '';
    }

    setFormData(prev => ({
      ...prev,
      [field]: { type, value }
    }));
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedComponent) {
      showNotification('Please select a component.', 'error');
      return;
    }

    const data = new FormData();
    data.append('component', selectedComponent);

    for (const [field, { type, value }] of Object.entries(formData)) {
      if (type === 'text') {
        data.append(field, value);
      } else if (type === 'image' && value) {
        data.append(field, value);
      }
    }

    try {
      await axios.post('http://localhost:8070/content', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      showNotification('Content Updated!', 'success');
      fetchComponentContent(selectedComponent);
      setFormData({});
    } catch (error) {
      console.error('Failed to update content:', error);
      showNotification('Error updating content', 'error');
    }
  };

  return (
    <div className="content-editor-wrapper">
      <div className="content-editor">
        <h2>Content Editor</h2>

        {notification.message && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification({ message: '', type: '' })}
          />
        )}

        <select onChange={e => setSelectedComponent(e.target.value)} value={selectedComponent}>
          <option value="">-- Select Component --</option>
          {Object.keys(componentFields).map(key => (
            <option key={key} value={key}>{key}</option>
          ))}
        </select>

        {fields.length > 0 && (
          <form onSubmit={handleSubmit}>
            {fields.map(field => (
              <div key={field} className="form-group">
                <h4>{field}</h4>

                {existingData[field] && (
                  <div className="existing-preview">
                    {typeof existingData[field] === 'string' && existingData[field].startsWith('/uploads/')
                      ? <img
                          src={`http://localhost:8070${existingData[field]}`}
                          alt={field}
                          style={{ maxWidth: '150px', maxHeight: '100px', objectFit: 'contain' }}
                        />
                      : <p><strong>Current:</strong> {existingData[field]}</p>
                    }
                  </div>
                )}

                <div className="field-type-options">
                  <label>
                    <input
                      type="radio"
                      name={`${field}-type`}
                      checked={formData[field]?.type === 'text'}
                      onChange={() => handleTypeChange(field, 'text')}
                    /> Text
                  </label>
                  <label style={{ marginLeft: '15px' }}>
                    <input
                      type="radio"
                      name={`${field}-type`}
                      checked={formData[field]?.type === 'image'}
                      onChange={() => handleTypeChange(field, 'image')}
                    /> Image
                  </label>
                </div>

                {formData[field]?.type === 'text' && (
                  <input
                    type="text"
                    placeholder="Enter text"
                    value={formData[field]?.value || ''}
                    onChange={e => handleFieldChange(field, 'text', e.target.value)}
                  />
                )}

                {formData[field]?.type === 'image' && (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => handleFieldChange(field, 'image', e.target.files[0])}
                  />
                )}
              </div>
            ))}
            <button type="submit">Save</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ContentEditor;
