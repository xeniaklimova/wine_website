import WineDetail from './WineDetail'; // Add this line at the top of your App.js
import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import ReactSlider from 'react-slider';
import { BrowserRouter as Router, Routes, Route, NavLink, useParams } from 'react-router-dom'; 
import Home from './Home'; 
import NotFound from './NotFound';
import './App.css';

function App() {
  const [wines, setWines] = useState([]);
  const [filteredWines, setFilteredWines] = useState([]);
  const [sortOption, setSortOption] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // Search query state

  // Manual price range setting through text box
  const handleManualPriceChange = (e, type) => {
    const value = parseInt(e.target.value, 10);
    
    if (type === 'min') {
      setFilters({
        ...filters,
        priceRange: [Math.min(value, filters.priceRange[1]), filters.priceRange[1]]
      });
    } else if (type === 'max') {
      setFilters({
        ...filters,
        priceRange: [filters.priceRange[0], Math.max(value, filters.priceRange[0])]
      });
    }
  };
  

  // Visibility controls for collapsible sections
  const [isCountryVisible, setIsCountryVisible] = useState(true);
  const [isWineTypeVisible, setIsWineTypeVisible] = useState(true);
  const [isYearVisible, setIsYearVisible] = useState(true);

  const [filters, setFilters] = useState({
    country: [],
    wineType: [],
    year: [],
    priceRange: [0, 1500],
  });

  const winesPerPage = 20;
  const [currentPage, setCurrentPage] = useState(1);

  // Load wine data
  useEffect(() => {
    Papa.parse('/data/updated_wine_data.csv', {
      download: true,
      header: true,
      complete: function (results) {
        setWines(results.data);
        setFilteredWines(results.data);
      },
    });
  }, []);

  // Search and filter functionality
  useEffect(() => {
    let filtered = wines.filter(wine => {
      const searchStr = `${wine.title} ${wine.country} ${wine.variety}`.toLowerCase();
      return searchStr.includes(searchQuery.toLowerCase());
    });

    if (filters.country.length > 0) {
      filtered = filtered.filter(wine => filters.country.includes(wine.country));
    }

    if (filters.wineType.length > 0 && !filters.wineType.includes("All Types")) {
      filtered = filtered.filter(wine => filters.wineType.includes(wine.wine_type));
    }

    if (filters.year.length > 0) {
      filtered = filtered.filter(wine => filters.year.includes(wine.year));
    }

    filtered = filtered.filter(wine => {
      const price = parseFloat(wine.price);
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    const sortedWines = sortWines(filtered, sortOption);
    setFilteredWines(sortedWines);
  }, [searchQuery, filters, wines, sortOption]);

  // Sorting function
  const sortWines = (wines, sortOption) => {
    switch (sortOption) {
      case 'name-asc':
        return [...wines].sort((a, b) => a.title.localeCompare(b.title));
      case 'name-desc':
        return [...wines].sort((a, b) => b.title.localeCompare(a.title));
      case 'highest-rated':
        return [...wines].sort((a, b) => parseFloat(b.points) - parseFloat(a.points));
      case 'price-low-high':
        return [...wines].sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      case 'price-high-low':
        return [...wines].sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      default:
        return wines;
    }
  };

  const availableCountries = [...new Set(wines.map(wine => wine.country).filter(Boolean))];
  const wineTypes = [...new Set(wines.map(wine => wine.wine_type).filter(Boolean))];
  const availableYears = [...new Set(wines.map(wine => wine.year).filter(Boolean))].sort((a, b) => b - a);

  const indexOfLastWine = currentPage * winesPerPage;
  const indexOfFirstWine = indexOfLastWine - winesPerPage;
  const currentWines = filteredWines.slice(indexOfFirstWine, indexOfLastWine);

  const nextPage = () => setCurrentPage(prevPage => prevPage + 1);
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const totalPages = Math.ceil(filteredWines.length / winesPerPage);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const totalPages = Math.ceil(filteredWines.length / winesPerPage);
  
    let startPage = currentPage - 2;
    let endPage = currentPage + 2;
  
    if (startPage < 1) {
      startPage = 1;
      endPage = Math.min(5, totalPages); // Ensure only 5 pages show initially
    }
  
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(totalPages - 4, 1); // Ensure last few pages are visible
    }
  
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={i === currentPage ? 'active' : ''}
        >
          {i}
        </button>
      );
    }
  
    // Add ellipsis if there are more pages before or after
    if (startPage > 1) {
      pageNumbers.unshift(<span key="start-ellipsis">...</span>);
      pageNumbers.unshift(
        <button key="1" onClick={() => setCurrentPage(1)}>
          1
        </button>
      );
    }
  
    if (endPage < totalPages) {
      pageNumbers.push(<span key="end-ellipsis">...</span>);
      pageNumbers.push(
        <button key={totalPages} onClick={() => setCurrentPage(totalPages)}>
          {totalPages}
        </button>
      );
    }
  
    return pageNumbers;
  };


  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const handleCountryChange = (country) => {
    const newCountries = filters.country.includes(country)
      ? filters.country.filter(c => c !== country)
      : [...filters.country, country];

    setFilters({ ...filters, country: newCountries });
    setCurrentPage(1);
  };

  const handleWineTypeChange = (type) => {
    const newTypes = filters.wineType.includes(type)
      ? filters.wineType.filter(t => t !== type)
      : [...filters.wineType, type];

    setFilters({ ...filters, wineType: newTypes });
    setCurrentPage(1);
  };

  const handleYearChange = (year) => {
    const newYears = filters.year.includes(year)
      ? filters.year.filter(y => y !== year)
      : [...filters.year, year];

    setFilters({ ...filters, year: newYears });
    setCurrentPage(1);
  };

  const handlePriceRangeSliderChange = (values) => {
    setFilters({ ...filters, priceRange: values });
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({
      country: [],
      wineType: [],
      year: [],
      priceRange: [0, 1500],
    });
    setCurrentPage(1);
    setSortOption('');
  };

  return (
    <Router>
      <header className="header">
        <h1>Wine Shop</h1>
        <nav>
          <ul>
            <li><NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink></li>
            <li><NavLink to="/gallery" className={({ isActive }) => isActive ? 'active' : ''}>Wine Gallery</NavLink></li>
          </ul>
          <input
            type="text"
            placeholder="Search wines..."
            className="nav-search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Home searchQuery={searchQuery} setSearchQuery={setSearchQuery} />} />
        <Route path="/gallery" element={
          <div className="layout">
            <aside className="filter-sidebar">
              {/* Country Filter */}
              <div className="filter-section">
                <h3 onClick={() => setIsCountryVisible(!isCountryVisible)} className="collapsible-title">
                  Country {isCountryVisible ? '▾' : '▸'}
                </h3>
                {isCountryVisible && (
                  <div className="country-list">
                    <div>
                      <input
                        type="checkbox"
                        id="AllCountries"
                        value="All Countries"
                        onChange={() => setFilters({ ...filters, country: [] })}
                        checked={filters.country.length === 0}
                      />
                      <label htmlFor="AllCountries">All Countries</label>
                    </div>
                    {availableCountries.map(country => (
                      <div key={country}>
                        <input
                          type="checkbox"
                          id={country}
                          value={country}
                          onChange={() => handleCountryChange(country)}
                          checked={filters.country.includes(country)}
                        />
                        <label htmlFor={country}>{country}</label>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Wine Type Filter */}
              <div className="filter-section">
                <h3 onClick={() => setIsWineTypeVisible(!isWineTypeVisible)} className="collapsible-title">
                  Wine Type {isWineTypeVisible ? '▾' : '▸'}
                </h3>
                {isWineTypeVisible && (
                  <div className="wine-type-list">
                    {wineTypes.map(type => (
                      <div key={type}>
                        <input
                          type="checkbox"
                          id={type}
                          value={type}
                          onChange={() => handleWineTypeChange(type)}
                          checked={filters.wineType.includes(type)}
                        />
                        <label htmlFor={type}>{type}</label>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Year Filter */}
              <div className="filter-section">
                <h3 onClick={() => setIsYearVisible(!isYearVisible)} className="collapsible-title">
                  Year {isYearVisible ? '▾' : '▸'}
                </h3>
                {isYearVisible && (
                  <div className="year-list">
                                       {availableYears.map(year => (
                      <div key={year}>
                        <input
                          type="checkbox"
                          id={year}
                          value={year}
                          onChange={() => handleYearChange(year)}
                          checked={filters.year.includes(year)}
                        />
                        <label htmlFor={year}>{year}</label>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Range Filter */}
              <h3 className="collapsible-title">Price Range</h3>
              <div className="price-input-slider">
                {/* Display the current price values */}
                <div className="price-values">
                  <span>Min: ${filters.priceRange[0]}</span>
                  <span>Max: ${filters.priceRange[1]}</span>
                </div>
                
                {/* Slider Component */}
                <ReactSlider
                  className="horizontal-slider"
                  thumbClassName="slider-thumb"
                  trackClassName="slider-track"
                  min={0}
                  max={1500}
                  step={5}
                  value={filters.priceRange}
                  onChange={handlePriceRangeSliderChange}
                />

                {/* Manual input fields */}
                <div className="manual-input">
                  <div className="input-group">
                    <label htmlFor="minPrice">Min Price</label>
                    <input
                      type="number"
                      id="minPrice"
                      className="price-input"
                      value={filters.priceRange[0]}
                      onChange={(e) => handleManualPriceChange(e, 'min')}
                      min="0"
                      max="1500"
                    />
                  </div>

                  <div className="input-group">
                    <label htmlFor="maxPrice">Max Price</label>
                    <input
                      type="number"
                      id="maxPrice"
                      className="price-input"
                      value={filters.priceRange[1]}
                      onChange={(e) => handleManualPriceChange(e, 'max')}
                      min="0"
                      max="1500"
                    />
                  </div>
                </div>
              </div>

              {/* Reset Filters Button */}
              <button className="reset-button" onClick={resetFilters}>
                Reset Filters
              </button>
            </aside>

            {/* Wine Gallery */}
            <div className="wine-gallery-container">
              {/* Sort By Dropdown */}
              <div className="sort-section">
                <label htmlFor="sort-select">Sort By:</label>
                <select id="sort-select" value={sortOption} onChange={handleSortChange}>
                  <option value="">Default</option>
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                  <option value="highest-rated">Highest Rated</option>
                  <option value="price-low-high">Price (Low-High)</option>
                  <option value="price-high-low">Price (High-Low)</option>
                </select>
              </div>

              {/* Wine Gallery Display */}
              <div className="wine-gallery">
                {currentWines.map((wine, index) => (
                  <div key={index} className="wine-item">
                    <NavLink to={`/wine/${index}`}>
                      <img src={wine.img_url} alt={wine.title} />
                      <h2>{wine.title}</h2>
                      <p className="wine-price">${wine.price}</p>
                    </NavLink>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              <div className="pagination-container">
                <div className="pagination-controls">
                  <button onClick={prevPage} disabled={currentPage === 1}>
                    Previous
                  </button>

                  {renderPageNumbers()}

                  <button onClick={nextPage} disabled={currentPage === totalPages}>
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        } />

        {/* Wine Detail Page Route */}
        <Route path="/wine/:wineId" element={<WineDetail wines={wines} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;

