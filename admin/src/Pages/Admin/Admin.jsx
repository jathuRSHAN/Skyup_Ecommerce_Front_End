import React, { useState } from 'react';
import './Admin.css';
import Sidebar from '../../Components/Sidebar/Sidebar';
import { Routes, Route } from 'react-router-dom';
import AddProduct from '../../Components/AddProduct/AddProduct';
import ListProduct from '../../Components/ListProduct/ListProduct';
import AdminDiscountList from '../../Components/AdminDiscountList';
import AdminOrders from '../../Components/AdminOrders/AdminOrders';
import TransferAdminPanel from '../../Components/TransferAdminPanel/TransferAdminPanel';
import axios from 'axios';

const Admin = () => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('token'));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('/api/login', { email, password });
      const { token } = response.data;

      localStorage.setItem('token', token);
      setAuthToken(token);
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Login failed. Please try again.');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuthToken(null);
  };

  if (!authToken) {
    return (
      <div className="admin-login-container">
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="error-msg">{error}</p>}
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin">
      <Sidebar onLogout={handleLogout} />
      <Routes>
        <Route path="addproduct" element={<AddProduct />} />
        <Route path="listproduct" element={<ListProduct />} />
        <Route path="discounts" element={<AdminDiscountList token={authToken} />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="transfer-admin" element={<TransferAdminPanel />} />
      </Routes>
    </div>
  );
};

export default Admin;
