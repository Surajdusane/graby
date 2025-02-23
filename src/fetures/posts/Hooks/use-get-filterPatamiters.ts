/**
 * Retrieves filter parameters for the given filter name.
 */



interface FilterParameters {
    mediaTypes: string[];
    dateFilter: Record<string, any>;
    likesFilter: Record<string, any>;
    viewsFilter: Record<string, any>;
    commentsFilter: Record<string, any>;
    durationFilter: Record<string, any>;
    ignoreCarouselViews: boolean;
  }
  
  
  const getDefaultFilters = (): FilterParameters => ({
    mediaTypes: ["video", "image", "carousel"],
    dateFilter: { startingDate: "", endingDate: "" },
    likesFilter: { min: 0, max: Infinity },
    viewsFilter: { min: 0, max: Infinity },
    commentsFilter: { min: 0, max: Infinity },
    durationFilter: { },
    ignoreCarouselViews: false,
  });
  
  const usegetFilterParameters = async (fname: string): Promise<FilterParameters> => {
    if (!fname) {
      return getDefaultFilters();
    }
    try {
      const storedFilters = await chrome.storage.local.get("filter");
      const filterData = storedFilters.filter?.[fname];
      if (filterData) {
        return {
          ...getDefaultFilters(),
          ...filterData, // Spread actual filter data here
        };
      }
      return getDefaultFilters();
    } catch (error) {
      console.error("Error retrieving filter parameters:", error);
      return getDefaultFilters();
    }
  };
  
  /**
   * Saves filter parameters for the given filter name.
   */
  export const saveFilterParameters = async (
    fname: string,
    filters: FilterParameters
  ): Promise<void> => {
    try {
      const storedFilters = await chrome.storage.local.get("filter");
      const newData = {
        ...storedFilters.filter,
        [fname]: filters,
      };
      await chrome.storage.local.set({
        filter: newData,
      });
    } catch (error) {
      console.error("Error saving filter parameters:", error);
      throw error;
    }
  };
  
  export default usegetFilterParameters;