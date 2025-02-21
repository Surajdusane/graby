export function extractInstagramUsername(text) {
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

