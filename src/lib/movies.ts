export const fetchMoviesNowPlaying = async () => {

  const response = await fetch(
    'https://api.themoviedb.org/3/movie/now_playing',
    {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_THEMOVIEDB_API_KEY}`,
        accept: 'application/json'
      }
    }
  );

  if (!response.ok) {
    let message = 'Failed to fetch movies now playing';
    try {
      const body = await response.json();
      // TMDB API returns a status_message if the request is not successful
      if (body.status_message) message = body.status_message;
    } catch (error) {
      // body wasn't JSON, so we throw the error
      console.error('Error fetching movies now playing:', error);
    }
    throw new Error(message);
  }
  
  return response.json();
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
