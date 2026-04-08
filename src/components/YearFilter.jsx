import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const YearFilter = ({ selectedYear, onYearChange }) => {
  const [years, setYears] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    // Генерируем года от 1970 до текущего
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
      <label className="year-filter-label">
        <i className="fas fa-calendar-alt"></i> Year:
      </label>
      
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
        
        {years.length > 10 && (
          <button
            className="year-btn show-more"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Show less ↑' : 'Show more ↓'}
          </button>
        )}
      </div>
    </div>
  );
};