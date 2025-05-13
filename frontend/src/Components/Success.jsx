import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Success.css';

const Success = () => {
  const query = new URLSearchParams(useLocation().search);
  const orderId = query.get('order_id');
  const navigate = useNavigate();

  return (
    <div className="success-container">
      <div className="success-card">
        <h1 className="success-title">✅ Payment Successful</h1>
        <p className="success-message">Thank you for your order!</p>
        {orderId && <p className="order-id">Order ID: <strong>{orderId}</strong></p>}
        <div className="button-group">
          <button className="back-link" onClick={() => navigate('/')}>
            Return to Shop
          </button>
          
        </div>
      </div>
    </div>
  );
};

export default Success;
