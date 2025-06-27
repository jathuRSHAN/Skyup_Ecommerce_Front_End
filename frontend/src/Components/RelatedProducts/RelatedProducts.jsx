import React, { useEffect, useState } from 'react';
import './RelatedProducts.css';
import ProductDisplay from '../ProductDisplay/ProductDisplay';
import axios from 'axios';

const RelatedProducts = ({ currentProduct }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const handleBackToList = () => {
    setSelectedProduct(null);
  };

  useEffect(() => {
    const fetchRelated = async () => {
      if (currentProduct?.category) {
        try {
          // Extract category (handle if it's an array)
          const category = Array.isArray(currentProduct.category)
            ? currentProduct.category[0]
            : currentProduct.category;

          // Log to verify what's being used
          console.log('Fetching related for category:', category);

          // Make GET request to backend
          const response = await axios.get(
            `http://localhost:8070/items/related/${category.toLowerCase()}`
          );

          // Filter out the current product
          const filtered = response.data.filter(
            (item) => item._id !== currentProduct._id
          );

          setRelatedProducts(filtered);
        } catch (error) {
          console.error('Error fetching related products:', error);
        }
      }
    };

    fetchRelated();
  }, [currentProduct]);

  if (selectedProduct) {
    return (
      <div className="relatedproducts">
        <button onClick={handleBackToList} className="back-button">
          ← Back to Related Products
        </button>
        <ProductDisplay product={selectedProduct} />
      </div>
    );
  }

  return (
    <div className="relatedproducts">
      <h1>Related Products</h1>
      <hr />
      <div className="relatedproducts-item">
        {relatedProducts.map((item) => (
          <div
            key={item._id}
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
