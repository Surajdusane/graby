import ContentPage from "./content";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import type { Persister, PersistedClient } from '@tanstack/react-query-persist-client';

// Custom persister for Chrome extension storage
const createChromeStoragePersister = (): Persister => {
  return {
    async persistClient(persistedClient: PersistedClient) {
      await chrome.storage.local.set({ 
        queryCache: JSON.stringify(persistedClient) 
      });
    },
    async restoreClient(): Promise<PersistedClient | undefined> {
      const result = await chrome.storage.local.get('queryCache');
      if (!result.queryCache) return undefined;
      return JSON.parse(result.queryCache) as PersistedClient;
    },
    async removeClient() {
      await chrome.storage.local.remove('queryCache');
    }
  };
};

const App = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: 1000 * 60 * 60 * 2, // 2 hours
        staleTime: 1000 * 60 * 60 * 2, // 2 hours
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
      },
    },
  });

  // Create custom persister for Chrome storage
  const persister = createChromeStoragePersister();

  persistQueryClient({
    queryClient,
    persister,
    maxAge: 1000 * 60 * 60 * 2, // 2 hours
  });

  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <ContentPage />
      </QueryClientProvider>
    </div>
  );
};

export default App;