import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Notification from '../Notification/Notification';
import './AdminOrders.css';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusOptions] = useState(["New", "Processing", "Done", "Cancelled"]);
  const [notification, setNotification] = useState({ message: '', type: '' });

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        const res = await axios.get('http://localhost:8070/orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(res.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError('Failed to load orders. Check console.');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchAllOrders();
    } else {
      setError("No auth token found");
      setLoading(false);
    }
  }, [token]);

  const handleCancel = async (orderId) => {
    try {
      await axios.put(`http://localhost:8070/orders/cancel/${orderId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotification({ message: 'Order cancelled.', type: 'success' });
      setOrders(prev => prev.map(order =>
        order._id === orderId ? { ...order, status: 'Cancelled', paymentStatus: 'Cancelled' } : order
      ));
    } catch (err) {
      console.error("Error cancelling order:", err);
      setNotification({ message: 'Failed to cancel order.', type: 'error' });
    }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      await axios.put(`http://localhost:8070/orders/${orderId}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotification({ message: 'Status updated.', type: 'success' });
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o));
    } catch (err) {
      console.error("Error updating status:", err);
      setNotification({ message: 'Failed to update status.', type: 'error' });
    }
  };

  const closeNotification = () => {
    setNotification({ message: '', type: '' });
  };

  const formatAddress = (shippingAddress) => {
    if (!shippingAddress) return 'N/A';
    const { street, city, state, postalCode } = shippingAddress;
    return `${street}, ${city}, ${state} ${postalCode}`;
  };

  if (!token) return <div style={{ color: 'red' }}>No auth token found</div>;
  if (loading) return <div>Loading orders...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div className="admin-orders-container">
      <h2>All Customer Orders</h2>

      <Notification
        message={notification.message}
        type={notification.type}
        onClose={closeNotification}
      />

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="table-wrapper">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer Name</th>
                <th>Address</th>
                <th>Items</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Total</th>
                <th>Change Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.customerId?.userId?.name || 'N/A'}</td>
                  <td>{formatAddress(order.shippingAddress)}</td>

                  <td>
                    {order.order_items && order.order_items.length > 0 ? (
                      <table className="nested-items-table">
                        <thead>
                          <tr>
                            <th style={{ textAlign: 'left' }}>Product</th>
                            <th>Qty</th>
                            <th>Rs.</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.order_items.map((item, index) => (
                            <tr key={index}>
                              <td>{item.name || 'Unnamed Item'}</td>
                              <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                              <td style={{ textAlign: 'right' }}>{item.unitPrice}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      'No items'
                    )}
                  </td>

                  <td>{order.status}</td>
                  <td>{order.paymentStatus}</td>
                  <td>Rs. {order.lastAmount}</td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    >
                      {statusOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button
                      onClick={() => handleCancel(order._id)}
                      disabled={order.status === "Cancelled"}
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
