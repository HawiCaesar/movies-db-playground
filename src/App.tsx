import { useState } from 'react';
//import './App.css'
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';

// const authenticatedFetch = async () => {

//   try {
//     const response = await fetch(`https://api.themoviedb.org/3/authentication`, {
//       headers: {
//         'Authorization': `Bearer ${import.meta.env.VITE_THEMOVIEDB_API_KEY}`,
//         'accept': 'application/json'
//       }
//     })
//     await response.json()
//   } catch (error) {
//     console.error('Error authenticating for movies now playing:', error)
//     throw error
//   }
// }

type Movie = {
  id: number;
  title: string;
  poster_path: string;
};

const fetchMoviesNowPlaying = async () => {
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

const fetchMoviesSearch = async (search: string) => {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${search}`, {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_THEMOVIEDB_API_KEY}`,
        accept: 'application/json'
      }
    });
    return response.json();
  } catch (error) {
    console.error('Error fetching movies search:', error);
    throw error;
  }
};

function App() {
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['movies_now_playing'],
    queryFn: fetchMoviesNowPlaying
  });

  const { data: searchData, isLoading: searchLoading, error: searchError } = useQuery({
    queryKey: ['movies_search', debouncedSearch],
    queryFn: () => fetchMoviesSearch(debouncedSearch),
    enabled: debouncedSearch.length > 0
  })

  const movies = search ? searchData?.results : data?.results;


  // console.log(data.results[1]);
  // console.log(
  //   `https://image.tmdb.org/t/p/original${data.results[1].poster_path}`
  // );

  return (
    <div className='container mx-auto'>
      <div className='my-8'>
        <input
          type='text'
          placeholder='Search for a movie'
          className='w-full p-2 border border-gray-300 rounded-md'
          value={search}
          onChange={handleSearch}
        />
        <button className='bg-blue-500 text-white p-2 rounded-md' onClick={() => setSearch('')}>Clear</button>
      </div>
      <h1 className='text-center text-2xl font-bold mb-4'>
        {searchData ? 'Search Results' : 'Movies Now Playing'}
      </h1>

      {(isLoading || searchLoading) && <div className='text-center text-2xl font-bold mb-4'>Loading...</div>}
      {(error || searchError) && <div className='text-center text-2xl font-bold mb-4'>Error: {error?.message || searchError?.message}</div>}
      {movies?.length === 0 && <div className='text-center text-2xl font-bold mb-4'>No movies found</div>}
      
      <div className='grid grid-cols-3 gap-2'>
        {movies?.map((movie: Movie) => (
          <div key={movie.id} className=' my-4'>
            <h1 className='text-center mb-2 w-[250px] text-ellipsis overflow-hidden whitespace-nowrap'>{movie.title}</h1>
            <div className='w-[200px] h-[300px] mx-auto'>
              <img className='w-full h-full object-contain' src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
