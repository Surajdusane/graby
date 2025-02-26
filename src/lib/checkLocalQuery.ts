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
      // Make sure cache is a string before parsing
      parsedCache = typeof cache === 'string' 
        ? JSON.parse(cache) 
        : (typeof cache === 'object' ? cache : null);
      
      if (!parsedCache) {
        console.warn('Invalid cache format');
        await chrome.storage.local.remove('queryCache');
        return null;
      }
    } catch (parseError) {
      console.error('Error parsing cache:', parseError);
      await chrome.storage.local.remove('queryCache');
      return null;
    }

    // Safely access queries array
    const queries = parsedCache?.clientState?.queries;
    if (!Array.isArray(queries)) {
      console.warn('Cache is missing valid queries array.');
      await chrome.storage.local.remove('queryCache');
      return null;
    }

    // Find the specific query data
    const queryData = queries.find((q) => 
      Array.isArray(q.queryKey) && 
      q.queryKey.length > 0 && 
      q.queryKey[0] === queryKey
    );

    // Check if query data exists
    if (queryData && queryData.state) {
      try {
        // Check if data has an error field
        const stateData = queryData.state.data;
        
        if (!stateData) {
          return null;
        }
        
        if (
          typeof stateData === 'object' &&
          stateData !== null &&
          'error' in stateData
        ) {
          console.warn(`Cache for queryKey "${queryKey}" contains an error in data. Cleaning cache.`);
          await chrome.storage.local.remove('queryCache');
          return null;
        }

        // Handle explicit error in state
        if (queryData.state.error) {
          console.warn(`Cache for queryKey "${queryKey}" contains an explicit error. Cleaning cache.`);
          await chrome.storage.local.remove('queryCache');
          return null;
        }

        // Check if data is not expired
        if (Date.now() - (queryData.state.dataUpdatedAt || 0) < maxAge) {
          return queryData.state.data as T;
        } else {
          console.log(`Cache for queryKey "${queryKey}" is expired.`);
          return null;
        }
      } catch (accessError) {
        console.error('Error accessing query data:', accessError);
        await chrome.storage.local.remove('queryCache');
        return null;
      }
    }

    // If no valid query data is found, return null
    return null;
  } catch (error) {
    console.error('Error checking cache:', error);
    await chrome.storage.local.remove('queryCache');
    return null;
  }
}