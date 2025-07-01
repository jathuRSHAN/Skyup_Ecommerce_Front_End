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

  // Create an array of selected products with quantity > 0
  const selectedProducts = all_product
    .filter((p) => cartItems[p.id] > 0)
    .map((p) => ({
      ...p,
      quantity: cartItems[p.id],
    }));

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
      {selectedProducts.map((e) => (
        <div key={e.id}>
          <div className="cartitems-format">
            <img src={e.image[0]} alt="" className="carticon-product-icon" />
            <p>{e.name}</p>
            <p>LKR{e.new_price}</p>
            <input
              type="number"
              min="0"
              className="cartitems-quantity-input"
              value={e.quantity}
              onChange={(event) => {
                const value = parseInt(event.target.value) || 0;
                updateCartItem(e.id, value);
              }}
            />
            <p>LKR{(e.new_price * e.quantity).toFixed(2)}</p>
            <img
              src={remove_icon}
              onClick={() => removeFromCart(e.id)}
              alt="Remove"
              className="cartitems-remove-icon"
            />
          </div>
          <hr />
        </div>
      ))}

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
          <button
            className="proceed-button"
            onClick={() =>
              selectedProducts.length > 0
                ? navigate('/order-now', { state: { products: selectedProducts } })
                : alert('No product selected.')
            }
          >
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
