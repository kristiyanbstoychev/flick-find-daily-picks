
import { useState } from 'react';

interface Movie {
  id: number;
  title: string;
  overview: string;
  release_date: string;
}

interface TMDBResponse {
  results: Movie[];
  total_pages: number;
}

export const fetchedMovie: Movie = {
  id: '',
  title: '',
  overview: '',
  release_date: ''
}

export const useMovieApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [movie, setMovie] = useState<object>(null);

  const fetchRandomMovie = async (): Promise<string | object> => {
    setLoading(true);
    setError(null);

    try {
      // For demo purposes, we'll use a public API key
      // In a real app, this would come from secure environment variables
      const API_KEY = '4e44d9029b1270a757cddc766a1bcb63'; // Demo key
      
      // Generate random page between 1 and 500
      const randomPage = Math.floor(Math.random() * 500) + 1;
      
      const response = await fetch(
        `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&page=${randomPage}&api_key=${API_KEY}`
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data: TMDBResponse = await response.json();
      
      if (data.results && data.results.length > 0) {
        // Select a random movie from the results
        const randomIndex = Math.floor(Math.random() * data.results.length);
        const selectedMovie = data.results[randomIndex];
        setMovie(selectedMovie);
        return movie;
      } else {
        throw new Error('No movies found');
      }
    } catch (err) {
      console.error('Error fetching movie:', err);
      setError('Could not fetch movie. Try again.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchRandomMovie,
    loading,
    error
  };
};
