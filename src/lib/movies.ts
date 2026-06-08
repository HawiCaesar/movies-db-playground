export const fetchMoviesNowPlaying = async () => {
  try {
    const response = await fetch(
      'https://api.themoviedb.org/3/movie/now_playing',
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_THEMOVIEDB_API_KEY}`,
          accept: 'application/json'
        }
      }
    );
    return response.json();
  } catch (error) {
    console.error('Error fetching movies now playing:', error);
    throw error;
  }
};

export const fetchMoviesSearch = async (search: string) => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${search}`,
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_THEMOVIEDB_API_KEY}`,
          accept: 'application/json'
        }
      }
    );
    return response.json();
  } catch (error) {
    console.error('Error fetching movies search:', error);
    throw error;
  }
};
