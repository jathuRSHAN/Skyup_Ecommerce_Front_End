import React, { useEffect, useState } from 'react';
import Notification from '../Notification/Notification'; 

const TransferAdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showNotification, setShowNotification] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });

  const [confirmTransfer, setConfirmTransfer] = useState({ show: false, userId: null });

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

        const res = await fetch('/users', {
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
  }, [token]);

  const handleTransfer = async (userId) => {
    try {
      const res = await fetch(`/api/transfer-admin/${userId}`, {
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
        setTimeout(() => window.location.reload(), 2000);
      } else {
        setNotification({ message: data.error || 'Transfer failed', type: 'error' });
        setShowNotification(true);
      }
    } catch (error) {
      console.error('Error transferring admin rights:', error);
      setNotification({ message: 'Error transferring admin rights', type: 'error' });
      setShowNotification(true);
    } finally {
      setConfirmTransfer({ show: false, userId: null });
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="transfer-admin-panel" style={{ padding: '20px' }}>
      <h2>Transfer Admin Rights</h2>

      {showNotification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setShowNotification(false)}
        />
      )}

      {confirmTransfer.show && (
        <div className="admin-confirm-overlay">
          <div className="admin-confirm-box">
            <p>Are you sure you want to transfer admin rights? You will be demoted.</p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button
                onClick={() => setConfirmTransfer({ show: false, userId: null })}
                style={{ padding: '6px 12px' }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleTransfer(confirmTransfer.userId)}
                style={{ padding: '6px 12px', backgroundColor: 'red', color: '#fff' }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>User Type</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users
            .filter((u) => u._id !== currentUserId && u.userType !== 'Admin')
            .map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.userType}</td>
                <td>
                  <button onClick={() => setConfirmTransfer({ show: true, userId: user._id })}>
                    Transfer Admin
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
