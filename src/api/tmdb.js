import axios from 'axios';

const API_KEY = '1a8efebd82784333be8b30ab9d1728ae';
const BASE_URL = 'https://api.themoviedb.org/3';

// Функция для поиска фильмов по запросу
export const searchMovies = async (query, page = 1) => {
  try {
    const response = await axios.get(`${BASE_URL}/search/movie`, {
      params: {
        api_key: API_KEY,
        query: query,
        page: page,
        include_adult: false,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Movie search error:', error);
    return { results: [], total_pages: 0 };
  }
};
// Функция для получения популярных фильмов
export const getPopularMovies = async (page = 1) => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/popular`, {
      params: {
        api_key: API_KEY,
        page: page,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error loading popular movies:', error);
    return { results: [], total_pages: 0 };
  }
};
// Функция для получения деталей фильма, включая трейлеры и актерский состав
export const getMovieDetails = async (movieId) => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/${movieId}`, {
      params: {
        api_key: API_KEY,
        append_to_response: 'videos,credits',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error loading movie details:', error);
    return null;
  }
};
// Функция для получения трейлера фильма
export const getMovieVideos = async (movieId) => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/${movieId}/videos`, {
      params: {
        api_key: API_KEY,
      },
    });
    // Находим первый официальный трейлер на YouTube
    const trailer = response.data.results?.find(
      (video) => video.site === 'YouTube' && video.type === 'Trailer'
    );
    return trailer?.key || null;
  } catch (error) {
    console.error('Error loading trailer:', error);
    return null;
  }
};
// Функция для получения списка жанров
export const discoverMoviesByGenres = async (genreIds, page = 1) => {
  try {
    const genreParam = genreIds.join(',');
    const response = await axios.get(`${BASE_URL}/discover/movie`, {
      params: {
        api_key: API_KEY,
        with_genres: genreParam,
        page: page,
        sort_by: 'popularity.desc',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error filtering by genres:', error);
    return { results: [], total_pages: 0 };
  }
};
// Функция для получения фильмов с сортировкой и фильтрацией по жанрам
export const getMoviesWithSort = async (sortBy, page = 1, genreIds = [], year = null) => {
  try {
    const params = {
      api_key: API_KEY,
      page: page,
      sort_by: sortBy,
    };
    
    if (genreIds.length > 0) {
      params.with_genres = genreIds.join(',');
    }
    
    if (year) {
      params.primary_release_year = year;
    }
    
    const response = await axios.get(`${BASE_URL}/discover/movie`, { params });
    return response.data;
  } catch (error) {
    console.error('Ошибка сортировки:', error);
    return { results: [], total_pages: 0 };
  }
};
// Функция для получения провайдеров по региону и приоритету
export const getMovieWatchProviders = async (movieId) => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/${movieId}/watch/providers`, {
      params: {
        api_key: API_KEY,
      },
    });
    
    // Получаем провайдеров для разных регионов
    // Приоритет: RU > UA > US (если нужен английский интерфейс)
    const ruProviders = response.data.results?.RU;
    const uaProviders = response.data.results?.UA;
    const usProviders = response.data.results?.US;
    
    // Выбираем доступные провайдеры
    const providers = ruProviders || uaProviders || usProviders;
    
    return {
      flatrate: providers?.flatrate || [],  // По подписке
      rent: providers?.rent || [],          // Аренда
      buy: providers?.buy || [],             // Покупка
      link: providers?.link || null,         // Ссылка на TMDB страницу с провайдерами
    };
  } catch (error) {
    console.error('Error loading providers:', error);
    return null;
  }
};
// Новая функция для комбинированной фильтрации
export const discoverMoviesWithFilters = async (params) => {
  try {
    const response = await axios.get(`${BASE_URL}/discover/movie`, {
      params: {
        api_key: API_KEY,
        ...params,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Filters error:', error);
    return { results: [], total_pages: 0 };
  }
};
