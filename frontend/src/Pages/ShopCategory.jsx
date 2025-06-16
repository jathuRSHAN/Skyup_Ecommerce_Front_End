import React, { useContext } from 'react';
import './CSS/ShopCategory.css';
import { ShopContext } from '../Context/ShopContext';
import dropdown_icon from '../Components/Assets/dropdown_icon.png';
import Item from '../Components/Item/Item';

const ShopCategory = (props) => {
  const { all_product } = useContext(ShopContext);

  const filteredProducts = all_product.filter(
    (item) =>
      item.category?.toLowerCase().trim() === props.category?.toLowerCase().trim()
  );

  return (
    <div className="shop-category">
      <img className="shopcategory-banner" src={props.banner} alt="Category Banner" />
      
      <div className="shopcategory-indexSort">
        <p>
          <span>Showing {filteredProducts.length}</span> out of {all_product.length} products
        </p>
        <div className="shopcategory-sort">
          Sort by <img src={dropdown_icon} alt="Sort Dropdown" />
        </div>
      </div>

      <div className="shopcategory-products">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((item, i) => (
            <Item
              key={item.id || i}
              id={item.id}
              image={item.image}
              name={item.name}
              new_price={item.new_price}
              old_price={item.old_price}
            />
          ))
        ) : (
          <p>No products found for this category.</p>
        )}
      </div>
    </div>
  );
};

export default ShopCategory;
