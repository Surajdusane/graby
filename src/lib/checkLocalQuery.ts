import type { PersistedClient } from '@tanstack/react-query-persist-client';

interface CacheConfig {
  queryKey: string;
  maxAge?: number;
}

export async function checkChromeStorageCache<T>({
  queryKey,
  maxAge = 1000 * 60 * 60 * 2 // Default 2 hours
}: CacheConfig): Promise<T | null> {
  try {
    // Get data from chrome storage
    const result = await chrome.storage.local.get('queryCache');
    const cache = result.queryCache;

    // If no cache exists, return null
    if (!cache) {
      return null;
    }

    // Parse the cache safely
    let parsedCache: PersistedClient;
    try {
      parsedCache = JSON.parse(cache);
    } catch (parseError) {
      console.error('Error parsing cache:', parseError);
      return null;
    }

    // Safely access queries array
    const queries = parsedCache?.clientState?.queries;
    if (!Array.isArray(queries)) {
      console.warn('Cache is missing valid queries array.');
      return null;
    }

    // Find the specific query data
    const queryData = queries.find((q) => q.queryKey[0] === queryKey);

    // Check if query data exists
    if (queryData) {
      try {
        // Check for errors in both `state.error` and `state.data.error`
        const hasError =
          queryData.state?.error || // Explicit error in state
          (queryData.state?.data &&
            typeof queryData.state.data === 'object' &&
            'error' in queryData.state.data); // Error embedded in data

        if (hasError) {
          console.warn(`Cache for queryKey "${queryKey}" contains an error. Treating as non-existent.`);
          return null; // Treat the cache as non-existent
        }

        // Check if data is not expired
        if (Date.now() - (queryData.state?.dataUpdatedAt || 0) < maxAge) {
          return queryData.state?.data as T;
        }
      } catch (accessError) {
        console.error('Error accessing query data:', accessError);
        return null;
      }
    }

    // If no valid query data is found, return null
    return null;
  } catch (error) {
    console.error('Error checking cache:', error);
    return null;
  }
}