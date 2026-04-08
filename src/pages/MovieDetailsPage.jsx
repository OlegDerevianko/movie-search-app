import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieDetails, getMovieVideos, getMovieWatchProviders } from '../api/tmdb';
import { SkeletonDetails } from '../components/SkeletonDetails';
import { TrailerModal } from '../components/TrailerModal';
import { ToastNotification } from '../components/ToastNotification'; 
import { ImageWithFallback } from '../components/ImageWithFallback';

export const MovieDetailsPage = ({ onToggleFavorite, isFavorite }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trailerKey, setTrailerKey] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actors, setActors] = useState([]);
  const [notification, setNotification] = useState(null); 
  const [watchProviders, setWatchProviders] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const movieData = await getMovieDetails(id);
        const videoKey = await getMovieVideos(id);
        const providers = await getMovieWatchProviders(id);
        
        setMovie(movieData);
        setTrailerKey(videoKey);
        setWatchProviders(providers);
        
        if (movieData.credits?.cast) {
          setActors(movieData.credits.cast.slice(0, 10));
        }
      } catch (error) {
        console.error('Loading error:', error);
        setNotification({
          message: 'Failed to load movie details. Please try again.',
          type: 'error'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  const handleWatchTrailer = () => {
    if (trailerKey) {
      setIsModalOpen(true);
    } else {
      // Показываем кастомное уведомление вместо alert
      setNotification({
        message: 'The trailer for this film is not yet available.',
        type: 'info'
      });
    }
  };

  const handleFavoriteClick = () => {
    onToggleFavorite(movie);
    // Показываем уведомление о добавлении/удалении
    setNotification({
      message: currentIsFavorite 
        ? `${movie.title} has been removed from favorites.`
        : `${movie.title} has been added to favorites.`,
      type: 'success'
    });
  };

  const currentIsFavorite = isFavorite(movie?.id);

  if (loading) return <SkeletonDetails />;
  if (!movie) return <div className="error-message">Movie not found</div>;

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 750"%3E%3Crect width="500" height="750" fill="%232a2f3f"/%3E%3Ctext x="250" y="375" font-size="60" fill="%237f8c8d" text-anchor="middle"%3E🎬%3C/text%3E%3C/svg%3E';

  const hasProviders = watchProviders && (
    watchProviders.flatrate?.length > 0 ||
    watchProviders.rent?.length > 0 ||
    watchProviders.buy?.length > 0
  );

  return (
    <>
      {/* Уведомление */}
      {notification && (
        <ToastNotification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
          duration={3000}
        />
      )}
      <div className="movie-details">
        <button onClick={() => navigate(-1)} className="back-btn">
          <i className="fas fa-left-long"></i> Back
        </button>
        
        <div className="details-container">
          <div className='details-info-container'>
            <img 
              src={posterUrl} 
              alt={movie.title} 
              className="details-poster"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/500x750?text=No+Poster';
              }}
            />
            
            <div className="details-info">
              <h1>{movie.title}</h1>
              <p className="release-date">Year: {movie.release_date?.split('-')[0] || 'N/A'}</p>
              <div className="movie-rating details-movie-rating">                
                <i className="far fa-star rating-star"></i>                
                <span className="rating-value">{movie.vote_average?.toFixed(1) || 'N/A'} / 10 </span>
                <span className="rating-count">({movie.vote_count?.toLocaleString() || 0} votes)</span>
              </div>
              <p className="overview">{movie.overview || 'No description'}</p>              
              <div className="action-buttons">
                <button 
                  className="watch-trailer-btn"
                  onClick={handleWatchTrailer}
                >
                  <i className="fa-brands fa-youtube youtube-icon"></i> Watch trailer
                </button>
              </div>

              {/* Favorite container */}
              <div className="favorite-buttons-group details-favorites">
                <div
                  className={`icon-wrapper ${!currentIsFavorite ? 'active' : 'inactive'}`}
                  onClick={!currentIsFavorite ? handleFavoriteClick : undefined}
                >
                  <i className="fa-solid fa-heart-circle-plus"></i>
                  <span className="icon-label">Add</span>
                </div>

                <div className={`icon-wrapper ${currentIsFavorite ? 'active-check' : 'neutral'}`}>
                  <i className="fa-solid fa-heart-circle-check"></i>
                  <span className="icon-label">Favorite</span>
                </div>

                <div
                  className={`icon-wrapper ${currentIsFavorite ? 'active-minus' : 'neutral'}`}
                  onClick={currentIsFavorite ? handleFavoriteClick : undefined}
                >
                  <i className="fa-solid fa-heart-circle-minus"></i>
                  <span className="icon-label">Delete</span>
                </div>
              </div>
            </div>
          </div>

          {/* Watch Providers */}
          {hasProviders && (
            <div className="watch-providers-section">
              <h3>
                <i className="fas fa-tv"></i> Where to watch:
              </h3>
              
              {watchProviders.flatrate?.length > 0 && (
                <div className="provider-category">
                  <span className="provider-category-label">
                    <i className="fas fa-crown"></i> Subscription
                  </span>
                  <div className="provider-buttons">
                    {watchProviders.flatrate.map(provider => (
                      <a
                        key={provider.provider_id}
                        href={watchProviders.link || `https://www.themoviedb.org/movie/${movie.id}/watch`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="provider-btn subscription"
                        title={provider.provider_name}
                      >
                        <img 
                          src={`https://image.tmdb.org/t/p/w45${provider.logo_path}`}
                          alt={provider.provider_name}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                        <span>{provider.provider_name}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {watchProviders.rent?.length > 0 && (
                <div className="provider-category">
                  <span className="provider-category-label">
                    <i className="fas fa-dollar-sign"></i> Rent
                  </span>
                  <div className="provider-buttons">
                    {watchProviders.rent.map(provider => (
                      <a
                        key={provider.provider_id}
                        href={watchProviders.link || `https://www.themoviedb.org/movie/${movie.id}/watch`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="provider-btn rent"
                        title={provider.provider_name}
                      >
                        <img 
                          src={`https://image.tmdb.org/t/p/w45${provider.logo_path}`}
                          alt={provider.provider_name}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                        <span>{provider.provider_name}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {watchProviders.buy?.length > 0 && (
                <div className="provider-category">
                  <span className="provider-category-label">
                    <i className="fas fa-shopping-cart"></i> Buy
                  </span>
                  <div className="provider-buttons">
                    {watchProviders.buy.map(provider => (
                      <a
                        key={provider.provider_id}
                        href={watchProviders.link || `https://www.themoviedb.org/movie/${movie.id}/watch`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="provider-btn buy"
                        title={provider.provider_name}
                      >
                        <img 
                          src={`https://image.tmdb.org/t/p/w45${provider.logo_path}`}
                          alt={provider.provider_name}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                        <span>{provider.provider_name}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="provider-note">
                <i className="fas fa-external-link-alt"></i> 
                Click on any provider to see where to watch
              </div>
            </div>
          )}
          {/* Actors section */}
          {actors.length > 0 && (
            <div className="cast-section">
              <h3>Starring:</h3>
              <div className="cast-list">
                {actors.map(actor => (
                  <div key={actor.cast_id || actor.id} className="cast-card">
                    <ImageWithFallback 
                      src={actor.profile_path 
                        ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                        : null
                      }
                      alt={actor.name}
                      className="cast-image"
                    />
                    <div className="cast-name">{actor.name}</div>
                    <div className="cast-character">{actor.character}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Trailer Modal */}
      {trailerKey && (
        <TrailerModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          videoKey={trailerKey}
          title={movie.title}
        />
      )}
    </>
  );
};