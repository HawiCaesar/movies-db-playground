export const fetchMoviesAPICall = async (url: string) => {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_THEMOVIEDB_API_KEY}`,
      accept: 'application/json'
    }
  });
  
  
  if (!response.ok) {
    let message = 'Failed to fetch movies API call';
    try {
      const body = await response.json();
      if (body.status_message) message = body.status_message;
    } catch (error) {
      console.error('Error fetching movies API call:', error);
    }
    throw new Error(message);
  }

  return response.json();
}
