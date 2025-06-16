import React from 'react';
import './DescriptionBox.css';

const DescriptionBox = () => {
  return (
    <div className='descriptionbox'>
      <div className="descriptionbox-navigator">
        <div className="descriptionbox-nav-box">Description</div>
        <div className="descriptionbox-nav-box fade">Reviews(122)</div>
      </div>
      <div className="descriptionbox-description">
        <p>
          Premium quality teas and delicious snacks crafted to brighten your day. 
          Whether you're relaxing at home or hosting guests, our selections bring comfort and delight in every sip and bite.
        </p>
        <p>
          Explore our wide range of flavors and treats, perfect for any occasion. Fresh, flavorful, and thoughtfully sourced.
        </p>
      </div>
    </div>
  );
};

export default DescriptionBox;
