import React from 'react';
import { useLocation } from 'react-router-dom';

const Recommendations = () => {
  const location = useLocation();
  const { top5Wines } = location.state || { top5Wines: [] };

  return (
    <div>
      <h2>Your Top 5 Wine Recommendations</h2>
      <div>
        {top5Wines.map((wine, index) => (
          <div key={index}>
            <img src={wine.img_url} alt={wine.title} />
            <h3>{wine.title}</h3>
            <p>${wine.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;
