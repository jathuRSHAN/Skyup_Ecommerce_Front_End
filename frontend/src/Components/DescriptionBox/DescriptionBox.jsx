import React from 'react'
import './DescriptionBox.css'

const DescriptionBox = () => {
  return (
    <div className='descriptionbox'>
        <div className="descriptionbox-navigator">
            <div className= "descriptionbox-nav-box">Description</div>
            <div className= "descriptionbox-nav-box fade">Reviews(122)</div>

        </div>
      <div className="descriptionbox-description">
        <p>Discover the best deals on top-brand smartphones, from powerful gaming phones to budget-friendly models 
          and cutting-edge phablets. 
          At EliteCell, we bring you the newest tech, unbeatable prices, and fast delivery—all in one place.</p>
            <p>Stay connected in style with phones that match your lifestyle, needs, and budget.</p>
            </div>
    </div>
  )
}

export default DescriptionBox
