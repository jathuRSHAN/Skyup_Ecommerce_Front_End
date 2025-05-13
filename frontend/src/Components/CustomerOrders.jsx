import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CustomerOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      const userId = JSON.parse(localStorage.getItem('user'))._id;

      const res = await axios.get(`/orders/customer/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders(res.data);
    };

    fetchOrders();
  }, []);

  return (
    <div>
      <h2>Your Orders</h2>
      {orders.map(order => (
        <div key={order._id}>
          <h4>Order ID: {order._id}</h4>
          <p>Status: {order.status}</p>
          <p>Total: Rs. {order.lastAmount}</p>
        </div>
      ))}
    </div>
  );
};

export default CustomerOrders;
