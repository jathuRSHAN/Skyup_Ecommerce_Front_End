import React from 'react';
import './Hero.css';
import { Link } from 'react-router-dom';
import newyear_icon from '../Assets/newyear_icon.png';
import arrow_icon from '../Assets/arrow_icon.png';
import hero_img from '../Assets/hero_img.jpg';

const Hero = () => {
  return (
    <div className='hero'>
      <div className='hero-left'>
        <h2>NEW ARRIVALS ONLY</h2>
        <div>
          <div className='hero-newyear-icon'>
            <p>THIS</p>
            <img src={newyear_icon} alt="" />
          </div>
          <p>NEW YEAR</p>
          <p>UPTO 50% OFF</p>
        </div>

        {/* Link to the Shop page */}
        <Link to="/greentea" className="hero-latest-btn">
          <div>Explore Now</div>
          <img src={arrow_icon} alt="" />
        </Link>
      </div>

      <div className='hero-right'>
        <img src={hero_img} alt="" />
      </div>
    </div>
  );
};

export default Hero;
