import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { searchMovies, getMoviesWithSort, discoverMoviesByGenres, discoverMoviesWithFilters } from './api/tmdb';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useTheme } from './context/ThemeContext';
import { MovieCard } from './components/MovieCard';
import { MovieDetailsPage } from './pages/MovieDetailsPage';
import { FavoritesPage } from './pages/FavoritesPage';

import { FilmIcon } from './components/icons/FilmIcon';
import { DiscoverSection } from './components/DiscoverSection';

import { SkeletonGrid } from './components/SkeletonGrid';

import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [favorites, setFavorites] = useLocalStorage('favorites', []);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [sortBy, setSortBy] = useState('popularity.desc');
  const { isDark, toggleTheme } = useTheme();
  const [selectedYear, setSelectedYear] = useState(null);

  // Простая функция загрузки без useCallback
  const fetchMovies = async (pageNum, isReset) => {
    if (loading && !isReset) return;
    setLoading(true);

    try {
      let data;

      // Если есть поисковый запрос - используем search endpoint
      if (searchQuery) {
        data = await searchMovies(searchQuery, pageNum);
      } 
      // Иначе используем discover endpoint с комбинацией всех фильтров
      else {
        // Собираем все параметры фильтрации
        const params = {
          page: pageNum,
          sort_by: sortBy,
        };

        // Добавляем жанры (если выбраны)
        if (selectedGenres.length > 0) {
          params.with_genres = selectedGenres.join(',');
        }

        // Добавляем год (если выбран)
        if (selectedYear) {
          params.primary_release_year = selectedYear;
        }

        data = await discoverMoviesWithFilters(params);
      }

      const results = data.results || [];
      const total = data.total_pages || 0;

      if (isReset) {
        setMovies(results);
      } else {
        setMovies(prev => {
          const existingIds = new Set(prev.map(m => m.id));
          const newMovies = results.filter(movie => !existingIds.has(movie.id));
          return [...prev, ...newMovies];
        });
      }

      setHasMore(pageNum < total);
    } catch (error) {
      console.error('Error:', error);
      if (isReset) setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  // Загрузка при изменении поиска, жанров или сортировки
  useEffect(() => {
    setPage(1);
    fetchMovies(1, true);
  }, [searchQuery, selectedGenres, sortBy, selectedYear]);

  // Начальная загрузка
  useEffect(() => {
    fetchMovies(1, true);
  }, []);

  // Функция для обновления года
  const handleYearChange = (year) => {
    setSelectedYear(year);
    setPage(1);
  };
    // Функция для подгрузки следующей страницы
    const loadMore = () => {
      if (!loading && hasMore) {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchMovies(nextPage, false);
      }
    };

  // Обработчик скролла
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
        loadMore();
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore, page]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setSelectedGenres([]);
  };

  const handleGenreToggle = (genreId) => {
    setSelectedGenres(prev => 
      prev.includes(genreId) 
        ? prev.filter(id => id !== genreId)
        : [...prev, genreId]
    );
    setSearchQuery('');
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
  };

  const toggleFavorite = (movie) => {
    const exists = favorites.find(fav => fav.id === movie.id);
    if (exists) {
      setFavorites(favorites.filter(fav => fav.id !== movie.id));
    } else {
      setFavorites([...favorites, movie]);
    }
  };

  const isFavorite = (movieId) => {
    return favorites.some(fav => fav.id === movieId);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedGenres([]);
    setSortBy('popularity.desc');
    setSelectedYear(null);
    setPage(1);  
  };
  return (
    <BrowserRouter>
      <div className="app">
        <div className='header'>
          <div className='header-container'>
            <nav className="navbar">
                <div className='navbar-links'>
                <Link to="/" className='header-title'>
                  <FilmIcon size={24}/>
                  <h1>Movie Search</h1>
                </Link>
                {/* Кнопка избранного с количеством */}
                <Link to="/favorites" className='favorite-button'>
                  <i className="far fa-heart favorite-button-icon"></i> 
                  Favorites
                </Link>  
                </div>              
                {/* Кнопка переключения темы */}
                <div className='theme-container'>
                  <button onClick={toggleTheme} className="theme-toggle">
                    <div className="theme-icons-container">
                      <div className={`theme-icon sun-icon ${!isDark ? 'active' : ''}`}>
                        <i className="far fa-sun"></i>
                      </div>
                      <div className={`theme-icon moon-icon ${isDark ? 'active' : ''}`}>
                        <i className="far fa-moon"></i>
                      </div>
                    </div>
                  </button>
                </div>
            </nav>
          </div>
        </div>

        <Routes>
          <Route path="/" element={
            <>
            <DiscoverSection
              // Search
              onSearch={handleSearch}
              isLoading={loading}
              
              // Filters
              selectedGenres={selectedGenres}
              onGenreToggle={handleGenreToggle}
              selectedYear={selectedYear}
              onYearChange={handleYearChange}
              sortBy={sortBy}
              onSortChange={handleSortChange}
              
              // UI
              searchQuery={searchQuery}
              moviesLength={movies.length}
              
              // Clear filters
              onClearFilters={clearFilters}
            />
              
              {loading && movies.length === 0 ? (
                <SkeletonGrid count={8} />
              ) : (
                <>
                  
                  
                  <div className="movies-grid">
                    {movies.map(movie => (
                      <MovieCard
                        key={movie.id}
                        movie={movie}
                        isFavorite={isFavorite(movie.id)}
                        onToggleFavorite={toggleFavorite}
                      />
                    ))}
                  </div>
                  
                  {loading && movies.length > 0 && (
                    <div className="loading-trigger">🎬 Loading more...</div>
                  )}
                  
                  {hasMore && !loading && movies.length > 0 && (
                    <div className="loading-trigger">📱 Scroll to load more</div>
                  )}
                </>
              )}
              
              {!loading && movies.length === 0 && (
                <p className="no-results">Nothing found <i className="far fa-face-sad-tear"></i></p>
              )}
            </>
          } />
          <Route path="/movie/:id" element={
            <MovieDetailsPage onToggleFavorite={toggleFavorite} isFavorite={isFavorite} />
          } />
          <Route path="/favorites" element={
            <FavoritesPage favorites={favorites} onToggleFavorite={toggleFavorite} />
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;