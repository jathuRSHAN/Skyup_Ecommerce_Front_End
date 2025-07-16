import React, { useEffect, useState } from 'react';
import './RelatedProducts.css';
import ProductDisplay from '../ProductDisplay/ProductDisplay';
import axios from 'axios';

const RelatedProducts = ({ currentProduct }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Fetch related products when selectedProduct changes
  useEffect(() => {
    const fetchRelated = async () => {
      const productToFetch = selectedProduct || currentProduct;

      if (productToFetch?.category) {
        try {
          const category = Array.isArray(productToFetch.category)
            ? productToFetch.category[0]
            : productToFetch.category;

          const response = await axios.get(
            `http://localhost:8070/items/related/${category.toLowerCase()}`
          );

          const filtered = response.data.filter(
            (item) => item._id !== productToFetch._id
          );

          setRelatedProducts(filtered);
        } catch (error) {
          console.error('Error fetching related products:', error);
        }
      }
    };

    fetchRelated();
  }, [selectedProduct, currentProduct]);

  const handleBackToList = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="relatedproducts">
      {selectedProduct ? (
        <>
          <button onClick={handleBackToList} className="back-button">
            ← Back to Related Products
          </button>
          <ProductDisplay key={selectedProduct._id} product={selectedProduct} />
          <h2 style={{ marginTop: '20px' }}>More Related Products</h2>
          <hr />
        </>
      ) : (
        <>
          <h1>Related Products</h1>
          <hr />
        </>
      )}

      <div className="relatedproducts-item">
        {relatedProducts.map((item) => (
          <div
            key={item._id}
            className="product-card"
            onClick={() => setSelectedProduct(item)}
            style={{ cursor: 'pointer' }}
          >
            <img
              key={item._id + item.image?.[0]}
              src={item.image?.[0]}
              alt={item.name}
              className="product-image"
            />
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
