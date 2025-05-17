import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminOrders.css';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusOptions] = useState(["New", "Processing", "Done", "Cancelled"]);

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
      alert("Order cancelled.");
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: 'Cancelled', paymentStatus: 'Cancelled' } : o));
    } catch (err) {
      console.error("Error cancelling order:", err);
      alert("Failed to cancel order.");
    }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      await axios.put(`http://localhost:8070/orders/${orderId}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Status updated.");
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o));
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status.");
    }
  };

  if (!token) return <div style={{ color: 'red' }}>No auth token found</div>;
  if (loading) return <div>Loading orders...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div className="admin-orders-container">
      <h2>All Customer Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map(order => (
          <div key={order._id} className="order-card">
            <p><strong>Order ID:</strong> {order._id}</p>
            <p><strong>Customer:</strong> {order.customerId?.userId?.name || 'N/A'}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Payment:</strong> {order.paymentStatus}</p>
            <p><strong>Total:</strong> Rs. {order.lastAmount}</p>

            <select
              value={order.status}
              onChange={(e) => handleStatusChange(order._id, e.target.value)}
            >
              {statusOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>

            <button onClick={() => handleCancel(order._id)} disabled={order.status === "Cancelled"}>
              Cancel Order
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminOrders;