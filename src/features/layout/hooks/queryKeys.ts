export const LAYOUT_QUERY_KEYS = {
  suggestedUsers: (limit: number) =>
    ['layout', 'suggested-users', limit] as const,
  trendingHashtags: (limit: number) =>
    ['layout', 'trending-hashtags', limit] as const,
};
