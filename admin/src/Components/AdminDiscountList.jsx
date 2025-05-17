import React, { useEffect, useState } from 'react';
import { fetchDiscounts, deleteDiscount, createDiscount } from '../discountAPI';
import './AdminDiscountList.css';  

const AdminDiscountList = ({ token }) => {
  const [discounts, setDiscounts] = useState([]);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage',
    value: '',
    minPurchase: '',
    maxDiscount: '',
    applicableItems: [],
    applicable_SubCategories: [],
    applicableCategories: [],
    startDate: '',
    endDate: '',
    isActive: true,
    usageLimit: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Get user info from localStorage or context
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
  }, []);

  useEffect(() => {
    if (user && user.role === 'Admin') {
      fetchDiscounts(token)
        .then(res => setDiscounts(res.data))
        .catch(err => console.error(err));
    }
  }, [token, user]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this discount?')) {
      deleteDiscount(id, token)
        .then(() => setDiscounts(prev => prev.filter(d => d._id !== id)))
        .catch(err => alert(err.response?.data?.error || 'Error deleting discount'));
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate form input
    if (!formData.code || !formData.value || !formData.startDate || !formData.endDate) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      const dataToSend = {
        code: formData.code,
        type: formData.type,
        value: Number(formData.value),
        minPurchase: formData.minPurchase ? Number(formData.minPurchase) : 0,
        maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : 0,
        applicableItems: formData.applicableItems,
        applicable_SubCategories: formData.applicable_SubCategories,
        applicableCategories: formData.applicableCategories,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        isActive: formData.isActive,
        usageLimit: formData.usageLimit ? Number(formData.usageLimit) : 0
      };

      const newDiscount = await createDiscount(dataToSend, token);
      setDiscounts(prev => [...prev, newDiscount.data]); 

      // Reset form fields after successful creation
      setFormData({
        code: '',
        type: 'percentage',
        value: '',
        minPurchase: '',
        maxDiscount: '',
        applicableItems: [],
        applicable_SubCategories: [],
        applicableCategories: [],
        startDate: '',
        endDate: '',
        isActive: true,
        usageLimit: ''
      });
      setSuccess('Discount created successfully.');
    } catch (err) {
      const msg = err.response?.data?.error || 'Error creating discount';
      setError(msg);
    }
  };

  // Role-based access control
  if (!user) return <div className="admin-text-red">Loading...</div>;
  if (user.role !== 'Admin') return <div className="admin-text-red">Access Denied</div>;

  return (
    <div className="admin-container">
      <h2 className="admin-header">All Discounts</h2>

      {/* Success and error messages */}
      {success && <div className="admin-success-message">{success}</div>}
      {error && <div className="admin-error-message">{error}</div>}

      {/* Discount creation form */}
      <h3 className="admin-subheader">Create a new Discount</h3>
      <form className="admin-form" onSubmit={handleCreate}>
        <div className="admin-form-group">
          <label className="admin-form-label">Code</label>
          <input 
            type="text" 
            value={formData.code} 
            onChange={e => setFormData({ ...formData, code: e.target.value })} 
            required 
            className="admin-input"
          />
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">Type</label>
          <select 
            value={formData.type} 
            onChange={e => setFormData({ ...formData, type: e.target.value })}
            className="admin-input"
          >
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed Amount</option>
          </select>
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">Value</label>
          <input 
            type="number" 
            value={formData.value} 
            onChange={e => setFormData({ ...formData, value: e.target.value })} 
            required 
            className="admin-input"
          />
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">Min Purchase</label>
          <input 
            type="number" 
            value={formData.minPurchase} 
            onChange={e => setFormData({ ...formData, minPurchase: e.target.value })} 
            className="admin-input"
          />
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">Max Discount</label>
          <input 
            type="number" 
            value={formData.maxDiscount} 
            onChange={e => setFormData({ ...formData, maxDiscount: e.target.value })} 
            className="admin-input"
          />
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">Applicable Items (IDs)</label>
          <input 
            type="text" 
            value={formData.applicableItems.join(', ')} 
            onChange={e => setFormData({ 
              ...formData, 
              applicableItems: e.target.value.split(',').map(id => id.trim()) 
            })} 
            className="admin-input"
          />
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">Applicable Subcategories (IDs)</label>
          <input 
            type="text" 
            value={formData.applicable_SubCategories.join(', ')} 
            onChange={e => setFormData({ 
              ...formData, 
              applicable_SubCategories: e.target.value.split(',').map(id => id.trim()) 
            })} 
            className="admin-input"
          />
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">Applicable Categories (IDs)</label>
          <input 
            type="text" 
            value={formData.applicableCategories.join(', ')} 
            onChange={e => setFormData({ 
              ...formData, 
              applicableCategories: e.target.value.split(',').map(id => id.trim()) 
            })} 
            className="admin-input"
          />
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">Start Date</label>
          <input 
            type="date" 
            value={formData.startDate} 
            onChange={e => setFormData({ ...formData, startDate: e.target.value })} 
            required 
            className="admin-input"
          />
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">End Date</label>
          <input 
            type="date" 
            value={formData.endDate} 
            onChange={e => setFormData({ ...formData, endDate: e.target.value })} 
            required 
            className="admin-input"
          />
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">Active</label>
          <input 
            type="checkbox" 
            checked={formData.isActive} 
            onChange={e => setFormData({ ...formData, isActive: e.target.checked })} 
            className="admin-input"
          />
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">Usage Limit</label>
          <input 
            type="number" 
            value={formData.usageLimit} 
            onChange={e => setFormData({ ...formData, usageLimit: e.target.value })} 
            className="admin-input"
          />
        </div>
        <button type="submit" className="admin-button">Create Discount</button>
      </form>

      {/* Display discount list */}
      <table className="admin-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Type</th>
            <th>Value</th>
            <th>Start</th>
            <th>End</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {discounts.map(discount => (
            <tr key={discount._id}>
              <td>{discount.code}</td>
              <td>{discount.type}</td>
              <td>{discount.value}</td>
              <td>{new Date(discount.startDate).toLocaleDateString()}</td>
              <td>{new Date(discount.endDate).toLocaleDateString()}</td>
              <td>{discount.isActive ? 'Yes' : 'No'}</td>
              <td>
                <button 
                  onClick={() => handleDelete(discount._id)} 
                  className="admin-button admin-button-delete"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDiscountList;
