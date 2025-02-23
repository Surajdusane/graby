import JSZip from "jszip";
import { useState } from "react";
import { saveAs } from "file-saver";
import { debounce } from "lodash"

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
  url: string;
  name: string;
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

const sanitizeFilename = (filename: string): string => {
  return filename.replace(/[<>:"/\\|?*]/g, "_");
};

const useDownloadVideo = (
  zipName: string | null,
  namingSchema?: NamingSchema
) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEmpty, setIsEmpty] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);

  const debouncedSetProgress = debounce(setProgress, 100);

  if (zipName == null) {
    return {
      downloadMedia: () => {},
      loading: false,
      error: null,
      isEmpty: false,
      progress: 0,
      errors: [],
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
      parts.push(new Date(item.date * 1000).toISOString().split("T")[0]);
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
    return sanitizeFilename(parts.join("_"));
  };

  const downloadMedia = async (PostData: PostDataProps[]) => {
    setLoading(true);
    setError(null);
    setIsEmpty(false);
    setProgress(0);
    setErrors([]);

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
      setError("No valid media items found to download.");
      setLoading(false);
      return;
    }

    const zip = new JSZip();
    let completedCount = 0;

    try {
      const mediaPromises = mediaItems.map(async (item, index) => {
        try {
          if (item.url.includes("jpg")) {
            return;
          }
          if (item.url.includes("webp")) {
            return;
          }
          if (item.url.includes("png")) {
            return;
          }
          if (item.url.includes("gif")) {
            return;
          }
          if (item.url.includes("jpeg")) {
            return;
          }
          const response = await fetch(item.url, { mode: "cors" });
          if (!response.ok) {
            console.log(`Failed to fetch ${item.url}: ${response.statusText}`);
          }
          const blob = await response.blob();
          zip.file(`${item.name}.${blob.type.split("/")[1]}`, blob);
        } catch (err: any) {
          console.log(`Error fetching media item ${index + 1}:`, err.message);
          setErrors((prevErrors) => [
            ...prevErrors,
            `Error with ${item.name}: ${err.message}`,
          ]);
        } finally {
          completedCount++;
          debouncedSetProgress(
            Math.round((completedCount / mediaItems.length) * 100)
          );
        }
      });

      await Promise.all(mediaPromises);

      if (Object.keys(zip.files).length === 0) {
        setIsEmpty(true);
        setError("No valid media files were added to the ZIP.");
        setLoading(false);
        return;
      }

      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `${zipName}.zip`);
    } catch (err: any) {
      console.log("Error during ZIP creation:", err);
      setError(`Error during ZIP creation: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return { downloadMedia, isEmpty, progress, loading, error, errors };
};

export default useDownloadVideo;