import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useContext } from 'react';

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

import gaming_banner from './Components/Assets/banner_gaming.png';
import phablet_banner from './Components/Assets/banner_phablet.png';
import budget_banner from './Components/Assets/banner_budget.png';

import ShopContextProvider, { ShopContext } from './Context/ShopContext';

function AppRoutes() {
  const { userToken, customerId, cartItems } = useContext(ShopContext);

  return (
    <Routes>
      <Route path='/' element={<Shop />} />
      <Route path='/gaming' element={<ShopCategory banner={gaming_banner} category="gaming" />} />
      <Route path='/phablet' element={<ShopCategory banner={phablet_banner} category="phablet" />} />
      <Route path='/budget' element={<ShopCategory banner={budget_banner} category="budget" />} />
      <Route path='/product/:productId' element={<Product />} />
      <Route path='/cart' element={<Cart />} />
      <Route path='/login' element={<LoginSignup />} />

      {/* ✅ Order-related routes */}
      <Route path='/order/new' element={<OrderForm />} />
      <Route path='/orders' element={<CustomerOrders />} />
      <Route path='/admin/orders' element={<AdminOrders />} />
      <Route path='/order/:id' element={<OrderDetails />} />

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
