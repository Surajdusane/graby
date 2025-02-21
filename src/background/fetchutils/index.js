export class FetchUtils {
    /**
     * Fetch data with retry and delay between retries.
     * @param {string} url - The URL to fetch.
     * @param {Object} options - Fetch options (e.g., method, headers, body).
     * @param {number} maxRetries - Maximum number of retries (default: 5).
     * @param {number} retryDelay - Delay between retries in milliseconds (default: 1000ms).
     * @returns {Promise<Object>} - The response data or an error object.
     */
    async fetchWithRetry(
      url,
      options = {},
      maxRetries = 5,
      retryDelay = 1000
    ) {
      if (!url) {
        console.error("URL is required for fetch request.");
        return { error: "URL is required." };
      }
  
      if (typeof maxRetries !== "number" || maxRetries <= 0) {
        console.error("Max retries must be a positive number.");
        return { error: "Invalid max retries value." };
      }
  
      if (typeof retryDelay !== "number" || retryDelay <= 0) {
        console.error("Retry delay must be a positive number.");
        return { error: "Invalid retry delay value." };
      }
  
      let retryCount = 0;
  
      while (retryCount < maxRetries) {
        try {
          const response = await fetch(url, options);
  
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
  
          const data = response
          return data; // Success: return the data
        } catch (error) {
          retryCount++;
          console.error(`Attempt ${retryCount} failed:`, error.message);
  
          if (retryCount >= maxRetries) {
            console.error(`Max retries (${maxRetries}) reached.`);
            return { error: "Max retries reached. Request failed." };
          }
  
          // Wait for the retry delay before trying again
          console.log(`Retrying in ${retryDelay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
      }
  
      return { error: "Request failed after all retries." };
    }
  }
  
//   // Example usage:
//   const fetchUtils = new FetchUtils();
  
//   async function exampleUsage() {
//     const data = await fetchUtils.fetchWithRetry(
//       "https://jsonplaceholder.typicode.com/posts/1",
//       {}, // Fetch options
//       5, // Max retries: 5
//       1000 // Retry delay: 1 second
//     );
  
//     if (data.error) {
//       console.error("Error:", data.error);
//     } else {
//       console.log("Fetched Data:", data);
//     }
//   }
  
//   exampleUsage();