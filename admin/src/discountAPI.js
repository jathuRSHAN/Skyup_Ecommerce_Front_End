import axios from 'axios';

const API_BASE_URL = 'http://localhost:8070/discounts'; 
const CATEGORY_URL = 'http://localhost:8070/categories';
const SUBCATEGORY_URL = 'http://localhost:8070/sub-categories';
const ITEM_URL = 'http://localhost:8070/items';

export const fetchCategories = (token) =>
  axios.get(CATEGORY_URL, authHeader(token));

export const fetchSubCategories = (token) =>
  axios.get(SUBCATEGORY_URL, authHeader(token));

export const fetchItems = (token) =>
  axios.get(ITEM_URL, authHeader(token));


// Attach the token in headers
const authHeader = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});

// Get all discounts
export const fetchDiscounts = (token) =>
  axios.get(API_BASE_URL, authHeader(token));

// Get a specific discount by ID
export const fetchDiscountById = (id, token) =>
  axios.get(`${API_BASE_URL}/${id}`, authHeader(token));

// Create a new discount
export const createDiscount = (discountData, token) =>
  axios.post(API_BASE_URL, discountData, authHeader(token));

// Update an existing discount
export const updateDiscount = (id, discountData, token) =>
  axios.put(`${API_BASE_URL}/${id}`, discountData, authHeader(token));

// Delete a discount
export const deleteDiscount = (id, token) =>
  axios.delete(`${API_BASE_URL}/${id}`, authHeader(token));
