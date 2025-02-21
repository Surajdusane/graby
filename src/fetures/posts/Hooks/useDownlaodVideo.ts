import JSZip from "jszip";
import { useState } from "react";
import { saveAs } from 'file-saver';

// Interface for PostData
interface PostDataProps {
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

interface MediaItemProps {
    url : string;
    name : string;
}

interface NamingSchema {
  date?: boolean;
  id?: boolean;
  code?: boolean;
  views?: boolean;
  comments?: boolean;
  likes?: boolean;
  duration?: boolean;
}

const useDownlaodVideo = (
  zipName: string | null,
  namingSchema?: NamingSchema
) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEmpty, setIsEmpty] = useState(false); // State to track if the ZIP is empty
  const [progress, setProgress] = useState(0); // State to track real-time progress

  // Early return with default values if zipName is null
  if (zipName == null) {
    return {
      downloadMedia: () => {},
      loading: false,
      error: null,
      isEmpty: false,
      progress: 0,
    };
  }

  const generateFileName = (
    item: PostDataProps,
    index: number,
    schema?: NamingSchema,
    carouselIndex?: number
  ): string => {
    const parts: string[] = [];

    if (schema?.date)
        parts.push(new Date(item.date * 1000).toString());
    if (schema?.id) parts.push(item.id);
    if (schema?.code) parts.push(item.code);
    if (schema?.views) parts.push(`views_${item.views}`);
    if (schema?.comments) parts.push(`comments_${item.comments}`);
    if (schema?.likes) parts.push(`likes_${item.likes}`);
    if (schema?.duration) parts.push(`duration_${item.duration}`);

    if (carouselIndex !== undefined) {
      parts.push(`video${index}_${carouselIndex}`);
    } else {
      parts.push(`video${index}`);
    }

    return parts.join("_");
  };

  const downloadMedia = async (PostData: PostDataProps[]) => {
    setLoading(true);
    setError(null);
    setIsEmpty(false);
    setProgress(0);
  
    const mediaItems: MediaItemProps[] = [];
    PostData.forEach((post, index) => {
      if (post.media_type === "video") {
        mediaItems.push({
          name: generateFileName(post, index, namingSchema),
          url: post.download_url[0],
        });
      } else if (post.media_type === "carousel") {
        post.download_url.forEach((url, carouselIndex) => {
          mediaItems.push({
            name: generateFileName(post, index, namingSchema, carouselIndex),
            url: url,
          });
        });
      }
    });
  
    if (mediaItems.length === 0) {
      setIsEmpty(true);
      setLoading(false);
      return;
    }
  
    const zip = new JSZip();
    let completedCount = 0;
  
    try {
      const mediaPromises = mediaItems.map(async (item, index) => {
        try {
            if (item.url.includes('jpg?')) {
              return; // Skip reels
            }
          const response = await fetch(item.url, { mode: 'cors' });
          if (!response.ok) {
            return; // Skip this file
          }
          const blob = await response.blob();
          zip.file(`${item.name}.${blob.type.split('/')[1]}`, blob);
        } catch (err: any) {
          console.log(`Error fetching media item ${index + 1}:`, err.message);
        } finally {
          completedCount++;
          const currentProgress = Math.round((completedCount / mediaItems.length) * 100);
          setProgress(currentProgress);
        }
      });
  
      await Promise.all(mediaPromises);
  
      if (Object.keys(zip.files).length === 0) {
        setIsEmpty(true);
        setLoading(false);
        return;
      }
  
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `${zipName}.zip`);
    } catch (err: any) {
      console.error('Error during ZIP creation:', err);
      setError(`Error during ZIP creation: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return { downloadMedia, isEmpty, progress, loading, error };
};

export default useDownlaodVideo;