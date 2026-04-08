import { useState } from 'react';

export const SearchBar = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className="search-container">
      <div className="search-bar">
        <div className="search-icon-inside">
          <i className="fa-solid fa-magnifying-glass"></i>
        </div>
        <input
          type="text"
          placeholder="Searching for movies... (For example, Inception)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />
        {query && (
          <button 
            className="search-clear-btn"
            onClick={handleClear}
            disabled={isLoading}
          >
            <i className="fa-solid fa-times"></i>
          </button>
        )}
        <button 
          className="search-submit-btn"
          onClick={handleSearch}
          disabled={isLoading || !query.trim()}
        >
          {isLoading ? (
            <span className="search-spinner">⏳</span>
          ) : (
            <i className="fa-solid fa-arrow-right"></i>
          )}
        </button>
      </div>
    </div>
  );
};