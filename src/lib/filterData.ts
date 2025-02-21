export function filterPosts(
  posts : Array<{ date: number, id: string, code: string, media_type: string, caption: string, views: number, comments: number, likes: number, duration: number, url: string, download_url: string[] }>,
  mediaTypes : string[],
  dateFilter : { startingDate?: string, endingDate?: string },
  likesFilter : { min?: number, max?: number },
  viewsFilter : { min?: number, max?: number },
  commentsFilter : { min?: number, max?: number },
  durationFilter : { minimumduration?: string, maximumduration?: string },
  ignoreCarouselViews : boolean
) {
  let filteredPosts = [...posts];

  // Media Type Filter
  if (mediaTypes.length > 0) {
    filteredPosts = filteredPosts.filter((post) =>
      mediaTypes.includes(post.media_type)
    );
  }

  // Date Filter
  if (dateFilter.startingDate && dateFilter.endingDate) {
    const startDate = parseInt(dateFilter.startingDate, 10);
    const endDate = parseInt(dateFilter.endingDate, 10);

    filteredPosts = filteredPosts.filter(
      (post) => post.date >= startDate && post.date <= endDate
    );
  }

  // Likes Filter
  if (likesFilter.min !== undefined || likesFilter.max !== undefined) {
    filteredPosts = filteredPosts.filter((post) => {
      const minCondition = likesFilter.min
        ? post.likes >= likesFilter.min
        : true;
      const maxCondition = likesFilter.max
        ? post.likes <= likesFilter.max
        : true;
      return minCondition && maxCondition;
    });
  }

  // Views Filter with Carousel Exception
  if (viewsFilter.min !== undefined || viewsFilter.max !== undefined) {
    filteredPosts = filteredPosts.filter((post) => {
      // Skip views filter for carousel posts if ignoreCarouselViews is true
      if (ignoreCarouselViews && post.media_type === "carousel") {
        return true;
      }

      const minCondition = viewsFilter.min
        ? post.views >= viewsFilter.min
        : true;
      const maxCondition = viewsFilter.max
        ? post.views <= viewsFilter.max
        : true;
      return minCondition && maxCondition;
    });
  }

  // Comments Filter
  if (commentsFilter.min !== undefined || commentsFilter.max !== undefined) {
    filteredPosts = filteredPosts.filter((post) => {
      const minCondition = commentsFilter.min
        ? post.comments >= commentsFilter.min
        : true;
      const maxCondition = commentsFilter.max
        ? post.comments <= commentsFilter.max
        : true;
      return minCondition && maxCondition;
    });
  }

  // Duration Filter
  if (
    durationFilter.minimumduration &&
    durationFilter.maximumduration
  ) {
    const minDuration = parseFloat(durationFilter.minimumduration);
    const maxDuration = parseFloat(durationFilter.maximumduration);

    filteredPosts = filteredPosts.filter(
      (post) => post.duration >= minDuration && post.duration <= maxDuration
    );
  }

  return filteredPosts;
}