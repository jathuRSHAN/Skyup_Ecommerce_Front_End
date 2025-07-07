import React, { useContext, useState } from 'react';
import './ProductDisplay.css';
import star_icon from '../Assets/star_icon.png';
import star_dull_icon from '../Assets/star_dull_icon.png';
import { ShopContext } from '../../Context/ShopContext';
import { useNavigate } from 'react-router-dom';

const ProductDisplay = ({ product }) => {
  const { addToCart } = useContext(ShopContext);
  const [showNotification, setShowNotification] = useState(false);
  const [selectedImage, setSelectedImage] = useState(product.image?.[0] || '');
  const navigate = useNavigate();

  const handleAddToCart = () => {
    addToCart(product._id);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  const handleBuyNow = () => {
    navigate('/order-now', { state: { product } });
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
          {product.image?.slice(1).map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`thumb-${index}`}
              onClick={() => setSelectedImage(img)}
              style={{ cursor: 'pointer' }}
              className={selectedImage === img ? 'selected-thumb' : ''}
            />
          ))}
        </div>
        <div className="productdisplay-img">
          <img className='productdisplay-main-img' src={selectedImage || product.image?.[0]} alt="Main" />
        </div>
      </div>

      <div className="productdisplay-right">
        <h1>{product.name}</h1>
        <div className="productdisplay-right-model">
          {product.model}
        </div>
        {/* <div className="productdisplay-right-star">
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_dull_icon} alt="" />
          <p>(122)</p>
<<<<<<< HEAD
        </div> */}
        <div className="productdisplay-right-prices">
          <div className="productdisplay-right-price-old">Rs. {product.old_price}</div>
          <div className="productdisplay-right-price-new">Rs. {product.new_price}</div>
          <div className="Availability">Availability : {product.stock}</div>
=======
        </div>

        <div className="productdisplay-right-prices">
          <div className="productdisplay-right-price-old">LKR {product.old_price}</div>
          <div className="productdisplay-right-price-new">LKR {product.new_price}</div>
>>>>>>> Wasana
        </div>

        <div className="productdisplay-right-description">
          <h1>Description</h1>
          {product.description}
        </div>
<<<<<<< HEAD
        <div className="product-card1">
          <button onClick={handleAddToCart}>ADD TO CART</button>
          <button onClick={handleBuyNow} className="buy-now-button">BUY NOW</button>
        </div>

        {/* <p className='productdisplay-right-category'>
          <span>Category :</span>{' '}
          {Array.isArray(product.category)
            ? product.category.join(', ')
            : product.category || 'Uncategorized'}
        </p> */}
=======

        <div className="productdisplay-right-size">
          <h1>Select Size</h1>
          <div className="productdisplay-right-sizes">
            <div>32GB</div>
            <div>64GB</div>
            <div>128GB</div>
            <div>256GB</div>
            <div>1TB</div>
          </div>
        </div>

        <button onClick={handleAddToCart}>ADD TO CART</button>
        <button onClick={handleBuyNow} className="buy-now-button">BUY NOW</button>

        <p className='productdisplay-right-category'>
          <span>Category :</span> {Array.isArray(product.category) ? product.category.join(', ') : product.category || 'Uncategorized'}
        </p>
>>>>>>> Wasana

        {/* <p className='productdisplay-right-category'>
          <span>Tags :</span> Modern, Latest, Limited Edition
        </p> */}
      </div>
    </div>
  );
};

export default ProductDisplay;
