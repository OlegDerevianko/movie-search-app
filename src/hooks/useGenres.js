import { useState, useEffect } from 'react';
import axios from 'axios';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY || '1a8efebd82784333be8b30ab9d1728ae';
const BASE_URL = 'https://api.themoviedb.org/3';

export const useGenres = () => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/genre/movie/list`, {
          params: { api_key: API_KEY, language: 'en-EN' }
        });
        setGenres(response.data.genres);
      } catch (error) {
        console.error('Error loading genres:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGenres();
  }, []);

  return { genres, loading };
};