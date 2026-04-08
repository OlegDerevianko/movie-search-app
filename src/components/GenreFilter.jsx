import { useGenres } from '../hooks/useGenres';

export const GenreFilter = ({ selectedGenres, onGenreToggle }) => {
  const { genres, loading } = useGenres();

  if (loading) return <div className="genre-filter-skeleton">Loading genres...</div>;

  return (
    <div className="genre-filter">
      <h3>Filter by genre:</h3>
      <div className="genre-buttons">
        {genres.map(genre => (
          <button
            key={genre.id}
            className={`genre-btn ${selectedGenres.includes(genre.id) ? 'active' : ''}`}
            onClick={() => onGenreToggle(genre.id)}
          >
            {genre.name}
          </button>
        ))}
      </div>
    </div>
  );
};