import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './CartItems.css';
import remove_icon from '../Assets/remove_icon.png';
import { ShopContext } from '../../Context/ShopContext';

const CartItems = () => {
  const { all_product, cartItems, removeFromCart, updateCartItem } = useContext(ShopContext);
  const navigate = useNavigate();

  const getTotalCartAmount = () => {
    return all_product.reduce((total, product) => {
      return total + (cartItems[product.id] || 0) * product.new_price;
    }, 0);
  };

  const totalAmount = getTotalCartAmount();

  return (
    <div className="cartitems">
      <div className="cartitems-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr />
      {all_product.map((e) => {
        if (cartItems[e.id] > 0) {
          return (
            <div key={e.id}>
              <div className="cartitems-format">
                <img src={e.image} alt="" className="carticon-product-icon" />
                <p>{e.name}</p>
                <p>LKR{e.new_price}</p>
                <input
                  type="number"
                  min="0"
                  className="cartitems-quantity-input"
                  value={cartItems[e.id]}
                  onChange={(event) => {
                    const value = parseInt(event.target.value) || 0;
                    updateCartItem(e.id, value);
                  }}
                />
                <p>LKR{(e.new_price * cartItems[e.id]).toFixed(2)}</p>
                <img
                  src={remove_icon}
                  onClick={() => removeFromCart(e.id)}
                  alt="Remove"
                  className="cartitems-remove-icon"
                />
              </div>
              <hr />
            </div>
          );
        }
        return null;
      })}

      <div className="cartitems-down">
        <div className="cartitems-total">
          <h1>Cart Totals</h1>
          <div>
            <div className="cartitems-total-item">
              <p>Subtotal</p>
              <p>LKR{totalAmount.toFixed(2)}</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <p>Shipping Fee</p>
              <p>Free</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <h3>Total</h3>
              <h3>LKR{totalAmount.toFixed(2)}</h3>
            </div>
          </div>
          <button className="proceed-button" onClick={() => navigate('/order/new')}>
            PROCEED TO CHECKOUT
          </button>
        </div>

        <div className="cartitems-promocode">
          <p>If you have a promocode, enter it below</p>
          <div className="cartitems-promobox">
            <input type="text" placeholder="promocode" />
            <button className="submit-button">Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItems;
