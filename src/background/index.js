import { fetchInstagramUserData } from "./instagram/userInfo";
import { fetchInstagramUserPost } from "./instagram/userPost";

// Checking if the extension is installed
chrome.runtime.onInstalled.addListener(() => {
  console.log("I Extension Installed.");
});


// Listen for messages from popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getuser") {
    const username = request.username;
    fetchInstagramUserData(username)
      .then((data) => sendResponse(data))
      .catch((err) => sendResponse({ error: err.message }));
    return true;
  }
});

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getpost") {
    const username = request.username;

    fetchInstagramUserPost(username)
      .then((data) => {
        // Ensure the response has an `ok` property
        if (data.error) {
          sendResponse({ ok: false, error: data.error });
        } else {
          sendResponse({ ok: true, data });
        }
      })
      .catch((err) => {
        sendResponse({ ok: false, error: err.message });
      });

    // Indicate that the response will be sent asynchronously
    return true;
  }
});