import { FetchUtils } from "../fetchutils";
import { HeadersUtils } from "../header";
import { ChromeStorageUtils } from "../cromeutils";

/**
 * Fetches all Instagram posts for a given username
 * @param {string} username - Instagram username to fetch posts for
 * @returns {Promise<Array|Object>} Array of posts or error object
 */
export async function fetchInstagramUserPost(username) {
  // Input validation
  if (!username || typeof username !== 'string') {
    console.error('Invalid username provided');
    return { error: 'Invalid username parameter' };
  }

  const chrome = new ChromeStorageUtils();
  const fetchFunc = new FetchUtils();
  const headersFunc = new HeadersUtils();

  const postData = [];
  const BASE_URL = 'https://i.instagram.com/api/v1/feed/user';
  const POSTS_PER_REQUEST = 12;
  const REQUEST_DELAY = 1500; // Delay between requests in milliseconds

  try {
    // Get Instagram cookies
    const cookies = await chrome.getAllCookies("https://instagram.com")
      .catch(error => {
        console.error('Failed to fetch cookies:', error);
        throw new Error('Cookie fetch failed');
      });

    // Get headers with cookies
    const headers = await headersFunc.getUserDataHeaders(cookies)
      .catch(error => {
        console.error('Failed to generate headers:', error);
        throw new Error('Header generation failed');
      });

    // Function to construct API URL
    const constructUrl = (maxId = '') => {
      const baseParams = `${username}/username/?count=${POSTS_PER_REQUEST}`;
      return `${BASE_URL}/${baseParams}${maxId ? `&max_id=${maxId}` : ''}`;
    };

    // Function to add delay between requests
    const delay = () => new Promise(resolve => setTimeout(resolve, REQUEST_DELAY));

    // Function to fetch and process data
    async function fetchBatch(maxId = '') {
      const url = constructUrl(maxId);
      const response = await fetchFunc.fetchWithRetry(url, { headers }, 5, 1000);

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      return response.json();
    }

    // Initial fetch
    let currentData = await fetchBatch();
    postData.push(...currentData.items);

    // Fetch remaining pages
    while (currentData.next_max_id) {
      try {
        // Add delay before next request
        await delay();

        currentData = await fetchBatch(currentData.next_max_id);
        postData.push(...currentData.items);

        console.log(`Fetched batch of ${currentData.items.length} posts. Total posts: ${postData.length}`);
      } catch (paginationError) {
        console.warn('Error fetching additional page:', paginationError);
        break; // Exit loop but return already collected data
      }
    }

    const finalPostData = [];
    postData.forEach(post => {
      try {
        // Skip posts without video_versions, carousel_media, or image_versions2
        if (!post.video_versions && !post.carousel_media && !post.image_versions2) {
          console.warn(`Skipping post ${post.pk || 'unknown'}: No video_versions, carousel_media, or image_versions2 found.`);
          return;
        }

        let downloadUrl = []; // Initialize as an empty array
        let mediaType = "image";

        // Determine media type
        if (post.video_versions ){
          mediaType = "video"; // Single video post
          downloadUrl.push(post.video_versions[0].url);
        }
        else if (post.image_versions2 && !post.video_versions && !post.carousel_media) {
          mediaType = "image"; // Single image post
          downloadUrl.push(post.image_versions2.candidates[0].url);
        }
        else if (post.carousel_media) {
          mediaType = "carousel"; // Mixed content
          post.carousel_media.forEach((carouselItem) => {
            
            if (carouselItem.video_versions ){
              downloadUrl.push(carouselItem.video_versions[0].url);
            }
            else if (carouselItem.image_versions2 && !carouselItem.video_versions) {
              downloadUrl.push(carouselItem.image_versions2.candidates[0].url);
            }
          })
        }

        
        // Push the processed post data into finalPostData
        finalPostData.push({
          date: post.taken_at || null,
          id: post.pk || null,
          code: post.code || null,
          media_type: mediaType, // Correctly determined media type
          caption: post.caption?.text || 'No caption available',
          views: post.video_versions && !post.like_and_view_counts_disabled ? post.ig_play_count || 0 : 0,
          comments: !post.like_and_view_counts_disabled ? post.comment_count || 0 : 0,
          likes: !post.like_and_view_counts_disabled ? post.like_count || 0 : 0,
          duration: post.video_versions ? post.video_duration || 0 : 0,
          url: post.video_versions && post.code
            ? `https://www.instagram.com/reel/${post.code}/`
            : post.code
            ? `https://www.instagram.com/p/${post.code}/`
            : null,
          download_url: downloadUrl.length > 0 ? downloadUrl : null, // Ensure it's always an array or null
        });
      } catch (error) {
        console.error(`Error processing post ${post.pk || 'unknown'}:`, error);
      }
    });

    return finalPostData;
  } catch (error) {
    console.error('Instagram data fetch failed:', error);

    // Return specific error messages based on error type
    if (error.message === 'Cookie fetch failed') {
      return { error: 'Failed to authenticate with Instagram' };
    }
    if (error.message === 'Header generation failed') {
      return { error: 'Failed to prepare request headers' };
    }
    if (error.message?.includes('API request failed')) {
      return { error: 'Instagram API request failed' };
    }

    return { error: 'Failed to fetch Instagram user data', details: error.message };
  }
}