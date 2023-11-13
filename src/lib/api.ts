import axios from "axios";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = import.meta.env.VITE_TMDB_API_URL;
export const IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_URL;

console.log(BASE_URL);

export type Movie = {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string; // or Date if you prefer to work with Date objects
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
};

type DefaultResponse = {
  page: number;
  total_pages: number;
  total_results: number;
};

export type GetPopularMoviesResponse = DefaultResponse & {
  results: Movie[];
};

export type SearchMoviesResponse = DefaultResponse & {
  result: Movie[];
};

// Get popular movies
export const getPopularMovies = async (page: number): Promise<Movie[]> => {
  const { data } = await axios.get<GetPopularMoviesResponse>(
    `${BASE_URL}/movie/popular`,
    {
      params: {
        page,
      },
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    }
  );

  return data.results;
};

// Search for movies
export const searchMovies = async (searchQuery: string): Promise<Movie[]> => {
  const { data } = await axios.get(`${BASE_URL}/search/movie`, {
    params: {
      query: searchQuery,
    },
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });

  return data.results;
};

// Get movie genres
export const getMovieGenres = async (): Promise<
  [
    {
      id: number;
      name: string;
    }
  ]
> => {
  const { data } = await axios.get(`${BASE_URL}/genre/movie/list`, {
    params: {
      language: "en-US",
    },
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });

  return data.genres;
};

// Get movie release dates
export const getMovieReleaseDates = () => {
  return axios.get(`${BASE_URL}/movie/release_dates?&language=en-US`);
};

// Get top rated movies
export const getTopRatedMovies = () => {
  return axios.get(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}`);
};

// Get popular movies with vote count greater than or equal to 1000
export const getPopularMoviesWithVoteCount = () => {
  return axios.get(
    `${BASE_URL}/movie/popular?api_key=${API_KEY}&vote_count.gte=1000`
  );
};
