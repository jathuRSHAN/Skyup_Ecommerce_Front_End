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
          <img src={data.cart_icon ? `http://localhost:8070${data.cart_icon}` : require('../Assets/cart-icon.png')} alt="cart" />
        </Link>
        <div className="nav-cart-count">{getTotalCartItems()}</div>
      </div>
    </div>
  );
};

export default Navbar;
