import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import { App } from './App';
import { fetchMoviesAPICall } from './lib/movies';

vi.mock('./lib/movies', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./lib/movies')>();
  return {
    ...actual,
    fetchMoviesAPICall: vi.fn(),
  };
});

describe('Movies Playground App component', () => {

  let queryClient: QueryClient;
  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    vi.mocked(fetchMoviesAPICall).mockReset();
    vi.mocked(fetchMoviesAPICall).mockResolvedValue({ results: [
      {
        id: 1,
        title: '2 Fast 2 Furious',
        poster_path: '/test.jpg',
      },
      {
        id: 2,
        title: 'The Incredible Hulk',
        poster_path: '/test2.jpg',
      },
    ] });
  });

  it('renders the App component', async () => {
    render(<QueryClientProvider client={queryClient}><App /></QueryClientProvider>);

    await waitFor(() => {
      expect(screen.getByText(/Movies Now Playing/i)).toBeInTheDocument();
      expect(screen.getByText(/2 Fast 2 Furious/i)).toBeInTheDocument();
      expect(screen.getByText(/The Incredible Hulk/i)).toBeInTheDocument();
    });
  });

  it('should throw an error if data is not fetched', async() => {
    vi.mocked(fetchMoviesAPICall).mockRejectedValue(
      new Error('Failed to fetch data')
    );

    render(<QueryClientProvider client={queryClient}><App /></QueryClientProvider>);

    await waitFor(() => {
      expect(screen.getByText(/Error: Failed to fetch data/i)).toBeInTheDocument();
    })
    
  });

  it('should show the loading state', async () => {
    vi.mocked(fetchMoviesAPICall).mockResolvedValue({ results: [] });

    render(<QueryClientProvider client={queryClient}><App /></QueryClientProvider>);

    await waitFor(() => {
      //expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
      expect(screen.getByAltText(/Loading.../i)).toBeInTheDocument();
    });
  });
});