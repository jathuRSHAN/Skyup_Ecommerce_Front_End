import React, { useContext } from 'react';
import './CartItems.css';
import remove_icon from '../Assets/remove_icon.png';
import { ShopContext } from '../../Context/ShopContext';

const CartItems = () => {
  const { all_product, cartItems, removeFromCart } = useContext(ShopContext);

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
                <p>${e.new_price}</p>
                <button className="cartitems-quantity">{cartItems[e.id]}</button>
                <p>${e.new_price * cartItems[e.id]}</p>
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
              <p>${totalAmount.toFixed(2)}</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <p>Shipping Fee</p>
              <p>Free</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <h3>Total</h3>
              <h3>${totalAmount.toFixed(2)}</h3>
            </div>
          </div>
          <button className="proceed-button">PROCEED TO CHECKOUT</button>
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
