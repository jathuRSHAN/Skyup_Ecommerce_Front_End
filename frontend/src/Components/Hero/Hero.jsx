import React, { useEffect, useState } from 'react';
import './Hero.css';
import { Link } from 'react-router-dom';
import arrow_icon from '../Assets/arrow_icon.png';
import axios from 'axios';

const Hero = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    axios.get('http://localhost:8070/content/Hero')
      .then(res => setData(res.data.data || {}))
      .catch(err => {
        console.error('Error loading Hero content:', err);
        setData({});
      });
  }, []);

  return (
    <div className='hero'>
      <div className='hero-left'>
        <h2>{data.headline || 'NEW ARRIVALS ONLY'}</h2>

        <div>
          <div className='hero-newyear-icon'>
            <p>{data.subtext || 'THIS'}</p>
            <img
              src={
                data.subtext_img
                  ? `http://localhost:8070${data.subtext_img}`
                  : require('../Assets/newyear_icon.png')
              }
              alt="New Year Icon"
            />
          </div>

          <p>{data.line2 || 'NEW YEAR'}</p>
          <p>{data.line3 || 'UPTO 50% OFF'}</p>
        </div>

        <Link to="/gaming" className="hero-latest-btn">
          <div>{data.buttonText || 'Explore Now'}</div>
          <img src={arrow_icon} alt="Arrow Icon" />
        </Link>
      </div>

      <div className='hero-right'>
        <img
          src={
            data.hero_img
              ? `http://localhost:8070${data.hero_img}`
              : require('../Assets/hero_img.jpg')
          }
          alt="Hero"
        />
      </div>
    </div>
  );
};

export default Hero;
