import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Hero from '../Components/Hero/Hero';
import Offers from '../Components/Offers/Offers';
import NewCollections from '../Components/NewCollections/NewCollections';
import NewsLetter from '../Components/NewsLetter/NewsLetter';
import SearchBar from '../Components/SearchBar';
import ProductGrid from '../Components/ProductGrid';

const Shop = () => {
  const [items, setItems] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false); 

  const handleSearch = (query) => {
    if (!query) return;

    setSearchPerformed(true); 

    const BASE_URL = process.env.REACT_APP_API_BASE_URL;
    console.log('API Base URL:', BASE_URL);

    axios.get(`${BASE_URL}/items/search?query=${query}`)
      .then(res => setItems(res.data))
      .catch(err => {
        console.error('Search error:', err);
        setItems([]); 
      });
  };

  return (
    <div>
      <SearchBar onSearch={handleSearch} />

      {searchPerformed && (
        <div style={{ padding: '20px' }}>
          <h2>Search Results</h2>
          {items.length > 0 ? (
            <ProductGrid items={items} />
          ) : (
            <p style={{ textAlign: 'center', fontSize: '18px', marginTop: '20px' }}>
              ❌ No matching products found.
            </p>
          )}
        </div>
      )}

      <Hero />
      <Offers />
      <NewCollections />
      <NewsLetter />
    </div>
  );
};

export default Shop;
