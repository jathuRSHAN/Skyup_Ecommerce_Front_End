import React, { useState } from 'react';
import './RelatedProducts.css';
import data_product from '../Assets/data';
import ProductDisplay from '../ProductDisplay/ProductDisplay';

const RelatedProducts = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleBackToList = () => {
    setSelectedProduct(null);
  };

  if (selectedProduct) {
    return (
      <div className="relatedproducts">
        <button onClick={handleBackToList} className="back-button">← Back to Related Products</button>
        <ProductDisplay product={selectedProduct} />
      </div>
    );
  }

  return (
    <div className="relatedproducts">
      <h1>Related Products</h1>
      <hr />
      <div className="relatedproducts-item">
        {data_product.map((item, index) => (
          <div
            key={index}
            className="product-card"
            onClick={() => setSelectedProduct(item)}
            style={{ cursor: 'pointer' }}
          >
            <img src={item.image} alt={item.name} />
            <h3>{item.name}</h3>
            <div className="price-container">
              <span className="new-price">LKR{item.new_price}</span>
              <span className="old-price">LKR{item.old_price}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
