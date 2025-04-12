import React from 'react';
import './NewCollections.css';
import new_collection from '../Assets/new_collection';

const NewCollections = () => {
  return (
    <div className="new-collections">
      <h1>JUST ARRIVED</h1>
      <hr />
      <div className="collections">
        {new_collection.map((item, i) => {
          return (
            <div className="product-card" key={i}>
              <img src={item.image} alt={item.name} />
              <h3>{item.name}</h3>
              <div className="price-container">
                <span className="new-price">${item.new_price}</span>
                <span className="old-price">${item.old_price}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NewCollections;