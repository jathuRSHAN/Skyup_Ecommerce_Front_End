import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';

import Navbar from './Components/Navbar/Navbar';
import Footer from './Components/Footer/Footer';

import Shop from './Pages/Shop';
import ShopCategory from './Pages/ShopCategory';
import LoginSignup from './Pages/LoginSignup';
import Product from './Pages/Product';
import Cart from './Pages/Cart';

import OrderForm from './Components/OrderForm';
import CustomerOrders from './Components/CustomerOrders';
import AdminOrders from './Components/AdminOrders';
import OrderDetails from './Components/OrderDetails';
import Success from './Components/Success';
import Cancel from './Components/Cancel';

import ShopContextProvider, { ShopContext } from './Context/ShopContext';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function AppRoutes() {
  const { userToken, customerId, cartItems } = useContext(ShopContext);
  const [categoryBanners, setCategoryBanners] = useState({
    gaming_banner: '',
    phablet_banner: '',
    budget_banner: ''
  });

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/content/Categories`)
      .then((res) => {
        setCategoryBanners(res.data.data || {});
      })
      .catch((err) => {
        console.error('Failed to load category banners. Using default:', err);
      });
  }, []);

  return (
    <Routes>
      <Route path='/' element={<Shop />} />
      <Route
        path='/gaming'
        element={
          <ShopCategory
            banner={`${API_BASE_URL}${categoryBanners.gaming_banner || '/uploads/default_gaming.png'}`}
            category="gaming"
          />
        }
      />
      <Route
        path='/phablet'
        element={
          <ShopCategory
            banner={`${API_BASE_URL}${categoryBanners.phablet_banner || '/uploads/default_phablet.png'}`}
            category="phablet"
          />
        }
      />
      <Route
        path='/budget'
        element={
          <ShopCategory
            banner={`${API_BASE_URL}${categoryBanners.budget_banner || '/uploads/default_budget.png'}`}
            category="budget"
          />
        }
      />
      <Route path='/product/:productId' element={<Product />} />
      <Route path='/cart' element={<Cart />} />
      <Route path='/login' element={<LoginSignup />} />

      {/* ✅ Order-related routes */}
      <Route path='/order/new' element={<OrderForm />} />
      <Route path='/orders' element={<CustomerOrders />} />
      <Route path='/admin/orders' element={<AdminOrders />} />
      <Route path='/order/:id' element={<OrderDetails />} />
      <Route path="/order-now" element={<OrderForm />} />

      {/* ✅ Payment outcomes */}
      <Route path='/payments/success' element={<Success />} />
      <Route path='/payments/cancel' element={<Cancel />} />
    </Routes>
  );
}

function App() {
  return (
    <ShopContextProvider>
      <Router>
        <Navbar />
        <AppRoutes />
        <Footer />
      </Router>
    </ShopContextProvider>
  );
}

export default App;