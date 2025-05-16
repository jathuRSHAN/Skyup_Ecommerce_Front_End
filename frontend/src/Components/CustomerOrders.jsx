import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CustomerOrders.css';

const CustomerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('auth-token');
        if (!token) {
          setError('You must be logged in to view your orders.');
          setLoading(false);
          return;
        }

        const res = await axios.get('http://localhost:8070/orders/my-orders', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setOrders(res.data);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setError('You must be logged in to view your orders.');
        } else {
          setError('Failed to load orders.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p className="loading">Loading orders...</p>;
  if (error) return <p className="error">{error}</p>;
  if (orders.length === 0) return <p className="no-orders">You have no orders.</p>;

  return (
    <div className="orders-container">
      <h2>Your Orders</h2>
      {orders.map(order => (
        <div className="order-card" key={order._id}>
          <h4>🧾 Order ID: {order._id}</h4>
          <p>Status: <strong>{order.status}</strong></p>
          <p>Total: Rs. <strong>{order.lastAmount}</strong></p>
          <p>Payment: {order.paymentStatus}</p>
          <p>Ordered On: {new Date(order.createdAt).toLocaleString()}</p>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default CustomerOrders;
