import { useQuery } from '@tanstack/react-query';

/**
 * Function to fetch filter names from chrome.storage.local.
 */
async function fetchFilterNames() {
  return new Promise<string[]>((resolve, reject) => {
    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.local.get("filter", (result) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          // Extract filter names from the stored data
          const filters = result.filter || {};
          const names = Object.keys(filters);
          resolve(names);
        }
      });
    } else {
      reject(new Error("chrome.storage is not available."));
    }
  });
}

/**
 * Custom hook to fetch all filter names from chrome.storage.local using TanStack Query.
 */
function useFilterNames() {
  const { data: filterNames = [], isLoading, isError, error } = useQuery({
    queryKey : ['filterNames'],
    queryFn :fetchFilterNames
  });

  return { filterNames, loading: isLoading, error: isError ? error : null };
}

export default useFilterNames;
