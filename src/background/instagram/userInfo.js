import { FetchUtils } from "../fetchutils";
import { HeadersUtils } from "../header";
import { ChromeStorageUtils } from "../cromeutils";


// Fetch Instagram user data
export async function fetchInstagramUserData(username) {
  
  const chrome = new ChromeStorageUtils();
  const fetchFunc = new FetchUtils();
  const headersFunc = new HeadersUtils();
  
  try {
    // Step 1: Get cookies for instagram.com
    const cookies = await chrome.getAllCookies("https://instagram.com");

    // Step 2: Define API endpoint and headers
    const apiUrl = `https://i.instagram.com/api/v1/users/web_profile_info/?username=${username}`;
    const headers = await headersFunc.getUserDataHeaders(cookies);

    // Step 3: Make API request
    const response = await fetchFunc.fetchWithRetry(apiUrl, { headers }, 5, 1000);

    // Step 4: Parse and return user data
    const data = await response.json();
    
    return {
      full_name: data.data.user.full_name,
      username: data.data.user.username,
      id: data.data.user.id,
      followers: data.data.user.edge_followed_by.count,
      following: data.data.user.edge_follow.count,
      post: data.data.user.edge_owner_to_timeline_media.count,
      profile_picture: data.data.user.profile_pic_url_hd,
    };
  } catch (error) {
    console.error("Error fetching Instagram user data:", error);
    return { error: "Failed to fetch Instagram user data" };
  }
}