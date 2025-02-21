interface Cookie {
    name: string;
    value: string;
    domain: string;
    path: string;
    secure: boolean;
    httpOnly: boolean;
    expirationDate?: number;
  }
  
export class ChromeStorageUtils {
    // Gets the URL of the current active tab in the browser
    async getCurrentTabUrl(): Promise<string | null> {
      try {
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tabs || tabs.length === 0) {
          throw new Error("No active tab found.");
        }
  
        const currentTab = tabs[0];
        if (!currentTab.url) {
          throw new Error("Current tab does not have a URL.");
        }
  
        return currentTab.url;
      } catch (error : any) {
        console.error("Failed to retrieve current tab URL:", error.message);
        return null;
      }
    }
  
    // Gets all cookies for a specific URL
    async getAllCookies(url: string): Promise<Cookie[]> {
      if (!url) {
        console.error("URL is required to fetch cookies.");
        return [];
      }
  
      try {
        const cookies = await chrome.cookies.getAll({ url });
        if (!cookies) {
          throw new Error("No cookies found for the given URL.");
        }
  
        return cookies;
      } catch (error : any) {
        console.error(`Failed to fetch cookies for ${url}:`, error.message);
        return [];
      }
    }
  
    // Gets a specific cookie by name for a given URL
    async getSpecificCookie(url: string, name: string): Promise<Cookie | null> {
      if (!url || !name) {
        console.error("URL and cookie name are required.");
        return null;
      }
  
      try {
        const cookie = await chrome.cookies.get({ url, name });
        if (!cookie) {
          throw new Error(`Cookie '${name}' not found for the given URL.`);
        }
  
        return cookie;
      } catch (error : any) {
        console.error(`Failed to fetch cookie '${name}' for ${url}:`, error.message);
        return null;
      }
    }
  
    // Gets an item from the local storage
    async getLocalStorageItem(key: string): Promise<any> {
      if (!key) {
        console.error("Key is required to fetch from local storage.");
        return undefined;
      }
  
      try {
        const result = await chrome.storage.local.get(key);
        if (!result || result[key] === undefined) {
          throw new Error(`Key '${key}' not found in local storage.`);
        }
  
        return result[key];
      } catch (error : any) {
        console.error(`Failed to fetch key '${key}' from local storage:`, error.message);
        return undefined;
      }
    }
  
    // Sets an item in the local storage
    async setLocalStorageItem(key: string, value: any): Promise<boolean> {
      if (!key || value === undefined) {
        console.error("Key and value are required to set in local storage.");
        return false;
      }
  
      try {
        await chrome.storage.local.set({ [key]: value });
        return true;
      } catch (error : any) {
        console.error(`Failed to set key '${key}' in local storage:`, error.message);
        return false;
      }
    }
  
    // Gets an item from the session storage
    async getSessionStorageItem(key: string): Promise<any> {
      if (!key) {
        console.error("Key is required to fetch from session storage.");
        return undefined;
      }
  
      try {
        const result = await chrome.storage.session.get(key);
        if (!result || result[key] === undefined) {
          throw new Error(`Key '${key}' not found in session storage.`);
        }
  
        return result[key];
      } catch (error : any) {
        console.error(`Failed to fetch key '${key}' from session storage:`, error.message);
        return undefined;
      }
    }
  
    // Sets an item in the session storage
    async setSessionStorageItem(key: string, value: any): Promise<boolean> {
      if (!key || value === undefined) {
        console.error("Key and value are required to set in session storage.");
        return false;
      }
  
      try {
        await chrome.storage.session.set({ [key]: value });
        return true;
      } catch (error : any) {
        console.error(`Failed to set key '${key}' in session storage:`, error.message);
        return false;
      }
    }
  }
  
  // Example usage
//   const storageUtils = new ChromeStorageUtils();
  
//   async function doSomething() {
//     const url = await storageUtils.getCurrentTabUrl();
//     if (url) {
//       const cookies = await storageUtils.getAllCookies(url);
//       console.log("Cookies:", cookies);
  
//       const myValue = await storageUtils.getLocalStorageItem("myKey");
//       console.log("Local Storage Item:", myValue);
//     }
//   }
  
//   doSomething();
  