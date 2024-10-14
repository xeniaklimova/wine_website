import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import ReactSlider from 'react-slider';  // Import react-slider
import './App.css';

function App() {
  const [wines, setWines] = useState([]);
  const [filteredWines, setFilteredWines] = useState([]);
  const [sortOption, setSortOption] = useState(''); // State for sorting

  // Visibility controls for collapsible sections
  const [isCountryVisible, setIsCountryVisible] = useState(true);
  const [isWineTypeVisible, setIsWineTypeVisible] = useState(true);
  const [isYearVisible, setIsYearVisible] = useState(true); // New visibility control for Year section

  const [filters, setFilters] = useState({
    country: [],
    wineType: [],
    year: [],
    priceRange: [0, 1500],
  });

  const winesPerPage = 20;
  const [currentPage, setCurrentPage] = useState(1);


  useEffect(() => {
    Papa.parse('/data/wines.csv', {
      download: true,
      header: true,
      complete: function (results) {
        setWines(results.data);
        setFilteredWines(results.data);
      },
    });
  }, []);

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

  useEffect(() => {
    let filtered = wines;

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

    // Sort the wines based on the selected sort option
    const sortedWines = sortWines(filtered, sortOption);

    setFilteredWines(sortedWines);
  }, [filters, wines, sortOption]);


  // Dynamically extract unique countries from dataset, ignoring NaN or empty values
  const availableCountries = [...new Set(wines
    .map(wine => wine.country)
    .filter(country => country && country.trim() !== ''))];  // Remove NaN and empty values

  // Dynamically extract unique wine types from dataset, ignoring NaN or empty values
  const wineTypes = [...new Set(wines
    .map(wine => wine.wine_type)
    .filter(type => type && type.trim() !== ''))];  // Remove NaN and empty values

  // Dynamically extract unique years from dataset, ignoring NaN or empty values
  const availableYears = [...new Set(wines
    .map(wine => wine.year)
    .filter(year => year && year.trim() !== ''))]  // Ensure year isn't empty
    .sort((a, b) => b - a);  // Sort in descending order

  const indexOfLastWine = currentPage * winesPerPage;
  const indexOfFirstWine = indexOfLastWine - winesPerPage;
  const currentWines = filteredWines.slice(indexOfFirstWine, indexOfLastWine);

  const nextPage = () => setCurrentPage(prevPage => prevPage + 1);
  const prevPage = () => setCurrentPage(prevPage - 1);
  const totalPages = Math.ceil(filteredWines.length / winesPerPage);

  const handleSortChange = (e) => {
    setSortOption(e.target.value); // Update the sort option based on user selection
  };

  const handleCountryChange = (country) => {
    const newCountries = filters.country.includes(country)
      ? filters.country.filter(c => c !== country)  // Remove country if selected
      : [...filters.country, country];  // Add country if not selected

    setFilters({
      ...filters,
      country: newCountries,
    });
    setCurrentPage(1);
  };

  const handleWineTypeChange = (type) => {
    const newTypes = filters.wineType.includes(type)
      ? filters.wineType.filter(t => t !== type)  // Remove type if selected
      : [...filters.wineType, type];  // Add type if not selected

    setFilters({
      ...filters,
      wineType: newTypes,
    });
    setCurrentPage(1);
  };

  const handleYearChange = (year) => {
    const newYears = filters.year.includes(year)
      ? filters.year.filter(y => y !== year)  // Remove year if selected
      : [...filters.year, year];  // Add year if not selected

    setFilters({
      ...filters,
      year: newYears,
    });
    setCurrentPage(1);
  };

  const handlePriceRangeSliderChange = (values) => {
    setFilters({
      ...filters,
      priceRange: values,
    });
    setCurrentPage(1);
  };

  const handleMinPriceInputChange = (e) => {
    const value = Number(e.target.value);
    setFilters({
      ...filters,
      priceRange: [value, filters.priceRange[1]],
    });
    setCurrentPage(1);
  };

  const handleMaxPriceInputChange = (e) => {
    const value = Number(e.target.value);
    setFilters({
      ...filters,
      priceRange: [filters.priceRange[0], value],
    });
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
    setSortOption(''); // Reset the sort option as well
  };

  return (
    <div className="App">
      {/* Header Section */}
      <header className="header">
        <h1>Wine Shop</h1>
      </header>

      <div className="layout">
        {/* Filter Sidebar */}
        <aside className="filter-sidebar">


          {/* Collapsible Country Filter */}
          <div className="filter-section">
            <h3 onClick={() => setIsCountryVisible(!isCountryVisible)} className="collapsible-title">
              Country {isCountryVisible ? '▾' : '▸'}
            </h3>
            {isCountryVisible && (
              <div className="country-list scrollable">
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

          {/* Collapsible Wine Type Filter */}
          <div className="filter-section">
            <h3 onClick={() => setIsWineTypeVisible(!isWineTypeVisible)} className="collapsible-title">
              Wine Type {isWineTypeVisible ? '▾' : '▸'}
            </h3>
            {isWineTypeVisible && (
              <div className="wine-type-list scrollable">
                <div>
                  <input
                    type="checkbox"
                    id="AllTypes"
                    value="All Types"
                    onChange={() => setFilters({ ...filters, wineType: ["All Types"] })}
                    checked={filters.wineType.length === 0|| filters.wineType.includes("All Types")}
                  />
                  <label htmlFor="AllTypes">All Types</label>
                </div>
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
          {/* Collapsible Year Filter */}
          <div className="filter-section">
            <h3 onClick={() => setIsYearVisible(!isYearVisible)} className="collapsible-title">
              Year {isYearVisible ? '▾' : '▸'}
            </h3>
            {isYearVisible && (
              <div className="year-list scrollable">
                <div>
                  <input
                    type="checkbox"
                    id="AllYears"
                    value="All Years"
                    onChange={() => setFilters({ ...filters, year: [] })}
                    checked={filters.year.length === 0}
                  />
                  <label htmlFor="AllYears">All Years</label>
                </div>
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

          {/* Price Range (Always Open) */}
          <h3 className="collapsible-title">
    Price Range
  </h3>
          <div className="price-input-slider">
            <div className="input-group">
              <input
                className="price-input"
                type="number"
                value={filters.priceRange[0] === 0 ? '' : filters.priceRange[0]}
                onChange={handleMinPriceInputChange}
                min="0"
                max={filters.priceRange[1]}
                placeholder="Min"
              />
            </div>

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

            <div className="input-group">
              <input
                className="price-input"
                type="number"
                value={filters.priceRange[1] === 1500 ? '' : filters.priceRange[1]}
                onChange={handleMaxPriceInputChange}
                min={filters.priceRange[0]}
                max="1500"
                placeholder="Max"
              />
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

          {/* Wine Gallery */}
          <div className="wine-gallery">
            {currentWines.map((wine, index) => (
              <div key={index} className="wine-item">
                <img src={wine.img_url} alt={wine.title} />
                <h2>{wine.title}</h2>
                <p className="wine-price">${wine.price}</p>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="pagination-container">
            <div className="pagination-controls">
              <button onClick={prevPage} disabled={currentPage === 1}>Previous</button>
              <span> Page {currentPage} of {totalPages} </span>
              <button onClick={nextPage} disabled={currentPage === totalPages}>Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
