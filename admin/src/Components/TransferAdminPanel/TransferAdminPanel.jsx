import React, { useEffect, useState } from 'react';
import Notification from '../Notification/Notification';

const TransferAdminPanel = () => {
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const [users, setUsers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUsers = async () => {
      if (!token) {
        setError('No token found. Please log in.');
        setLoading(false);
        return;
      }

      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUserId(payload.id);

        const res = await fetch(`${BASE_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const contentType = res.headers.get('content-type');
        if (!res.ok || !contentType?.includes('application/json')) {
          const text = await res.text();
          throw new Error(`Unexpected response: ${text}`);
        }

        const data = await res.json();
        setUsers(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token, BASE_URL]);

  const handlePromoteToAdmin = async (userId) => {
    try {
      const res = await fetch(`${BASE_URL}/api/transfer-admin/${userId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();
      if (res.ok) {
        setNotification({ message: data.message, type: 'success' });
        setShowNotification(true);
        setTimeout(() => {
          setShowNotification(false);
          setTimeout(() => window.location.reload(), 500);
        }, 2500);
      } else {
        setNotification({ message: data.error || 'Transfer failed', type: 'error' });
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 2500);
      }
    } catch (error) {
      console.error('Error transferring admin rights:', error);
      setNotification({ message: 'Error transferring admin rights', type: 'error' });
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 2500);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  const adminUsers = users.filter((u) => u.userType === 'Admin');
  const customerUsers = users.filter((u) => u.userType !== 'Admin');

  return (
    <div className="transfer-admin-panel" style={{ padding: '20px' }}>
      <h2>Manage User Roles</h2>

      {showNotification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setShowNotification(false)}
        />
      )}

      <h3>Admin Users</h3>
      <table border="1" cellPadding="8" style={{ width: '100%', marginBottom: '30px' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Current Role</th>
          </tr>
        </thead>
        <tbody>
          {adminUsers.map((user) => (
            <tr
              key={user._id}
              style={{
                backgroundColor: user._id === currentUserId ? '#e7f3ff' : 'transparent',
                fontWeight: user._id === currentUserId ? 'bold' : 'normal',
              }}
            >
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.userType}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Customer Users</h3>
      <table border="1" cellPadding="8" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Current Role</th>
            <th>Promote</th>
          </tr>
        </thead>
        <tbody>
          {customerUsers.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.userType}</td>
              <td>
                <button
                  onClick={() => handlePromoteToAdmin(user._id)}
                  disabled={user.userType === 'Admin'}
                >
                  Make Admin
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransferAdminPanel;
