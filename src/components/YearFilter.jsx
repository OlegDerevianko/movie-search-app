import { useState, useEffect } from 'react';

export const YearFilter = ({ selectedYear, onYearChange }) => {
  const [years, setYears] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const yearList = [];
    for (let i = currentYear; i >= 1970; i--) {
      yearList.push(i);
    }
    setYears(yearList);
  }, []);

  const displayedYears = showAll ? years : years.slice(0, 10);

  return (
    <div className="year-filter">
      <div className="year-filter-title">
        <h3>Filter by year:</h3>
        {years.length > 10 && (
          <button
            className="year-btn show-more"
            onClick={() => setShowAll(!showAll)}
          >
            <i className={`fas fa-chevron-${showAll ? 'up' : 'down'}`}></i>
            {showAll ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>
      
      <div className="year-buttons">
        <button
          className={`year-btn ${selectedYear === null ? 'active' : ''}`}
          onClick={() => onYearChange(null)}
        >
          All
        </button>
        
        {displayedYears.map(year => (
          <button
            key={year}
            className={`year-btn ${selectedYear === year ? 'active' : ''}`}
            onClick={() => onYearChange(year)}
          >
            {year}
          </button>
        ))}
        
        
      </div>
    </div>
  );
};