import React, { useEffect, useState } from 'react';
import './NewCollections.css';
import ProductDisplay from '../ProductDisplay/ProductDisplay';
import RelatedProducts from '../RelatedProducts/RelatedProducts';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const NewCollections = () => {
  const [newCollection, setNewCollection] = useState([]);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/items/newcollection`);
        if (!response.ok) {
          const text = await response.text();
          throw new Error(`HTTP error ${response.status}: ${text}`);
        }
        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error('Fetched data is not an array');
        }
        setNewCollection(data);
      } catch (err) {
        console.error('❌ Error:', err.message);
        setError(err.message);
      }
    };
    fetchData();
  }, [API_BASE_URL]);

  const handleBackToList = () => {
    setSelectedProduct(null);
  };

  if (selectedProduct) {
    return (
      <div className="new-collections">
        <button onClick={handleBackToList} className="back-button">← Back to Products</button>
        <ProductDisplay product={selectedProduct} />
        <RelatedProducts currentProduct={selectedProduct} />
      </div>
    );
  }

  return (
    <div className="new-collections">
      <h1>JUST ARRIVED</h1>
      <hr />
      {error ? (
        <p className="error-message">Error: {error}</p>
      ) : (
        <div className="collections">
          {newCollection.map((item, index) => (
            <div
              className="product-card"
              key={index}
              onClick={() => setSelectedProduct(item)}
              style={{ cursor: 'pointer' }}
            >
              <img src={item.image[0]} alt={item.name} />
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

export default NewCollections;
