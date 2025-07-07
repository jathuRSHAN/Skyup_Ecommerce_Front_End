import React, { useState, useContext, useEffect } from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';
import { ShopContext } from '../../Context/ShopContext';
import axios from 'axios';

const Navbar = () => {
  const [menu, setMenu] = useState("shop");
  const { getTotalCartItems, saveCartBeforeLogout } = useContext(ShopContext);
  const [data, setData] = useState({});
  const isLoggedIn = !!localStorage.getItem('auth-token');

  useEffect(() => {
    axios.get('http://localhost:8070/content/Navbar')
      .then(res => setData(res.data.data || {}))
      .catch(err => console.error("Navbar content load error:", err));
  }, []);

  const handleLogout = async () => {
    try {
      await saveCartBeforeLogout();
    } catch (error) {
      console.error("Error saving cart before logout:", error);
    } finally {
      localStorage.removeItem('auth-token');
      window.location.replace('/');
    }
  };

  return (
    <div className="navbar">
      <div className="nav-logo">
<<<<<<< HEAD
        <img src={logo} alt="logo" />
        <p>SL <span><span>Flash</span> Mart</span></p>
      </div>

      <ul className="nav-menu">
        <li onClick={() => setMenu("shop")}>
          <Link style={{ textDecoration: 'none' }} to='/'><h4>Shop</h4></Link>
          {menu === "shop" ? <hr /> : null}
        </li>
        <li onClick={() => setMenu("gaming")}>
          <Link style={{ textDecoration: 'none' }} to='/gaming'><h4>Gaming</h4></Link>
          {menu === "gaming" ? <hr /> : null}
        </li>
        <li onClick={() => setMenu("phablet")}>
          <Link style={{ textDecoration: 'none' }} to='/phablet'><h4>Phablet</h4></Link>
          {menu === "phablet" ? <hr /> : null}
        </li>
        <li onClick={() => setMenu("budget")}>
          <Link style={{ textDecoration: 'none' }} to='/budget'><h4>Budget</h4></Link>
          {menu === "budget" ? <hr /> : null}
        </li>


      </ul>


      <div className="nav-login-cart">
        {isLoggedIn && (
          <li onClick={() => setMenu("my-orders")}>
            <Link style={{ textDecoration: 'none' }} to='/orders'><h4>My Orders</h4></Link>
            {menu === "my-orders" ? <hr /> : null}
=======
        <img src={data.logo ? `http://localhost:8070${data.logo}` : require('../Assets/logo.png')} alt="logo" />
        <p>{data.brandText || 'EliteCell'}</p>
      </div>

      <ul className="nav-menu">
        {["shop", "gaming", "phablet", "budget"].map(tab => (
          <li key={tab} onClick={() => setMenu(tab)}>
            <Link to={`/${tab === 'shop' ? '' : tab}`} style={{ textDecoration: 'none' }}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Link>
            {menu === tab ? <hr /> : null}
          </li>
        ))}
        {isLoggedIn && (
          <li onClick={() => setMenu("my-orders")}>
            <Link to='/orders' style={{ textDecoration: 'none' }}>My Orders</Link>
            {menu === "my-orders" && <hr />}
>>>>>>> Wasana
          </li>
        )}
        {isLoggedIn ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <Link to="/login"><button>sign up</button></Link>
        )}
        <Link to="/cart">
          <img src={data.cart_icon ? `http://localhost:8070${data.cart_icon}` : require('../Assets/cart-icon.png')} alt="cart" />
        </Link>
        <div className="nav-cart-count">{getTotalCartItems()}</div>
      </div>
    </div>
  );
};

export default Navbar;
