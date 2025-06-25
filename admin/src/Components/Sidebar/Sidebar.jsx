import React from 'react'
import './Sidebar.css'
import { Link } from 'react-router-dom'
import add_product_icon from '../../assets/Product_Cart.svg'
import list_product_icon from '../../assets/Product_list_icon.svg'
import discount_icon from '../../assets/discount_icon.svg'
import orders_icon from '../../assets/orders_icon.svg' 

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <Link to={'/addproduct'} style={{ textDecoration: 'none' }}>
        <div className='sidebar-item'>
          <img src={add_product_icon} alt="Add Product" />
          <p>Add Product</p>
        </div>
      </Link>

      <Link to={'/listproduct'} style={{ textDecoration: 'none' }}>
        <div className='sidebar-item'>
          <img src={list_product_icon} alt="List Product" />
          <p>List Product</p>
        </div>
      </Link>

      <Link to={'/discounts'} style={{ textDecoration: 'none' }}>
        <div className='sidebar-item'>
          <img src={discount_icon} alt="Discounts" />
          <p>View Discounts</p>
        </div>
      </Link>

      <Link to={'/orders'} style={{ textDecoration: 'none' }}>
        <div className='sidebar-item'>
          <img src={orders_icon} alt="Orders" />
          <p>All Orders</p>
        </div>
      </Link>
    </div>
  )
}

export default Sidebar