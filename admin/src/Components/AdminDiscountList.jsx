import React, { useEffect, useState } from 'react';
import { fetchDiscounts, deleteDiscount, createDiscount } from '../discountAPI';
import Notification from './Notification/Notification'; 
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
    applicableItems: '',
    applicable_SubCategories: '',
    applicableCategories: '',
    startDate: '',
    endDate: '',
    isActive: true,
    usageLimit: ''
  });

  const [showNotification, setShowNotification] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });

  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, discountId: null });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
  }, []);

  useEffect(() => {
    if (user && user.role === 'Admin') {
      fetchDiscounts(token)
        .then(res => setDiscounts(res.data))
        .catch(() => {
          setNotification({ message: 'Failed to fetch discounts', type: 'error' });
          setShowNotification(true);
        });
    }
  }, [token, user]);

  const openDeleteConfirm = (id) => {
    setDeleteConfirm({ show: true, discountId: id });
  };

  const cancelDelete = () => {
    setDeleteConfirm({ show: false, discountId: null });
  };

  const confirmDelete = () => {
    const id = deleteConfirm.discountId;
    deleteDiscount(id, token)
      .then(() => {
        setDiscounts(prev => prev.filter(d => d._id !== id));
        setNotification({ message: 'Discount deleted successfully.', type: 'success' });
        setShowNotification(true);
      })
      .catch(err => {
        const msg = err.response?.data?.error || 'Error deleting discount';
        setNotification({ message: msg, type: 'error' });
        setShowNotification(true);
      })
      .finally(() => {
        setDeleteConfirm({ show: false, discountId: null });
      });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setNotification({ message: '', type: '' });
    setShowNotification(false);

    if (!formData.code || !formData.value || !formData.startDate || !formData.endDate) {
      setNotification({ message: 'Please fill in all required fields.', type: 'error' });
      setShowNotification(true);
      return;
    }

    try {
      const dataToSend = {
        code: formData.code,
        type: formData.type,
        value: Number(formData.value),
        minPurchase: formData.minPurchase ? Number(formData.minPurchase) : 0,
        maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : 0,
        applicableItems: formData.applicableItems ? formData.applicableItems.split(',').map(s => s.trim()) : [],
        applicable_SubCategories: formData.applicable_SubCategories ? formData.applicable_SubCategories.split(',').map(s => s.trim()) : [],
        applicableCategories: formData.applicableCategories ? formData.applicableCategories.split(',').map(s => s.trim()) : [],
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        isActive: formData.isActive,
        usageLimit: formData.usageLimit ? Number(formData.usageLimit) : 0
      };

      const newDiscount = await createDiscount(dataToSend, token);
      setDiscounts(prev => [...prev, newDiscount.data]);

      setFormData({
        code: '',
        type: 'percentage',
        value: '',
        minPurchase: '',
        maxDiscount: '',
        applicableItems: '',
        applicable_SubCategories: '',
        applicableCategories: '',
        startDate: '',
        endDate: '',
        isActive: true,
        usageLimit: ''
      });

      setNotification({ message: 'Discount created successfully.', type: 'success' });
      setShowNotification(true);
    } catch (err) {
      const msg = err.response?.data?.error || 'Error creating discount';
      setNotification({ message: msg, type: 'error' });
      setShowNotification(true);
    }
  };

  if (!user) return <div className="admin-text-red">Loading...</div>;
  if (user.role !== 'Admin') return <div className="admin-text-red">Access Denied</div>;

  return (
    <div className="admin-container">
      <h2 className="admin-header">All Discounts</h2>

      {showNotification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setShowNotification(false)}
        />
      )}

      {deleteConfirm.show && (
        <div className="admin-confirm-overlay">
          <div className="admin-confirm-box">
            <p>Are you sure you want to delete this discount?</p>
            <div className="admin-confirm-buttons">
              <button className="admin-button admin-button-cancel" onClick={cancelDelete}>
                Cancel
              </button>
              <button className="admin-button admin-button-delete" onClick={confirmDelete}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <h3 className="admin-subheader">Create a new Discount</h3>
      <form className="admin-form" onSubmit={handleCreate}>
        <label>
          Code*:
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Type*:
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
          >
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed Amount</option>
          </select>
        </label>

        <label>
          Value*:
          <input
            type="number"
            name="value"
            value={formData.value}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
          />
        </label>

        <label>
          Minimum Purchase:
          <input
            type="number"
            name="minPurchase"
            value={formData.minPurchase}
            onChange={handleChange}
            min="0"
            step="0.01"
          />
        </label>

        <label>
          Maximum Discount:
          <input
            type="number"
            name="maxDiscount"
            value={formData.maxDiscount}
            onChange={handleChange}
            min="0"
            step="0.01"
          />
        </label>

        <label>
          Applicable Items (comma separated):
          <input
            type="text"
            name="applicableItems"
            value={formData.applicableItems}
            onChange={handleChange}
            placeholder="item1, item2, item3"
          />
        </label>

        <label>
          Applicable SubCategories (comma separated):
          <input
            type="text"
            name="applicable_SubCategories"
            value={formData.applicable_SubCategories}
            onChange={handleChange}
            placeholder="subcategory1, subcategory2"
          />
        </label>

        <label>
          Applicable Categories (comma separated):
          <input
            type="text"
            name="applicableCategories"
            value={formData.applicableCategories}
            onChange={handleChange}
            placeholder="category1, category2"
          />
        </label>

        <label>
          Start Date*:
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          End Date*:
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Active:
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
          />
        </label>

        <label>
          Usage Limit:
          <input
            type="number"
            name="usageLimit"
            value={formData.usageLimit}
            onChange={handleChange}
            min="0"
          />
        </label>

        <button type="submit" className="admin-button">Create Discount</button>
      </form>

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
                  onClick={() => openDeleteConfirm(discount._id)}
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
