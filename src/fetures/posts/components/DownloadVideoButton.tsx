import { Button } from "@/components/ui/button";
import useGetUsername from "@/hooks/use-get-username";
import { Loader2, AlertCircle, RefreshCcw } from "lucide-react";
import { useGetPost } from "../api/use-get-post";
import useDownlaodVideo from "../Hooks/useDownlaodVideo";
import ProgressDialog from "./ProgressDialog";
import { filterPosts } from "@/lib/filterData";

interface PostData {
  date: number;
  id: string;
  code: string;
  media_type: string;
  caption: string;
  views: number;
  comments: number;
  likes: number;
  duration: number;
  url: string;
  download_url: string[];
}

const DownloadVideoButton = () => {
  const username = useGetUsername();

  // Fetch posts
  const { isLoading: isFetching, error: fetchError, refetch } = useGetPost(username);

  // Download videos
  const { downloadMedia, progress, loading: isDownloading, error: downloadError } =
    useDownlaodVideo(username, {
      date: true,
    });

  // Handle button click
  const onClickHandler = async () => {
    try {
      // Refetch data
      const refetchResult = await refetch() as { data: { data: PostData[] } };
      if (!refetchResult.data) {
        throw new Error("No data available to download.");
      }

      // Apply filters to the data
            const filteredData = filterPosts(
              refetchResult.data.data,
              ["video"], // mediaTypes
              {}, // dateFilter
              {}, // likesFilter
              {}, // viewsFilter
              {}, // commentsFilter
              {}, // durationFilter
              false // ignoreCarouselViews
            );

      // Download media
      await downloadMedia(filteredData);
    } catch (err: any) {
      console.error("Error:", err.message);
    }
  };

  return (
    <>
      {/* Progress Dialog */}
      <ProgressDialog visible={isDownloading} progress={progress} />

      {/* Button */}
      <Button
        disabled={isFetching || isDownloading}
        variant={fetchError || downloadError ? "destructive" : "default"}
        className="w-full"
        onClick={onClickHandler}
        aria-label="Download Video"
      >
        {/* Loading State */}
        {isFetching && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isDownloading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}

        {/* Error States */}
        {fetchError && (
          <>
            <AlertCircle className="mr-2 h-4 w-4" />
            Error: Failed to fetch data
          </>
        )}
        {downloadError && (
          <>
            <AlertCircle className="mr-2 h-4 w-4" />
            Error: Failed to download media
          </>
        )}

        {/* Default State */}
        {!isFetching && !isDownloading && !fetchError && !downloadError && "Download Video"}

        {/* Retry Option */}
        {(fetchError || downloadError) && (
          <RefreshCcw
            className="ml-2 h-4 w-4 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering the button's onClick
              refetch();
            }}
          />
        )}
      </Button>
    </>
  );
};

export default DownloadVideoButton;