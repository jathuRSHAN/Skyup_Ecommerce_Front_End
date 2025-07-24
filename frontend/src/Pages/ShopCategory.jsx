import React, { useContext, useState, useEffect } from 'react';
import './CSS/ShopCategory.css';
import { ShopContext } from '../Context/ShopContext';
import Item from '../Components/Item/Item';
import SearchBar from '../Components/SearchBar';

const ShopCategory = (props) => {
  const { all_product } = useContext(ShopContext);
  const [searchResults, setSearchResults] = useState([]);

  // Initial category filtering
  useEffect(() => {
    const categoryItems = all_product.filter(
      (item) => item.category === props.category
    );
    setSearchResults(categoryItems);
  }, [all_product, props.category]);

  // Search handler
  const handleSearch = (query) => {
    const filtered = all_product.filter(
      (item) =>
        item.category === props.category &&
        (item.name.toLowerCase().includes(query.toLowerCase()) ||
         item.category.toLowerCase().includes(query.toLowerCase()))
    );
    setSearchResults(filtered);
  };

  return (
    <div className="shop-category">
      <img className="shopcategory-banner" src={props.banner} alt="" />

      <div
        className="shopcategory-indexSort"
        style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}
      >
        <div style={{ width: '400px' }}>
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      <div className="shopcategory-products">
        {searchResults.length > 0 ? (
          searchResults.map((item, i) => (
            <Item
              key={i}
              id={item.id}
              image={item.image[0]}
              name={item.name}
              new_price={item.new_price}
              old_price={item.old_price}
            />
          ))
        ) : (
          <p style={{ textAlign: 'center', fontSize: '18px', marginTop: '30px' }}>
            ❌ No matching products found.
          </p>
        )}
      </div>
    </div>
  );
};

export default ShopCategory;
