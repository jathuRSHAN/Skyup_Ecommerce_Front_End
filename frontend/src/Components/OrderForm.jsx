import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OrderForm.css'; 

const OrderForm = () => {
  const [cartItems, setCartItems] = useState([]);
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [cardNumber, setCardNumber] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(cart);
  }, []);

  const handlePlaceOrder = async () => {
    const token = localStorage.getItem('auth-token');

    if (!token) {
      alert('You must be logged in to place an order.');
      return;
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty.');
      return;
    }

    const { street, city, state, postalCode } = address;
    if (!street || !city || !state || !postalCode) {
      alert('Please fill out the complete shipping address.');
      return;
    }

    if (!cardNumber || cardNumber.length < 12) {
      alert('Please enter a valid card number.');
      return;
    }

    try {
      setLoading(true);

      const orderItems = Array.isArray(cartItems)
        ? cartItems.map(item => ({
            itemId: item.itemId,
            quantity: item.quantity,
          }))
        : Object.entries(cartItems).map(([itemId, quantity]) => ({
            itemId,
            quantity,
          }));

      const res = await axios.post(
        'http://localhost:8070/orders',
        {
          order_items: orderItems,
          discount: 10,
          shippingAddress: address,
          paymentMethod,
          paymentDetails: {
            cardNumber,
          },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      localStorage.removeItem('cart');
      alert('Order placed!');
      window.location.href = `/payments/success?order_id=${res.data.order._id}`;
    } catch (err) {
      console.error('Error placing order:', err.response?.data || err.message);
      alert(`Error placing order: ${err.response?.data?.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="order-form-container">
      <h2>Shipping Address</h2>
      <input
        placeholder="Street"
        value={address.street}
        onChange={(e) => setAddress({ ...address, street: e.target.value })}
      />
      <input
        placeholder="City"
        value={address.city}
        onChange={(e) => setAddress({ ...address, city: e.target.value })}
      />
      <input
        placeholder="State"
        value={address.state}
        onChange={(e) => setAddress({ ...address, state: e.target.value })}
      />
      <input
        placeholder="Postal Code"
        value={address.postalCode}
        onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
      />

      <h3>Payment Information</h3>
      <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
        <option value="Credit Card">Credit Card</option>
        <option value="Debit Card">Debit Card</option>
      </select>
      <input
        placeholder="Card Number"
        value={cardNumber}
        onChange={(e) => setCardNumber(e.target.value)}
        maxLength={16}
        type="number"
      />

      <button disabled={loading} onClick={handlePlaceOrder}>
        {loading ? 'Placing...' : 'Place Order'}
      </button>
    </div>
  );
};

export default OrderForm;
