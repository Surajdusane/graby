/**
 * Filters posts based on the given criteria.
 */
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

export function filterPosts(
  posts: PostData[],
  mediaTypes: string[],
  dateFilter: { startingDate?: string; endingDate?: string },
  likesFilter: { min?: number; max?: number },
  viewsFilter: { min?: number; max?: number },
  commentsFilter: { min?: number; max?: number },
  durationFilter: { minimumduration?: string; maximumduration?: string },
  ignoreCarouselViews: boolean
): PostData[] {
  let filteredPosts = [...posts];

  // // Media Type Filter
  // if (mediaTypes.length > 0) {
  //   filteredPosts = filteredPosts.filter((post) =>
  //     mediaTypes.includes(post.media_type || "")
  //   );
  // }
  console.log("Filtered Posts:", mediaTypes); // Log filtered posts

  // Date Filter
  if (dateFilter.startingDate && dateFilter.endingDate) {
    const startDate = new Date(dateFilter.startingDate).getTime() / 1000;
    const endDate = new Date(dateFilter.endingDate).getTime() / 1000;
    filteredPosts = filteredPosts.filter(
      (post) =>
        post.date &&
        typeof post.date === "number" &&
        post.date >= startDate &&
        post.date <= endDate
    );
  }

  // Likes Filter
  if (likesFilter?.min !== undefined || likesFilter?.max !== undefined) {
    filteredPosts = filteredPosts.filter((post) => {
      const minCondition = likesFilter?.min !== undefined
        ? (post.likes || 0) >= likesFilter.min
        : true;
      const maxCondition = likesFilter?.max !== undefined
        ? (post.likes || 0) <= likesFilter.max
        : true;
      return minCondition && maxCondition;
    });
  }

  // Views Filter with Carousel Exception
  if (viewsFilter?.min !== undefined || viewsFilter?.max !== undefined) {
    filteredPosts = filteredPosts.filter((post) => {
      if (ignoreCarouselViews && post.media_type === "carousel") {
        return true;
      }
      const minCondition = viewsFilter?.min !== undefined
        ? (post.views || 0) >= viewsFilter.min
        : true;
      const maxCondition = viewsFilter?.max !== undefined
        ? (post.views || 0) <= viewsFilter.max
        : true;
      return minCondition && maxCondition;
    });
  }

  // Comments Filter
  if (commentsFilter?.min !== undefined || commentsFilter?.max !== undefined) {
    filteredPosts = filteredPosts.filter((post) => {
      const minCondition = commentsFilter?.min !== undefined
        ? (post.comments || 0) >= commentsFilter.min
        : true;
      const maxCondition = commentsFilter?.max !== undefined
        ? (post.comments || 0) <= commentsFilter.max
        : true;
      return minCondition && maxCondition;
    });
  }

  // Duration Filter
  if (durationFilter?.minimumduration && durationFilter?.maximumduration) {
    const minDuration = parseFloat(durationFilter.minimumduration);
    const maxDuration = parseFloat(durationFilter.maximumduration);
  
    filteredPosts = filteredPosts.filter((post) => {
      // Ignore duration for carousel posts if ignoreCarouselViews is true
      if (ignoreCarouselViews && post.media_type === "carousel") {
        return true;
      }
  
      // Apply duration filter only if the post has a valid duration
      return (
        post.duration &&
        typeof post.duration === "number" &&
        post.duration >= minDuration &&
        post.duration <= maxDuration
      );
    });
  }

  console.log("Filtered Posts:", filteredPosts); // Log filtered posts
  return filteredPosts;
}