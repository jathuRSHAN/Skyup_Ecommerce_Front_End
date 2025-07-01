import React, { useState } from 'react';
import './AddProduct.css';
import upload_area from '../../assets/upload_area.svg';
import Notification from '../Notification/Notification';

const AddProduct = () => {
  const [image, setImage] = useState(null);
  const [productDetails, setProductDetails] = useState({
    name: '',
    model: '',
    old_price: '',
    new_price: '',
    category: '',
    brand: '',
    description: '',
    stock: ''
  });

  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  const imageHandler = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setProductDetails((prev) => ({
      ...prev,
      [name]: name === 'old_price' || name === 'new_price' || name === 'stock' ? Number(value) : value
    }));
  };

  const Add_Product = async () => {
    const { name, model, old_price, new_price, category, brand, description, stock } = productDetails;

    if (!name || !model || !old_price || !new_price || !category || !brand || !description || !stock || !image) {
      showNotification('Please fill all fields and upload an image.', 'error');
      return;
    }

    const token = localStorage.getItem('token');

    try {
      const formData = new FormData();
      formData.append('image', image);
      formData.append('name', name);
      formData.append('model', model);
      formData.append('old_price', old_price);
      formData.append('new_price', new_price);
      formData.append('category', category);
      formData.append('brand', brand);
      formData.append('description', description);
      formData.append('stock', stock);

      const response = await fetch('http://localhost:8070/items', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,

        },
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        showNotification('Product added successfully!', 'success');
        setProductDetails({
          name: '',
          model: '',
          old_price: '',
          new_price: '',
          category: '',
          brand: '',
          description: '',
          stock: ''
        });
        setImage(null);
      } else {
        console.error('Upload failed:', result);
        showNotification(result.error || 'Failed to add product.', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showNotification('Something went wrong while adding the product.', 'error');
    }
  };

  return (
    <div className="add-product">
      {notification.show && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ show: false, message: '', type: '' })}
        />
      )}

      <div className="addproduct-itemfield">
        <p>Product Name</p>
        <input name="name" type="text" value={productDetails.name} onChange={changeHandler} />
      </div>
      <div className="addproduct-itemfield">
        <p>Model</p>
        <input name="model" type="text" value={productDetails.model} onChange={changeHandler} />
      </div>
      <div className="addproduct-itemfield">
        <p>Old Price</p>
        <input name="old_price" type="number" value={productDetails.old_price} onChange={changeHandler} />
      </div>
      <div className="addproduct-itemfield">
        <p>New Price</p>
        <input name="new_price" type="number" value={productDetails.new_price} onChange={changeHandler} />
      </div>
      <div className="addproduct-itemfield">
        <p>Category</p>
        <input name="category" type="text" value={productDetails.category} onChange={changeHandler} />
      </div>

      <div className="addproduct-itemfield">
        <p>Brand</p>
        <input name="brand" type="text" value={productDetails.brand} onChange={changeHandler} />
      </div>
      <div className="addproduct-itemfield">
        <p>Description</p>
        <input name="description" type="text" value={productDetails.description} onChange={changeHandler} />
      </div>

      <div className="addproduct-itemfield">
        <p>Stock</p>
        <input name="stock" type="number" value={productDetails.stock} onChange={changeHandler} />
      </div>
      <div className="addproduct-itemfield">
        <label htmlFor="file-upload">
          <img src={upload_area} alt="upload" style={{ cursor: 'pointer' }} />
        </label>
        <input type="file" id="file-upload" name="image" onChange={imageHandler} hidden />
        {image && <p>Image selected: {image.name}</p>}
      </div>
      <button onClick={Add_Product}>Add</button>
    </div>
  );
};

export default AddProduct;
