import React, { useState, useContext } from 'react';
import './Navbar.css';

import logo from '../Assets/logo.png';
import cart_icon from '../Assets/cart-icon.png';
import { Link } from 'react-router-dom';
import { ShopContext } from '../../Context/ShopContext';

const Navbar = () => {
  const [menu, setMenu] = useState("shop");
  const { getTotalCartItems } = useContext(ShopContext);

  return (
    <div className="navbar">
      <div className="nav-logo">
        <img src={logo} alt="logo" />
        <p>EliteCell</p>
      </div>
      <ul className="nav-menu">
        <li onClick={() => setMenu("shop")}>
          <Link style={{ textDecoration: 'none' }} to='/'>Shop</Link>
          {menu === "shop" ? <hr /> : <></>}
        </li>
        <li onClick={() => setMenu("gaming")}>
          <Link style={{ textDecoration: 'none' }} to='/gaming'>Gaming</Link>
          {menu === "gaming" ? <hr /> : <></>}
        </li>
        <li onClick={() => setMenu("phablet")}>
          <Link style={{ textDecoration: 'none' }} to='/phablet'>Phablet</Link>
          {menu === "phablet" ? <hr /> : <></>}
        </li>
        <li onClick={() => setMenu("budget")}>
          <Link style={{ textDecoration: 'none' }} to='/budget'>Budget</Link>
          {menu === "budget" ? <hr /> : <></>}
        </li>
      </ul>
      <div className="nav-login-cart">
        <Link to="/login"><button>Login</button></Link>
        <Link to="/cart">
          <img src={cart_icon} alt="cart" />
        </Link>
        <div className="nav-cart-count">{getTotalCartItems()}</div>
      </div>
    </div>
  );
};

export default Navbar;
