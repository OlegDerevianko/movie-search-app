import { MovieCard } from '../components/MovieCard';

export const FavoritesPage = ({ favorites, onToggleFavorite }) => {
  return (
    <div className="favorites-page">
      <div className='favorites-title'>
        <h1>
          Favorites
          {favorites.length > 0 && (
            <span className="favorites-count">({favorites.length})</span>
          )}
        </h1>
      </div>
      
      {favorites.length === 0 ? (
        <p className="no-favorites">
          <i className="far fa-face-sad-tear"></i> You don't have any favorite movies yet.
        </p>
      ) : (
        <div className="movies-grid">
          {favorites.map(movie => (
            <MovieCard
              key={movie.id}
              movie={movie}
              isFavorite={true}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
};