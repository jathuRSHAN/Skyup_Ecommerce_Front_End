import React, { useState } from 'react';
import axios from 'axios';
import './CSS/LoginSignup.css';

const LoginSignup = () => {
  const [state, setState] = useState("Sign Up");
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    userType: 'Customer',
    address: {
      state: '',
      city: '',
      street: '',
      zip: ''
    },
    phone: '',
    preferredPaymentMethod: ''
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: ''
  });
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes('address.')) {
      const key = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [key]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (state === "Change Password") {
      try {
        const token = localStorage.getItem('auth-token');
        await axios.put('http://localhost:8070/users/change-password', passwordData, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        alert('Password changed successfully!');
        setState('Login');
      } catch (error) {
        alert(error.response?.data?.error || "Error changing password.");
      }
    } else {
      if (!agreeTerms) {
        alert('You must agree to the terms and conditions.');
        return;
      }

      try {
        const url = state === "Login"
          ? "http://localhost:8070/api/login"
          : "http://localhost:8070/api/signup";

        const payload = { ...formData };

        // Remove preferredPaymentMethod if not a Customer
        if (formData.userType !== 'Customer') {
          delete payload.preferredPaymentMethod;
        }

        const response = await axios.post(url, payload);
        localStorage.setItem('auth-token', response.data.token);  // Save token to localStorage
        window.location.replace("/");  // Redirect to home page after successful login/signup
      } catch (error) {
        alert(error.response?.data?.error || "An error occurred.");
      }
    }
  };

  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        <h1>{state}</h1>
        <form onSubmit={handleSubmit} className="loginsignup-fields">
          {state === "Sign Up" && (
            <>
              <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
              <input name="phone" placeholder="Phone (start with 0)" value={formData.phone} onChange={handleChange} required />
              <select name="userType" value={formData.userType} onChange={handleChange}>
                <option value="Customer">Customer</option>
                <option value="Admin">Admin</option>
              </select>
              {formData.userType === 'Customer' && (
                <input
                  name="preferredPaymentMethod"
                  placeholder="Preferred Payment Method"
                  value={formData.preferredPaymentMethod}
                  onChange={handleChange}
                  required
                />
              )}
              <input name="address.state" placeholder="State" value={formData.address.state} onChange={handleChange} required />
              <input name="address.city" placeholder="City" value={formData.address.city} onChange={handleChange} required />
              <input name="address.street" placeholder="Street" value={formData.address.street} onChange={handleChange} required />
              <input name="address.zip" placeholder="ZIP (optional)" value={formData.address.zip} onChange={handleChange} />
            </>
          )}

          {state === "Change Password" ? (
            <>
              <input name="oldPassword" type="password" placeholder="Old Password" value={passwordData.oldPassword} onChange={handlePasswordChange} required />
              <input name="newPassword" type="password" placeholder="New Password" value={passwordData.newPassword} onChange={handlePasswordChange} required />
            </>
          ) : (
            <>
              <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
              <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
            </>
          )}

          <button type="submit">Continue</button>
        </form>

        {state === "Sign Up" ? (
          <p className="loginsignup-login">Already a member? <span onClick={() => setState("Login")}>Login Here</span></p>
        ) : state === "Login" ? (
          <>
            <p className="loginsignup-login">Create an account? <span onClick={() => setState("Sign Up")}>Click Here</span></p>
            <p className="loginsignup-login">Want to change password? <span onClick={() => setState("Change Password")}>Change Password</span></p>
          </>
        ) : (
          <p className="loginsignup-login">Go back to <span onClick={() => setState("Login")}>Login</span></p>
        )}

        {state !== "Change Password" && (
          <div className="loginsignup-agree">
            <input type="checkbox" checked={agreeTerms} onChange={() => setAgreeTerms(!agreeTerms)} />
            <p>By continuing I agree to all terms and conditions</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginSignup;
