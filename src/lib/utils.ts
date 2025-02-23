import { clsx, type ClassValue } from "clsx"
import { format, subDays } from "date-fns";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// src/utils/chromeUtils.ts

// Define a type for the expected response from the background script
interface BackgroundResponse {
  error?: string;  // Optional error property if something goes wrong
  [key: string]: any;  // To handle any other dynamic properties that might be returned
}

// Define the payload type for sending data to the background
interface SendMessagePayload {
  username: string | null; // You can extend this based on what other data you want to send
}

/**
 * A utility function to send a message to the background script and return a promise.
 * @param {string} action - The action to identify the type of request (e.g., 'getuser').
 * @param {SendMessagePayload} payload - The data to send with the message (e.g., { username: 'someuser' }).
 * @returns {Promise<BackgroundResponse>} - A promise that resolves with the response from the background script.
 */
export function sendMessageToBackground(
  action: string, 
  payload: SendMessagePayload
): Promise<BackgroundResponse> {
  if(!payload.username){
    return Promise.reject("Username is required");
  }
  return new Promise((resolve, reject) => {
    // Sending the message to the background script
    chrome.runtime.sendMessage({ action, ...payload }, (response) => {
      // Check if there's any error in the response
      if (chrome.runtime.lastError) {
        // Reject with the error message from chrome.runtime.lastError
        reject(new Error(chrome.runtime.lastError.message || 'Unknown error'));
      } else {
        resolve(response);  // Resolve with the response data from the background script
      }
    });
  });
}

export function extractInstagramUsername(text : string) {
  const patterns = [
      // Match full URLs
      /(?:https?:\/\/)?(?:www\.)?instagram\.com\/([A-Za-z0-9_](?:(?:[A-Za-z0-9_]|(?:\.(?!\.))){0,28}(?:[A-Za-z0-9_]))?)/i,
      // Match short URLs
      /(?:https?:\/\/)?(?:www\.)?instagr\.am\/([A-Za-z0-9_](?:(?:[A-Za-z0-9_]|(?:\.(?!\.))){0,28}(?:[A-Za-z0-9_]))?)/i,
      // Match direct mentions
      /@([A-Za-z0-9_](?:(?:[A-Za-z0-9_]|(?:\.(?!\.))){0,28}(?:[A-Za-z0-9_]))?)/i
  ];

  for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
          // Remove trailing slashes or paths
          const username = match[1].split('/')[0];
          return username;
      }
  }
  return null;
}


export function formatFollowersCount(count: number): string {
  if (count >= 1_000_000) {
    return (count / 1_000_000).toFixed(1) + 'M'; // Format in Millions (1,000,000 -> "1.0M")
  } else if (count >= 1_000) {
    return (count / 1_000).toFixed(1) + 'K'; // Format in Thousands (1,000 -> "1.0K")
  } else {
    return count.toString(); // No formatting for smaller numbers
  }
}


export function isInstagramAccountUrl(url: string): boolean {
  // Basic URL format validation
  if (!url || typeof url !== 'string') return false;

  // Ensure URL starts with http:// or https://
  if (!url.match(/^https?:\/\//i)) {
      // Try to add https:// if missing
      url = 'https://' + url;
  }

  // Basic URL format validation using regex
  const urlRegex = /^https?:\/\/(?:www\.)?instagram\.com\/[a-zA-Z0-9._]{1,30}\/?$/i;
  if (!urlRegex.test(url)) return false;

  try {
      const urlObject = new URL(url);
      
      // Check if it's an Instagram domain
      const isInstagramDomain = urlObject.hostname === 'instagram.com' || 
                              urlObject.hostname === 'www.instagram.com';
      if (!isInstagramDomain) return false;

      // Get the path without leading/trailing slashes
      const path = urlObject.pathname.replace(/^\/+|\/+$/g, '');
      
      // Split path into segments
      const segments = path.split('/');
      
      // Valid profile URLs should only have one segment (the username)
      if (segments.length !== 1) return false;
      
      // Check if the path is not one of Instagram's special pages
      const reservedPaths = [
          'explore',
          'p',
          'reels',
          'stories',
          'tags',
          'direct',
          'accounts',
          'settings',
          'signup',
          'login',
          'about',
          'users',
          'developer',
          'legal',
          'help'
      ];
      
      if (reservedPaths.includes(segments[0].toLowerCase())) return false;
      
      // Username validation based on Instagram's rules:
      // - 1-30 characters
      // - Can contain letters, numbers, underscores, and periods
      // - Cannot start or end with a period
      // - Cannot have consecutive periods
      const username = segments[0];
      
      if (username.length > 30 || username.length < 1) return false;
      if (username.includes('..')) return false;
      if (username.startsWith('.') || username.endsWith('.')) return false;
      
      const usernameRegex = /^[a-zA-Z0-9_][a-zA-Z0-9_.]*[a-zA-Z0-9_]$|^[a-zA-Z0-9_]$/;
      if (!usernameRegex.test(username)) return false;
      
      return true;
  } catch (error : any) {
      console.error("Error parsing URL:", error.message);
      return false;
  }
}

type MediaItem = {
  date: number;
  id: string;
  code: string;
  caption: string;
  views: number;
  comments: number;
  likes: number;
  duration: number;
  url: string;
  download_url: string[];
};

type ConvertedItem = {
  mediaType: string;
  link: string;
};

export function convertDataToDownloadableItems(data: MediaItem[]): ConvertedItem[] {
  return data.flatMap(item => 
    item.download_url.map(link => ({
      mediaType: 'image',  // assuming all items are images
      link: link
    }))
  );
}

type Period = {
  from: Date | string | undefined;
  to: Date | string | undefined;
};

export function formatDateRange(period?: Period) {
  const defaultTo = new Date();
  const defaultFrom = subDays(defaultTo, 30);

  if (!period?.from) {
    return `${format(defaultFrom, 'LLL dd')} - ${format(defaultTo, 'LLL dd, y')}`;
  }

  if (!period?.to) {
    return `${format(period.from, 'LLL dd')} - ${period.to && format(period.to, 'LLL dd, y')}`;
  }

  return `${format(period.from, 'LLL dd, y')} - ${format(period.to, 'LLL dd, y')}`;
}
