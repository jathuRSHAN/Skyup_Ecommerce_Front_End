import React, { useState } from 'react';
import './AddProduct.css';
import upload_area from '../../assets/upload_area.svg';
import Notification from '../Notification/Notification';

const AddProduct = () => {
  const [images, setImages] = useState([]);
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

  // Allow adding images one by one or multiple at once, up to 4
  const imageHandler = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 4) {
      showNotification('You can upload a maximum of 4 images.', 'error');
      return;
    }
    setImages(prev => [...prev, ...files]);
    e.target.value = '';
  };

  // Remove an image by index
  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setProductDetails((prev) => ({
      ...prev,
      [name]: ['old_price', 'new_price', 'stock'].includes(name) ? Number(value) : value
    }));
  };

  const Add_Product = async () => {
    const { name, model, old_price, new_price, category, brand, description, stock } = productDetails;

<<<<<<< HEAD
    if (!name || !model || !old_price || !new_price || !category || !brand || !description || !stock || !image) {
      showNotification('Please fill all fields and upload an image.', 'error');
=======
    if (!name || !old_price || !new_price || !category || !stock || images.length !== 4) {
      showNotification('Fill all fields and upload exactly 4 images.', 'error');
>>>>>>> Wasana
      return;
    }

    const token = localStorage.getItem('token');

    try {
      const formData = new FormData();
      images.forEach(img => formData.append('images', img));
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
<<<<<<< HEAD

=======
>>>>>>> Wasana
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
        setImages([]);
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
          <img
            src={upload_area}
            alt="upload"
            style={{
              cursor: images.length < 4 ? 'pointer' : 'not-allowed',
              opacity: images.length < 4 ? 1 : 0.5
            }}
          />
        </label>
        <input
          type="file"
          id="file-upload"
          name="images"
          accept="image/*"
          multiple
          onChange={imageHandler}
          hidden
          disabled={images.length >= 4}
        />
        {images.length > 0 && (
          <ul style={{ marginTop: '10px' }}>
            {images.map((img, i) => (
              <li key={i}>
                {img.name}
                <button type="button" style={{ marginLeft: 8 }} onClick={() => removeImage(i)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <button onClick={Add_Product}>Add</button>
    </div>
  );
};

export default AddProduct;