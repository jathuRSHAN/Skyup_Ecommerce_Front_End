import React,{ useContext} from 'react'
import './ProductDisplay.css'
import star_icon from '../Assets/star_icon.png'
import star_dull_icon from '../Assets/star_dull_icon.png'
import { ShopContext } from '../../Context/ShopContext'

const ProductDisplay = (props) => {
    const{product}=props;
    const{addToCart}=useContext(ShopContext);

  return (
    <div className= 'productdisplay'>
        <div className="productdisplay-left">
            <div className="productdisplay-img-list">
                <img src ={product.image} alt ="" />
                <img src ={product.image} alt ="" />
                <img src ={product.image} alt ="" />
                <img src ={product.image} alt ="" />
            </div>
            <div className="productdisplay-img">
                <img  className='productdisplay-main-img' src ={product.image} alt ="" />
        </div>
        </div>
        <div className= "productdisplay-right">
            <h1>{product.name}</h1>
            <div className="productdisplay-right-star">
                <img src={star_icon} alt="" />
                <img src={star_icon} alt="" />
                <img src={star_icon} alt="" />
                <img src={star_icon} alt="" />
                <img src={star_dull_icon} alt="" />
                <p>(122)</p>


        </div>
        <div classname="productdisplay-right-prices">
          <div className= "productdisplay-right-price-old">${product.old_price}</div>
          <div className= "productdisplay-right-price-new">${product.new_price}</div>
          <div clasName="productdisplay-right-description">
            A light weight 256GB LED Screen smartphone.
          </div>
          <div className="productdisplay-right-size">
            <h1>Select Size</h1>
            <div className="productdisplay-right-sizes">
              <div>32GB</div>
              <div>64GB</div>
              <div>128GB</div>
              <div>256GB</div>
              <div>1TB</div>


            </div>
          </div>
          <button onClick= {()=>{addToCart(product.id)}}>ADD TO CART</button>
          <p className='productdisplay-right-category'><span>Category :</span>Smartphones, Gaming Phones ,Phablets, Budget Phones</p>
          <p className='productdisplay-right-category'><span>Tags :</span>Modern, Latest, Limited Edition</p>
      </div>
    </div>
    </div>
  )
}

export default ProductDisplay


