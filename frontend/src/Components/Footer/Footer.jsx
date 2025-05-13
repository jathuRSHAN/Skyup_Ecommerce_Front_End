import React from 'react'
import './Footer.css'
import footer_logo from '../Assets/logo.png'
import instagram_icon from '../Assets/instagram_icon.png'
import facebook_icon from '../Assets/facebook_icon.png'      
import twitter_icon from '../Assets/twitter_icon.png'
import whatsapp_icon from '../Assets/whatsapp_icon.png'   


const Footer = () => {
  return (
    <div className= 'footer'>
        <div className= "footer-logo">
            <img src={footer_logo} alt="" />
            <p>EliteCell</p>
        </div>
        <u1 className="footer-links">
            <li>Home</li>
            <li>Offices</li>
            <li>About</li>
            <li>Products</li>
            <li>Contact</li>
            </u1>
      <div className= "footer-social-icons">
        <div className= "footer-icons-container">
        <img src={whatsapp_icon} alt="" />
        </div>
        <div className= "footer-icons-container">
            <img src={instagram_icon} alt="" />
            </div>
            <div className= "footer-icons-container">
            <img src={facebook_icon} alt="" /> 
            </div>
            <div className= "footer-icons-container">
            <img src={twitter_icon} alt="" />
            </div>
            
        
      </div>
      <div className="footer-copyright">
        <hr/>
        <p> Copyright @ 2025- All right Reserverd</p>
      </div>
    </div>
  )
}

export default Footer

