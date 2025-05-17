import React, { useEffect, useState } from 'react';
import './NewCollections.css';

const NewCollections = () => {
  const [newCollection, setNewCollection] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8070/items/newcollection')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch new collection');
        }
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setNewCollection(data);
        } else {
          throw new Error('Fetched data is not an array');
        }
      })
      .catch((err) => {
        console.error('Error fetching new collection:', err);
        setError(err.message);
      });
  }, []);

  return (
    <div className="new-collections">
      <h1>JUST ARRIVED</h1>
      <hr />
      {error ? (
        <p className="error-message">Error: {error}</p>
      ) : (
        <div className="collections">
          {newCollection.map((item, index) => (
            <div className="product-card" key={index}>
              <img src={item.image} alt={item.name} />
              <h3>{item.name}</h3>
              <div className="price-container">
                <span className="new-price">${item.new_price}</span>
                <span className="old-price">${item.old_price}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewCollections;
