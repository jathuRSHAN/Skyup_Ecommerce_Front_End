import React, { useState, useContext } from 'react';
import './Navbar.css';
import logo from '../Assets/logo.png';
import cart_icon from '../Assets/cart-icon.png';
import { Link } from 'react-router-dom';
import { ShopContext } from '../../Context/ShopContext';

const Navbar = () => {
  const [menu, setMenu] = useState("shop");
  const { getTotalCartItems, saveCartBeforeLogout } = useContext(ShopContext);

  const isLoggedIn = !!localStorage.getItem('auth-token');

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
          </li>
        )}
        {isLoggedIn ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <Link to="/login"><button>sign up</button></Link>
        )}
        <Link to="/cart">
          <img src={cart_icon} alt="cart" />
        </Link>
        <div className="nav-cart-count">{getTotalCartItems()}</div>
      </div>
    </div>
  );
};

export default Navbar;
