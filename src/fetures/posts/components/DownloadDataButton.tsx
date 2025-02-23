import { Button } from "@/components/ui/button";
import { useGetPost } from "../api/use-get-post";
import useGetUsername from "@/hooks/use-get-username";
import { Loader2 } from "lucide-react";
import handleFileDownload from "@/lib/fileHandler";
import { useDataTypeStore } from "../Hooks/use-data-type";
import { filterPosts } from "@/lib/filterData";
import { useFilterState } from "../Hooks/useFilterState";
import usegetFilterParameters from "../Hooks/use-get-filterPatamiters";
import { toast } from "sonner";
import Loader from "@/components/loader";

// Define the type for the post data (adjust based on your API response)
interface Post {
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
  const { filtername } = useFilterState();

  /**
   * Handles the button click event.
   * Refetches data, applies filters, and triggers file download.
   */
  if(isLoading) {
    return <Loader visible={isLoading} />
  }
  const onClickHandler = async () => {
    try {
      const refetchResult = await refetch();
      console.log("Fetched Data:", refetchResult.data); // Log fetched data
  
      if (!refetchResult.data) {
        throw new Error("No data available after refetch.");
      }
  
      const data = refetchResult.data.data as Post[];
      console.log("Parsed Data:", data); // Log parsed data
  
      const filterParameters = await usegetFilterParameters(filtername as string);
      console.log("Filter Parameters:", filterParameters); // Log filter parameters
  
      const filteredData = filterPosts(
        data,
        filterParameters.mediaTypes || [],
        filterParameters.dateFilter || {},
        filterParameters.likesFilter || {},
        filterParameters.viewsFilter || {},
        filterParameters.commentsFilter || {},
        filterParameters.durationFilter || {},
        filterParameters.ignoreCarouselViews || false
      );
      console.log("Filtered Data:", filteredData); // Log filtered data
  
      if (!filteredData || filteredData.length === 0) {
        toast.error("No posts found after applying filters.");
        return;
      }
  
      if (!dataType || !username) {
        console.error("Missing dataType or username");
        return;
      }
  
      handleFileDownload(filteredData, dataType, username as string);
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



