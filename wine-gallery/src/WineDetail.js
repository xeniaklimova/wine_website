import React from 'react';
import { useParams } from 'react-router-dom';

function WineDetail({ wines }) {
  const { wineId } = useParams();
  const wine = wines[wineId];

  if (!wine) {
    return <h2>Wine not found</h2>;
  }

  return (
    <div className="wine-detail">
      <h1>{wine.title}</h1>
      <img src={wine.img_url} alt={wine.title} />
      <p><strong>Country:</strong> {wine.country}</p>
      <p><strong>Points:</strong> {wine.points}</p>
      <p><strong>Price:</strong> ${wine.price}</p>
      <p><strong>Variety:</strong> {wine.variety}</p>
      <p><strong>Year:</strong> {wine.year}</p>
      <p><strong>Description:</strong> {wine.description}</p>
    </div>
  );
}

export default WineDetail;
