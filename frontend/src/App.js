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

import greentea_banner from './Components/Assets/banner_greentea.png';
import blacktea_banner from './Components/Assets/banner_blacktea.png';
import snack_banner from './Components/Assets/banner_snack.png';

import ShopContextProvider, { ShopContext } from './Context/ShopContext';



function AppRoutes() {
  const { userToken, customerId, cartItems } = useContext(ShopContext);

  return (
    <Routes>
      <Route path='/' element={<Shop />} />
      <Route path='/greentea' element={<ShopCategory banner={greentea_banner} category="Greentea" />} />
      <Route path='/blacktea' element={<ShopCategory banner={blacktea_banner} category="Blacktea" />} />
      <Route path='/snack' element={<ShopCategory banner={snack_banner} category="Snack" />} />
      <Route path='/product/:productId' element={<Product />} />
      <Route path='/cart' element={<Cart />} />
      <Route path='/login' element={<LoginSignup />} />

      {/* ✅ Order-related routes */}
      <Route path='/order/new' element={<OrderForm />} />
      <Route path='/orders' element={<CustomerOrders />} />
      <Route path='/admin/orders' element={<AdminOrders />} />
      <Route path='/order/:id' element={<OrderDetails />} />
      <Route path="/order-now" element={<OrderForm/>} />

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
