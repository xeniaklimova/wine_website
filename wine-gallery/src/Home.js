import React from 'react';
import './Home.css';

function Home({ searchQuery, setSearchQuery }) {
  return (
    <div className="home">
      <h1>Welcome to the Wine Shop</h1>
      <p>Discover our collection of fine wines from around the world.</p>
      
      {/* Add a search bar on the homepage */}
      <input
        type="text"
        placeholder="Search wines..."
        className="home-search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
}

export default Home;
