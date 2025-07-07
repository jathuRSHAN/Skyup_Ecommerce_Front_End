<<<<<<< HEAD
import React from 'react'
import './Footer.css'
import footer_logo from '../Assets/logo.png'
import instagram_icon from '../Assets/instagram_icon.png'
import facebook_icon from '../Assets/facebook_icon.png'
import twitter_icon from '../Assets/twitter_icon.png'
import whatsapp_icon from '../Assets/whatsapp_icon.png'

=======
import React, { useEffect, useState } from 'react';
import './Footer.css';
import axios from 'axios';
>>>>>>> Wasana

const Footer = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    axios.get('http://localhost:8070/content/Footer')
      .then(res => setData(res.data.data || {}))
      .catch(err => console.error("Footer load error:", err));
  }, []);

  const getImg = (key, fallback) =>
    data[key] ? `http://localhost:8070${data[key]}` : require(`../Assets/${fallback}`);

  return (
    <div className='footer'>
      <div className="footer-logo">
<<<<<<< HEAD
        <img src={footer_logo} alt="" />
        <p>SL Flash Mart</p>
      </div>
      <u1 className="footer-links">
        <li>Home</li>
        <li>Offices</li>
        <li>About</li>
        <li>Products</li>
        <li>Contact</li>
      </u1>
      <div className="footer-social-icons">
        <div className="footer-icons-container">
          <img src={whatsapp_icon} alt="" />
        </div>
        <div className="footer-icons-container">
          <img src={instagram_icon} alt="" />
        </div>
        <div className="footer-icons-container">
          <img src={facebook_icon} alt="" />
        </div>
        <div className="footer-icons-container">
          <img src={twitter_icon} alt="" />
        </div>


=======
        <img src={getImg('logo', 'logo.png')} alt="footer-logo" />
        <p>{data.brandText || 'EliteCell'}</p>
>>>>>>> Wasana
      </div>

      <ul className="footer-links">
        <li>Home</li><li>Offices</li><li>About</li><li>Products</li><li>Contact</li>
      </ul>

      <div className="footer-social-icons">
        {["whatsapp_icon", "instagram_icon", "facebook_icon", "twitter_icon"].map(key => (
          <div className="footer-icons-container" key={key}>
            <img src={getImg(key, `${key}.png`)} alt={key} />
          </div>
        ))}
      </div>

      <div className="footer-copyright">
        <hr />
<<<<<<< HEAD
        <p> Copyright @ 2025- All right Reserverd</p>
=======
        <p>{data.copyright || 'Copyright @ 2025 - All rights reserved'}</p>
>>>>>>> Wasana
      </div>
    </div>
  );
};

export default Footer;
