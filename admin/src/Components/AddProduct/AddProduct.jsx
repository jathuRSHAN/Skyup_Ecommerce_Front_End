import React, { useState } from 'react';
import './AddProduct.css';
import upload_area from '../../assets/upload_area.svg';

const AddProduct = () => {
  const [image, setImage] = useState(null); // Initialize image as null
  const [productDetails, setproductDetails] = useState({
    name: '',
    old_price: '',
    new_price: '',
    category: 'gaming',
    thumbnail: '',
  });

  const imageHandler = (e) => {
    setImage(e.target.files[0]);
  };

  const changeHandler = (e) => {
    setproductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  const Add_Product = async () => {
    if (!productDetails.name || !productDetails.old_price || !productDetails.new_price || !image) {
      alert('Please fill in all fields and upload an image.');
      return;
    }

    try {
      console.log(productDetails);
      let responseData;
      let product = productDetails;
      let formData = new FormData();
      formData.append('product', image);

      const response = await fetch('http://localhost:4000/upload', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: formData,
      });

      responseData = await response.json();

      if (responseData.success) {
        product.image = responseData.image_url;
        setproductDetails((prev) => ({
          ...prev,
          thumbnail: responseData.image_url,
        }));
        console.log(product);

        const addProductResponse = await fetch('http://localhost:4000/addproduct', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(product),
        });

        const addProductData = await addProductResponse.json();

        if (addProductData.success) {
          alert('Product Added Successfully');
        } else {
          alert('Product Not Added');
        }
      } else {
        alert('Image upload failed');
      }
    } catch (error) {
      console.error('Error uploading product:', error);
      alert('An error occurred while adding the product.');
    }
  };

  return (
    <div className="add-product">
      <div className="addproduct-itemfield">
        <p>Product Title</p>
        <input
          value={productDetails.name}
          onChange={changeHandler}
          type="text"
          name="name"
          placeholder="Type here"
        />
      </div>
      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <p>Price</p>
          <input
            value={productDetails.old_price}
            onChange={changeHandler}
            type="text"
            name="old_price"
            placeholder="Type here"
          />
        </div>
        <div className="addproduct-itemfield">
          <p>Discount Price</p>
          <input
            value={productDetails.new_price}
            onChange={changeHandler}
            type="text"
            name="new_price"
            placeholder="Type here"
          />
        </div>
      </div>
      <div className="addproduct-itemfield">
        <p>Product Category</p>
        <select
          value={productDetails.category}
          onChange={changeHandler}
          name="category"
          className="add-product-selector"
        >
          <option value="gaming">Gaming</option>
          <option value="phablet">Phablet</option>
          <option value="budget">Budget</option>
        </select>
      </div>
      <div className="addproduct-itemfield">
        <label htmlFor="file-input">
          <img
            src={image ? URL.createObjectURL(image) : upload_area}
            alt=""
            className="addproduct-thumnail-img"
          />
        </label>
        <input
          onChange={imageHandler}
          type="file"
          id="file-input"
          name="thumbnail"
          hidden
        />
      </div>
      <button onClick={Add_Product} className="addproduct-btn">
        ADD
      </button>
    </div>
  );
};

export default AddProduct;