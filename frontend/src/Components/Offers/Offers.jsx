import React from 'react';
import './Offers.css';
import { Link } from 'react-router-dom'; 
import exclusive_image from '../Assets/exclusive_image.jpg';

const Offers = () => {
  return (
    <div className='offers'>
      <div className="offers-left">
        <h1>Unmissable</h1>
        <h1>Deals Just for You</h1>
        <p>Shop the Best Sellers Today!</p>

        {/* Link to /gaming */}
        <Link to="/gaming">
          <button>Shop Now</button>
        </Link>
      </div>

      <div className="offers-right">
        <img src={exclusive_image} alt="" />
      </div>
    </div>
  );
};

export default Offers;
