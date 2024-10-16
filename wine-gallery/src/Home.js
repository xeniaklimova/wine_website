import React from 'react';
import { NavLink } from 'react-router-dom'; // Import NavLink
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

      <NavLink to="/quiz">
        <button>Take the Wine Quiz</button>
      </NavLink>
    </div>
  );
}

export default Home;
