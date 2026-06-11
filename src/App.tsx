import { useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import { fetchMoviesAPICall } from './lib/movies';
import Spinner from './assets/spinner.svg';

type Movie = {
  id: number;
  title: string;
  poster_path: string;
};



export function App() {
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const isSearchMode = debouncedSearch.length > 0;

  const { data, isLoading, error } = useQuery({
    queryKey: ['movies_now_playing'],
    queryFn: () => fetchMoviesAPICall('https://api.themoviedb.org/3/movie/now_playing')
  });

  const { data: searchData, isLoading: searchLoading, error: searchError } = useQuery({
    queryKey: ['movies_search', debouncedSearch],
    queryFn: () => fetchMoviesAPICall(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(debouncedSearch)}`),
    enabled: isSearchMode
  })

  const movies = debouncedSearch ? searchData?.results : data?.results;

  const activeError = isSearchMode ? searchError : error;
  const activeLoading = isSearchMode ? searchLoading : isLoading;

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
        {isSearchMode ? 'Search Results' : 'Movies Now Playing'}
      </h1>

      {activeLoading && <div className='text-center text-2xl font-bold mb-4 flex justify-center items-center'>
          <img src={Spinner} alt='Loading...' className='w-full h-full mx-auto' />
      </div>}
      {activeError && <div className='text-center text-2xl font-bold mb-4'>Error: {activeError?.message}</div>}
      {!activeLoading && movies?.length === 0 && <div className='text-center text-2xl font-bold mb-4'>No movies found</div>}
      
      <div className='grid grid-cols-3 gap-2'>
        {movies?.map((movie: Movie) => (
          <div key={movie.id} className=' my-4'>
            <h1 className='w-full text-center mb-2 w-[250px] text-ellipsis overflow-hidden whitespace-nowrap'>{movie.title}</h1>
            <div className='w-[200px] h-[300px] mx-auto'>
              <img className='w-full h-full object-contain' src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
