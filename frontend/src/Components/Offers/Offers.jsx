import React, { useEffect, useState } from 'react';
import './Offers.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Offers = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    axios.get('http://localhost:8070/content/Offers')
      .then(res => setData(res.data.data || {}))
      .catch(err => console.error("Offers content error:", err));
  }, []);

  return (
    <div className='offers'>
      <div className="offers-left">
        <h1>{data.heading1 || 'Unmissable'}</h1>
        <h1>{data.heading2 || 'Deals Just for You'}</h1>
        <p>{data.offerText || 'Shop the Best Sellers Today!'}</p>

        <Link to="/gaming">
          <button>{data.buttonText || 'Shop Now'}</button>
        </Link>
      </div>

      <div className="offers-right">
        <img
          src={data.offer_img ? `http://localhost:8070${data.offer_img}` : require('../Assets/exclusive_image.jpg')}
          alt="offer"
        />
      </div>
    </div>
  );
};

export default Offers;
