import React, { useContext, useState } from 'react';
import './ProductDisplay.css';
import star_icon from '../Assets/star_icon.png';
import star_dull_icon from '../Assets/star_dull_icon.png';
import { ShopContext } from '../../Context/ShopContext';
import { useNavigate } from 'react-router-dom';

const ProductDisplay = (props) => {
  const { product } = props;
  const { addToCart } = useContext(ShopContext);
  const [showNotification, setShowNotification] = useState(false);
  const navigate = useNavigate();

  const handleAddToCart = () => {
    addToCart(product._id);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 2000);
  };

  const handleBuyNow = () => {
    navigate('/order-now', { state: { product } }); // Pass product via state
  };

  return (
    <div className='productdisplay'>
      {showNotification && (
        <div className="custom-notification">
          ✅ <strong>{product.name}</strong> added to cart!
        </div>
      )}
      <div className="productdisplay-left">
        <div className="productdisplay-img-list">
          <img src={product.image} alt="" />
          <img src={product.image} alt="" />
          <img src={product.image} alt="" />
          <img src={product.image} alt="" />
        </div>
        <div className="productdisplay-img">
          <img className='productdisplay-main-img' src={product.image} alt="" />
        </div>
      </div>
      <div className="productdisplay-right">
        <h1>{product.name}</h1>
        <div className="productdisplay-right-star">
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_dull_icon} alt="" />
          <p>(122)</p>
        </div>
        <div className="productdisplay-right-prices">
          <div className="productdisplay-right-price-old">LKR{product.old_price}</div>
          <div className="productdisplay-right-price-new">LKR{product.new_price}</div>
        </div>
        <div className="productdisplay-right-description">
          Premium quality tea and delicious snacks to brighten your day.
        </div>

        {/* Removed Select Size section */}

        <button onClick={handleAddToCart}>ADD TO CART</button>
        <button onClick={handleBuyNow} className="buy-now-button">BUY NOW</button>
        <p className='productdisplay-right-category'>
          <span>Category :</span> Tea, Snacks, Beverages
        </p>
        <p className='productdisplay-right-category'>
          <span>Tags :</span> Premium, Fresh, Popular
        </p>
      </div>
    </div>
  );
};

export default ProductDisplay;
