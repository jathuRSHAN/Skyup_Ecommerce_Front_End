import React, { useState } from 'react';
import './AddProduct.css';
import upload_area from '../../assets/upload_area.svg';

const AddProduct = () => {
  const [image, setImage] = useState(null);
  const [productDetails, setProductDetails] = useState({
    name: '',
    old_price: '',
    new_price: '',
    category: '',
    stock: ''
  });

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
    const { name, old_price, new_price, category, stock } = productDetails;

    if (!name || !old_price || !new_price || !category || !stock || !image) {
      alert('Please fill all fields and upload an image.');
      return;
    }

    const token = localStorage.getItem('token');

    try {
      const formData = new FormData();
      formData.append('image', image);
      formData.append('name', name);
      formData.append('old_price', old_price);
      formData.append('new_price', new_price);
      formData.append('category', category);
      formData.append('stock', stock);

      const productResponse = await fetch('http://localhost:8070/items', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await productResponse.json();

      if (productResponse.ok) {
        alert('Product Added Successfully!');
        setProductDetails({
          name: '',
          old_price: '',
          new_price: '',
          category: '',
          stock: ''
        });
        setImage(null);
      } else {
        console.error('Product response error:', result);
        alert(result.error || 'Failed to add product');
      }
    } catch (error) {
      console.error('Caught error while adding product:', error);
      alert('Something went wrong while adding the product.');
    }
  };

  return (
    <div className="add-product">
      <div className="addproduct-itemfield">
        <p>Product Name</p>
        <input name="name" type="text" value={productDetails.name} onChange={changeHandler} />
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
