
import { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

// Interface for PostData
interface PostData {
  date: number;
  id: string;
  code: string;
  media_type: string; // Can be "image", "video", "carousel", etc.
  caption: string;
  views: number;
  comments: number;
  likes: number;
  duration: number;
  url: string;
  download_url: string[];
}

// Custom hook to download videos as a ZIP file with real-time progress updates
const useDownloadMediaAsZip = (zipName: string | null, namingSchema?: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEmpty, setIsEmpty] = useState(false); // State to track if the ZIP is empty
  const [progress, setProgress] = useState(0); // State to track real-time progress

  // Early return with default values if zipName is null
  if (zipName == null) {
    return { downloadMedia: () => {}, loading: false, error: null, isEmpty: false, progress: 0 };
  }

  // Function to download videos and create a ZIP file
  const downloadMedia = async (postData: PostData[]) => {
    setLoading(true);
    setError(null); // Reset error state
    setIsEmpty(false); // Reset isEmpty state
    setProgress(0); // Reset progress state

    const zip = new JSZip();
    try {
      // Extract all media URLs from PostData, filtering out images but keeping videos in carousels
      const mediaItems = postData.flatMap((post) => {
        const urls = Array.isArray(post.download_url) ? post.download_url : [];
        return urls
          .filter((url) => {
            const mediaType = getMediaTypeFromUrl(url);
            return mediaType === 'video'; // Only include videos
          })
          .map((url, index) => ({
            mediaType: getMediaTypeFromUrl(url),
            url,
            post, // Include the post data for naming
            isCarousel: post.media_type === 'carousel',
            carouselIndex: index + 1, // Index for carousel media
          }));
      });

      // Check if there are any media items to process
      if (mediaItems.length === 0) {
        setIsEmpty(true); // Set isEmpty to true if no media was added
        return;
      }

      // Fetch each media item (video) and add it to the ZIP
      let completedCount = 0;
      const mediaPromises = mediaItems.map(async (item, index) => {
        try {
          const response = await fetch(item.url);
          if (!response.ok) {
            throw new Error(`Failed to fetch media item ${index + 1}`);
          }
          const blob = await response.blob();

          // Generate the filename based on the naming schema
          let fileName = namingSchema
            ? generateFileName(item.post, item.carouselIndex, namingSchema)
            : item.post.code;

          // Append carousel index if it's a carousel media
          if (item.isCarousel) {
            fileName += `-${item.carouselIndex}c`;
          }

          // Add the file extension
          fileName += `.${getMediaExtension(item.url, item.mediaType)}`;
          zip.file(fileName, blob); // Add the media to the ZIP
        } catch (err) {
          console.error(`Failed to fetch media item ${index + 1}:`, err);
        } finally {
          completedCount++;
          const currentProgress = Math.round((completedCount / mediaItems.length) * 100);
          setProgress(currentProgress); // Update progress in real-time
        }
      });

      // Wait for all media to be fetched and added to the ZIP
      await Promise.all(mediaPromises);

      // Check if the ZIP file is empty
      if (Object.keys(zip.files).length === 0) {
        setIsEmpty(true); // Set isEmpty to true if no media was added
        return;
      }

      // Generate the ZIP file
      const content = await zip.generateAsync({ type: 'blob' });

      // Save the ZIP file using FileSaver.js
      saveAs(content, `${zipName}.zip`);
    } catch (err: any) {
      console.error('Error downloading media:', err.message);
      setError(err.message || 'An error occurred while downloading the media.');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to generate the filename based on the naming schema
  const generateFileName = (post: PostData, carouselIndex: number, namingSchema: string): string => {
    const placeholders: { [key: string]: string | number } = {
      '{date}': post.date,
      '{id}': post.id,
      '{code}': post.code,
      '{media_type}': post.media_type,
      '{views}': post.views,
      '{comments}': post.comments,
      '{likes}': post.likes,
      '{duration}': post.duration,
      '{url}': post.url,
      '{carousel_index}': carouselIndex,
    };

    // Replace placeholders in the naming schema with actual values
    let fileName = namingSchema;
    for (const [placeholder, value] of Object.entries(placeholders)) {
      fileName = fileName.replace(new RegExp(placeholder, 'g'), value.toString());
    }
    return fileName;
  };

  // Helper function to determine media type from URL
  const getMediaTypeFromUrl = (url: string): string => {
    const lowerCaseUrl = url.toLowerCase();
    if (/\.(mp4|mov|avi|mkv|webm)(?:\?|$)/.test(lowerCaseUrl)) {
      return 'video';
    } else if (/\.(jpg|jpeg|png|gif|bmp|webp)(?:\?|$)/.test(lowerCaseUrl)) {
      return 'image';
    }
    return 'unknown'; // Default case
  };

  // Helper function to extract the file extension based on media type (video or image)
  const getMediaExtension = (url: string, mediaType: string): string => {
    if (mediaType === 'video') {
      const videoExtensionMatch = url.match(/\.([a-zA-Z0-9]+)(?:\?|$)/);
      return videoExtensionMatch ? videoExtensionMatch[1] : 'mp4'; // Default to 'mp4' for videos
    } else if (mediaType === 'image') {
      const imageExtensionMatch = url.match(/\.([a-zA-Z0-9]+)(?:\?|$)/);
      return imageExtensionMatch ? imageExtensionMatch[1] : 'jpg'; // Default to 'jpg' for images
    }
    return 'bin'; // Default case
  };

  return { downloadMedia, loading, error, isEmpty, progress };
};

export default useDownloadMediaAsZip;