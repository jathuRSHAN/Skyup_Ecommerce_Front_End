import React, { useState, useEffect } from 'react';
import './ListProduct.css';
import cross_icon from '../../assets/cross_icon.png';

const ListProduct = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token not found. Please log in.');

      const res = await fetch('http://localhost:8070/items', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Status ${res.status}`);
      }

      const data = await res.json();
      setAllProducts(data);
      setError(null);
    } catch (error) {
      console.error('Fetch error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  const removeProduct = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return alert('Token not found. Please log in.');

      const res = await fetch(`http://localhost:8070/items/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await res.json();

      if (res.ok) {
        alert('Product removed');
        fetchInfo(); // Refresh list
      } else {
        alert(result.error || 'Failed to remove product');
      }
    } catch (error) {
      alert('Something went wrong');
      console.error('Delete error:', error);
    }
  };

  return (
    <div className="list-product">
      <h1>All Product List</h1>
      {loading ? (
        <p>Loading products...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>Error: {error}</p>
      ) : allProducts.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="listproduct-container">
          <div className="listproduct-format-main">
            <p>Image</p>
            <p>Name</p>
            <p>New Price</p>
            <p>Old Price</p>
            <p>Category</p>
            <p>Stock</p>
            <p>Remove</p>
          </div>
          {allProducts.map(product => (
            <div key={product._id} className="listproduct-format">
              <img src={product.image} alt="product" className="listproduct-product-icon" />
              <p>{product.name}</p>
              <p>LKR{product.new_price}</p>
              <p>LKR{product.old_price}</p>
              <p>{product.category || 'N/A'}</p>
              <p>{product.stock ?? 'N/A'}</p>
              <img
                src={cross_icon}
                alt="remove"
                onClick={() => removeProduct(product._id)}
                className="listproduct-remove-icon"
                style={{ cursor: 'pointer' }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListProduct;
