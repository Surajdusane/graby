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

    if (!cache) {
      return null;
    }

    // Parse the cache
    const parsedCache = JSON.parse(cache) as PersistedClient;
    
    // Find the specific query data
    const queryData = parsedCache.clientState.queries.find(
      (q) => q.queryKey[0] === queryKey
    );

    // Check if data exists and is not expired
    if (queryData && Date.now() - queryData.state.dataUpdatedAt < maxAge) {
      return queryData.state.data as T;
    }

    return null;
  } catch (error) {
    console.error('Error checking cache:', error);
    return null;
  }
}