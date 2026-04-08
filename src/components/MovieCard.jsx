import { useNavigate } from 'react-router-dom';

export const MovieCard = ({ movie, isFavorite, onToggleFavorite }) => {
  const navigate = useNavigate();
  
  const posterUrl = movie.poster_path 
  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
  : 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 750"%3E%3Crect width="500" height="750" fill="%232a2f3f"/%3E%3Ctext x="250" y="375" font-size="60" fill="%237f8c8d" text-anchor="middle"%3E🎬%3C/text%3E%3Ctext x="250" y="420" font-size="20" fill="%237f8c8d" text-anchor="middle"%3ENo Poster%3C/text%3E%3C/svg%3E';

  const handleClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    onToggleFavorite(movie);
  };

  return (
    <div
      className="movie-card"
      onClick={handleClick}
    >
      <img 
        className="movie-poster" 
        src={posterUrl} 
        alt={movie.title}
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/500x750?text=No+Poster';
        }}
      />
      <div className="movie-info">
        <div className="movie-title">{movie.title}</div>
        <div className="movie-year">
          {movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}
        </div>
        <div className="movie-rating">
          <span className="rating-star">
            <i className="far fa-star"></i>
          </span>
          <span className="rating-value">{movie.vote_average?.toFixed(1) || 'N/A'} / 10 </span>
          <span className="rating-count">({movie.vote_count?.toLocaleString() || 0} votes)</span>
        </div>

        {/* Группа кнопок избранного */}
        <div className="favorite-buttons-group">
          {/* Иконка PLUS - активна только если НЕ в избранном */}
          <div
            className={`icon-wrapper ${!isFavorite ? 'active' : 'inactive'}`}
            onClick={!isFavorite ? handleFavoriteClick : undefined}
          >
            <i className="fa-solid fa-heart-circle-plus"></i>
            <span className="icon-label">Add</span>
          </div>

          {/* Иконка CHECK - всегда показывает статус "в избранном" */}
          <div className={`icon-wrapper ${isFavorite ? 'active-check' : 'neutral'}`}>
            <i className="fa-solid fa-heart-circle-check"></i>
            <span className="icon-label">Favorite</span>
          </div>

          {/* Иконка MINUS - активна только если В избранном */}
          <div
            className={`icon-wrapper ${isFavorite ? 'active-minus' : 'neutral'}`}
            onClick={isFavorite ? handleFavoriteClick : undefined}
          >
            <i className="fa-solid fa-heart-circle-minus"></i>
            <span className="icon-label">Delete</span>
          </div>
        </div>
      </div>
    </div>
  );
};