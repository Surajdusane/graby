import { Button } from "@/components/ui/button";
import { useGetPost } from "../api/use-get-post";
import useGetUsername from "@/hooks/use-get-username";
import { Loader2 } from "lucide-react";
import handleFileDownload from "@/lib/fileHandler";
import { useDataTypeStore } from "../Hooks/use-data-type";
import { filterPosts } from "@/lib/filterData";

// Define the type for the post data (adjust based on your API response)
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

const DownloadDataButton = () => {
  const username = useGetUsername();
  const { isLoading, error, refetch } = useGetPost(username);
  const { data: dataType } = useDataTypeStore();

  /**
   * Handles the button click event.
   * Refetches data, applies filters, and triggers file download.
   */
  const onClickHandler = async () => {
    try {
      // Refetch the data and wait for the result
      const refetchResult = await refetch();

      // Ensure the refetch was successful and contains data
      if (!refetchResult.data) {
        throw new Error("No data available after refetch.");
      }

      const data = refetchResult.data.data as PostData[]; // Cast to the expected type
      const fileType = dataType;

      // Apply filters to the data
      const filteredData = filterPosts(
        data,
        ["video"], // mediaTypes
        {}, // dateFilter
        {}, // likesFilter
        {}, // viewsFilter
        {}, // commentsFilter
        {}, // durationFilter
        false // ignoreCarouselViews
      );

      // Trigger file download
      handleFileDownload(filteredData, fileType, username as string);
    } catch (err) {
      console.error("Error fetching or processing data:", err);
      alert("An error occurred while downloading the data. Please try again.");
    }
  };

  return (
    <Button
      disabled={isLoading}
      variant={error ? "destructive" : "default"}
      className="w-full"
      onClick={onClickHandler}
    >
      {error
        ? "Error"
        : isLoading
        ? <Loader2 className="animate-spin" />
        : "Download Data"}
    </Button>
  );
};

export default DownloadDataButton;