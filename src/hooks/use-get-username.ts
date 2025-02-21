import { useState, useEffect } from "react";
import { ChromeStorageUtils } from "@/lib/cromeUtilsF";
import { extractInstagramUsername } from "@/lib/utils";

const cromeutils = new ChromeStorageUtils();

const useGetUsername = (): string | null => {
  const [username, setUsername] = useState<string | null>(null); // Default username

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const url = await cromeutils.getCurrentTabUrl();

        if (url) {
          // Extract and set the Instagram username
          const extractedUsername = extractInstagramUsername(url) as string;
          setUsername(extractedUsername);
        } else {
          // Set fallback username if no URL is found
          setUsername("instagram");
        }
      } catch (error) {
        // Handle any errors and set the fallback username
        console.error("Error fetching username:", error);
        setUsername("instagram"); // Fallback in case of error
      }
    };

    fetchUsername(); // Call the async function
  }, []); // Empty dependency array to only run once on mount

  return username; // Return the username state
};

export default useGetUsername;
