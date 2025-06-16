import React, { useState, useContext, useEffect } from 'react';
import './Navbar.css';
import logo from '../Assets/logo.jpg';
import cart_icon from '../Assets/cart-icon.png';
import { Link, useLocation } from 'react-router-dom';
import { ShopContext } from '../../Context/ShopContext';

const Navbar = () => {
  const location = useLocation(); // ✅ React Router hook to get current path
  const { getTotalCartItems, saveCartBeforeLogout } = useContext(ShopContext);
  const [menu, setMenu] = useState("");

  const isLoggedIn = !!localStorage.getItem('auth-token');

  useEffect(() => {
    // ✅ Set active menu based on current path
    const path = location.pathname.toLowerCase();
    if (path === "/") setMenu("shop");
    else if (path.includes("/greentea")) setMenu("greentea");
    else if (path.includes("/blacktea")) setMenu("blacktea");
    else if (path.includes("/snack")) setMenu("snack");
    else if (path.includes("/orders")) setMenu("my-orders");
    else setMenu(""); // fallback
  }, [location]);

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
        <p>CEYPLA</p>
      </div>

      <ul className="nav-menu">
        <li onClick={() => setMenu("shop")}>
          <Link style={{ textDecoration: 'none' }} to='/'>Shop</Link>
          {menu === "shop" ? <hr /> : null}
        </li>
        <li onClick={() => setMenu("greentea")}>
          <Link style={{ textDecoration: 'none' }} to='/greentea'>Greentea</Link>
          {menu === "greentea" ? <hr /> : null}
        </li>
        <li onClick={() => setMenu("blacktea")}>
          <Link style={{ textDecoration: 'none' }} to='/blacktea'>Blacktea</Link>
          {menu === "blacktea" ? <hr /> : null}
        </li>
        <li onClick={() => setMenu("snack")}>
          <Link style={{ textDecoration: 'none' }} to='/snack'>Snack</Link>
          {menu === "snack" ? <hr /> : null}
        </li>

        {isLoggedIn && (
          <li onClick={() => setMenu("my-orders")}>
            <Link style={{ textDecoration: 'none' }} to='/orders'>My Orders</Link>
            {menu === "my-orders" ? <hr /> : null}
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
          <img src={cart_icon} alt="cart" />
        </Link>
        <div className="nav-cart-count">{getTotalCartItems()}</div>
      </div>
    </div>
  );
};

export default Navbar;
