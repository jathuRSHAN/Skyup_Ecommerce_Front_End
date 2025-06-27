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
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [showSignup, setShowSignup] = useState(false); // toggle login/signup

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('/api/login', { email, password });
      const { token } = response.data;
      localStorage.setItem('token', token);
      setAuthToken(token);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('/api/signup', {
        name,
        email,
        password,
        phone,
        address,
        userType: 'Admin',
        preferredPaymentMethod: 'None'
      });
      const { token } = response.data;
      localStorage.setItem('token', token);
      setAuthToken(token);
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuthToken(null);
  };

  if (!authToken) {
    return (
      <div className="admin-login-container">
        <h2>{showSignup ? 'Admin Sign Up' : 'Admin Login'}</h2>
        <form onSubmit={showSignup ? handleSignup : handleLogin}>
          {showSignup && (
            <>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </>
          )}
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
          <button type="submit">{showSignup ? 'Sign Up' : 'Login'}</button>
        </form>
        <div className="toggle-container">
          <p>{showSignup ? 'Already have an account?' : "Don't have an account?"}</p>
          <button
            className="toggle-btn"
            onClick={() => setShowSignup(!showSignup)}
          >
            {showSignup ? 'Go to Login' : 'Sign up here'}
          </button>
        </div>
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
