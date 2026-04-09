import { useState } from 'react';
import { SearchBar } from './SearchBar';
import { GenreFilter } from './GenreFilter';
import { YearFilter } from './YearFilter';
import { SortBy } from './SortBy';

export const DiscoverSection = ({
    // Search props
    onSearch,
    isLoading,
    
    // Filter props
    selectedGenres,
    onGenreToggle,
    selectedYear,
    onYearChange,
    sortBy,
    onSortChange,
    
    // UI props
    searchQuery,
    moviesLength,
    
    // Clear filters
    onClearFilters,
    }) => {
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);

    // Проверяем, активны ли какие-либо фильтры
    const hasActiveFilters = searchQuery || 
        selectedGenres.length > 0 || 
        sortBy !== 'popularity.desc' || 
        selectedYear !== null;
            
    return (
        <section className='discover'>
            <div className="discover-header">
                <h2>
                    <i className="fas fa-compass"></i> Browse
                </h2>
                <p className="discover-subtitle">
                    Search and filter through thousands of movies
                </p>
            </div>
            <div className='discover-container'>                
                {/* Search Bar */}
                <SearchBar onSearch={onSearch} isLoading={isLoading} />                
                {/* Filters Section */}
                <div className='filters-container'>
                    <div className="filters-header">
                        <div className="filters-title">
                            <i className="fas fa-filter"></i>                    
                            <h3>Filters</h3> 
                        </div>
                        <div className='filters-buttons'>
                            {hasActiveFilters && (
                            <button className="clear-filters-btn" onClick={onClearFilters}>
                                <i className="fas fa-bucket"></i> Clear filters
                            </button>
                            )}  
                            <button 
                            className="filters-toggle-btn"
                            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                            >
                                <i className={`fas fa-chevron-${isFiltersOpen ? 'up' : 'down'}`}></i>
                            {isFiltersOpen ? 'Hide' : 'Show'}
                            </button>
                        </div>
                    </div>
                    {isFiltersOpen && (
                    <div className="filters-panel">
                        <GenreFilter 
                            selectedGenres={selectedGenres} 
                            onGenreToggle={onGenreToggle} 
                        />
                        <YearFilter 
                            selectedYear={selectedYear} 
                            onYearChange={onYearChange} 
                        />
                        <SortBy 
                            onSortChange={onSortChange} 
                            currentSort={sortBy} 
                        />
                    </div>
                    )}
                </div>                
                {/* Results Info */}
                <div className='results-container'>
                    <div className="results-info">
                        <p>Movies found: {moviesLength}</p>
                        {selectedGenres.length > 0 && (
                        <p>Genres: {selectedGenres.length} selected</p>
                        )}
                        {searchQuery && (
                        <p>Search: "{searchQuery}"</p>
                        )}
                    </div>
                </div>                
            </div>
        </section>
    );
    };