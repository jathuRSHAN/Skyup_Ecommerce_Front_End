import React, { useEffect, useState } from 'react';
import './RelatedProducts.css';
import ProductDisplay from '../ProductDisplay/ProductDisplay';

const RelatedProducts = () => {
  const [newCollection, setNewCollection] = useState([]);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8070/items/newcollection')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch related products');
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setNewCollection(data.slice(0, 4)); // 👈 Only take first 4 items
        } else {
          throw new Error('Invalid data format');
        }
      })
      .catch((err) => {
        console.error('Error:', err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

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
      {error ? (
        <p className="error-message">Error: {error}</p>
      ) : loading ? (
        <p>Loading related products...</p>
      ) : (
        <div className="relatedproducts-item">
          {newCollection.map((item, index) => (
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
      )}
    </div>
  );
};

export default RelatedProducts;
