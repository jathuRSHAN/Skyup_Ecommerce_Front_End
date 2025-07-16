import React, { useState, useContext, useEffect } from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';
import { ShopContext } from '../../Context/ShopContext';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; 

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Navbar = () => {
  const [menu, setMenu] = useState("shop");
  const { getTotalCartItems, saveCartBeforeLogout } = useContext(ShopContext);
  const [data, setData] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('auth-token'));

  // Fetch Navbar content
  useEffect(() => {
    axios.get(`${API_BASE_URL}/content/Navbar`)
      .then(res => setData(res.data.data || {}))
      .catch(err => console.error("Navbar content load error:", err));
  }, []);

  // JWT Expiry Checker
  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token); 
        const expiry = decodedToken.exp * 1000;
        const now = Date.now();

        if (expiry > now) {
          setIsLoggedIn(true);
          const timeout = expiry - now;

          const timer = setTimeout(() => {
            localStorage.removeItem('auth-token');
            setIsLoggedIn(false);
          }, timeout);

          return () => clearTimeout(timer);
        } else {
          localStorage.removeItem('auth-token');
          setIsLoggedIn(false);
        }
      } catch (err) {
        console.error("Token decode error:", err);
        localStorage.removeItem('auth-token');
        setIsLoggedIn(false);
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      await saveCartBeforeLogout();
    } catch (error) {
      console.error("Error saving cart before logout:", error);
    } finally {
      localStorage.removeItem('auth-token');
      setIsLoggedIn(false);
      window.location.replace('/');
    }
  };

  return (
    <div className="navbar">
      <div className="nav-logo">
        <img src={data.logo ? `${API_BASE_URL}${data.logo}` : require('../Assets/logo.png')} alt="logo" />
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
          </li>
        )}
      </ul>

      <div className="nav-login-cart">
        {isLoggedIn ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <Link to="/login"><button>Login</button></Link>
        )}
        <Link to="/cart">
          <img src={data.cart_icon ? `${API_BASE_URL}${data.cart_icon}` : require('../Assets/cart-icon.png')} alt="cart" />
        </Link>
        <div className="nav-cart-count">{getTotalCartItems()}</div>
      </div>
    </div>
  );
};

export default Navbar;