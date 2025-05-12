import React, { useEffect, useState } from 'react';
import './Admin.css';
import Sidebar from '../../Components/Sidebar/Sidebar';
import { Routes, Route } from 'react-router-dom';
import AddProduct from '../../Components/AddProduct/AddProduct';
import ListProduct from '../../Components/ListProduct/ListProduct';
import AdminDiscountList from '../../Components/AdminDiscountList';
import AdminOrders from '../../Components/AdminOrders/AdminOrders';

const Admin = () => {
  const [authToken, setAuthToken] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setAuthToken(token);
  }, []);

  return (
    <div className='admin'>
      <Sidebar />
      <Routes>
        <Route path="addproduct" element={<AddProduct />} />
        <Route path="listproduct" element={<ListProduct />} />
        <Route path="discounts" element={<AdminDiscountList token={authToken} />} />
        <Route path="orders" element={<AdminOrders />} />
      </Routes>
    </div>
  );
};

export default Admin;
