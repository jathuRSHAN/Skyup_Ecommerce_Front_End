import React, { useEffect, useState } from 'react';
import './Footer.css';
import axios from 'axios';

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
        <img src={getImg('logo', 'logo.png')} alt="footer-logo" />
        <p>{data.brandText || 'EliteCell'}</p>
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
        <p>{data.copyright || 'Copyright @ 2025 - All rights reserved'}</p>
      </div>
    </div>
  );
};

export default Footer;
