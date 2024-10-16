import React from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';

function WineDetail({ wines }) {
  const { wineId } = useParams();
  const navigate = useNavigate();

  // Find the wine by its Unnamed: 0 (wineId)
  const wine = wines.find(wine => wine['Unnamed: 0'] === wineId);

  if (!wine) {
    return <h2>Wine not found</h2>;
  }

  // Extract and format the flavors
  const flavors = wine.extracted_flavors ? wine.extracted_flavors.replace(/[\[\]']/g, '').split(', ') : [];

  // Function to handle the "Back" button
  const handleBackClick = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div className="wine-detail">
      {/* Breadcrumb Navigation */}
      <nav className="breadcrumb">
        <NavLink to="/">Home</NavLink> &gt; <NavLink to="/gallery">Wine Gallery</NavLink> &gt; <span>{wine.title}</span>
      </nav>

      {/* Back Button */}
      <button onClick={handleBackClick} className="back-button">
        &larr; Back
      </button>

      {/* Wine Image */}
      <img src={wine.img_url} alt={wine.title} className="wine-detail-image" />

      {/* Wine Information */}
      <div className="wine-info">
        <h1>{wine.title}</h1>
        <p><strong>Country:</strong> {wine.country}</p>
        <p><strong>Year:</strong> {wine.year}</p>
        <p><strong>Variety:</strong> {wine.variety}</p>
        <p><strong>Winery:</strong> {wine.winery}</p>
        <p><strong>Points:</strong> {wine.points}</p>
        <p><strong>Price:</strong> ${wine.price}</p>
        <p><strong>Description:</strong> {wine.description}</p>
        
        {/* Extracted Flavors */}
        {flavors.length > 0 && (
          <div className="wine-flavors">
            <strong>Flavors:</strong>
            <ul>
              {flavors.map((flavor, index) => (
                <li key={index} className="flavor-item">
                  {flavor}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Taster Information */}
        {wine.taster_name && (
          <p>
            <strong>Taster:</strong> {wine.taster_name} 
            {wine.taster_twitter_handle && (
              <a href={`https://twitter.com/${wine.taster_twitter_handle.replace('@', '')}`} target="_blank" rel="noopener noreferrer">
                ({wine.taster_twitter_handle})
              </a>
            )}
          </p>
        )}

        {/* Price (Styled for Emphasis) */}
        <p className="wine-price">${wine.price}</p>
      </div>
    </div>
  );
}

export default WineDetail;
