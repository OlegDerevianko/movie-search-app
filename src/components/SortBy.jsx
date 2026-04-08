export const SortBy = ({ onSortChange, currentSort }) => {
  const sortOptions = [
    { value: 'popularity.desc', label: 'Popularity ↓' },
    { value: 'popularity.asc', label: 'Popularity ↑' },
    { value: 'vote_average.desc', label: 'Rating ↓' },
    { value: 'vote_average.asc', label: 'Rating ↑' },
    { value: 'release_date.desc', label: 'Newest first' },
    { value: 'release_date.asc', label: 'Oldest first' },
    { value: 'original_title.asc', label: 'Title (A-Z)' },
    { value: 'original_title.desc', label: 'Title (Z-A)' },
  ];

  return (
    <div className="sort-container">
      <label>
        Sort by:
      </label>
      <select 
        value={currentSort} 
        onChange={(e) => onSortChange(e.target.value)}
        className="sort-select"
      >
        {sortOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};