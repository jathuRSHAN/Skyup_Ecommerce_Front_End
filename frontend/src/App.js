import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from './Components/Navbar/Navbar';
import Footer from './Components/Footer/Footer';

import Shop from './Pages/Shop';
import ShopCategory from './Pages/ShopCategory';
import LoginSignup from './Pages/LoginSignup';
import Product from './Pages/Product';
import Cart from './Pages/Cart';

import gaming_banner from './Components/Assets/banner_gaming.png';
import phablet_banner from './Components/Assets/banner_phablet.png';
import budget_banner from './Components/Assets/banner_budget.png';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element={<Shop />} />
          <Route path='/gaming' element={<ShopCategory banner={gaming_banner} category="gaming" />} />
          <Route path='/phablet' element={<ShopCategory banner={phablet_banner} category="phablet" />} />
          <Route path='/budget' element={<ShopCategory banner={budget_banner} category="budget" />} />
          <Route path='/product/:productId' element={<Product />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/login' element={<LoginSignup />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
