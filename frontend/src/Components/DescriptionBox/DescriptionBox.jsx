import React, { useEffect, useState } from 'react';
import './DescriptionBox.css';
import axios from 'axios';

const DescriptionBox = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    axios.get('http://localhost:8070/content/DescriptionBox')
      .then(res => setData(res.data.data || {}))
      .catch(err => console.error("Description content load error:", err));
  }, []);

  return (
    <div className='descriptionbox'>
      <div className="descriptionbox-navigator">
        <div className="descriptionbox-nav-box">{data.heading || 'Description'}</div>
        <div className="descriptionbox-nav-box fade">Reviews (122)</div>
      </div>

      <div className="descriptionbox-description">
        <p>{data.description || 'Description is not available at the moment.'}</p>
      </div>
    </div>
  );
};

export default DescriptionBox;
