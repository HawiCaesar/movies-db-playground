import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

describe('Movies Playground App component', () => {
  it('renders the App component', () => {
    render(<QueryClientProvider client={queryClient}><App /></QueryClientProvider>);
    expect(screen.getByText(/Movies Now Playing/i)).toBeInTheDocument();
  });

  it('should throw an error if data is not fetched', async() => {
    (globalThis).fetch = vi.fn(() => Promise.reject(new Error('Failed to fetch data')));
    

    // vi.mock('@tanstack/react-query', () => ({
    //   useQuery: vi.fn().mockReturnValue({
    //     data: null,
    //     isLoading: false,
    //     error: new Error('Failed to fetch data')
    //   })
    // }));

   // queryClient.setQueryData(['movies_now_playing'], () => Promise.reject(new Error('Failed to fetch data')));
    
    render(<QueryClientProvider client={queryClient}><App /></QueryClientProvider>);

    await waitFor(() => {
      expect(screen.getByText(/Error: Failed to fetch data/i)).toBeInTheDocument();
    })
    
  });
});