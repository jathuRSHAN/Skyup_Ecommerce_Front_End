import React from 'react';
import './Navbar.css';
import navlogo from '../../assets/nav-logo.svg';
import navProfile from '../../assets/nav-profile.svg';

const Navbar = () => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload(); 
  };

  return (
    <div className="navbar">
      <img src={navlogo} alt="Logo" className="nav-logo" />
      <div className="navbar-right">
        <img src={navProfile} alt="Profile" className="nav-profile" />
        <button className="nav-logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
