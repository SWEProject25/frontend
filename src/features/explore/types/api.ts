import { TimelineFeed } from '@/features/timeline/types/api';

export interface ExploreSearchFeedDtoResponse {
  status: string;
  message: string;
  data: {
    posts: TimelineFeed[];
  };
  metadata: {
    totalItems: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
export interface ExploreTrendingFeedDtoResponse {
  status: string;
  data: {
    trending: Trend[];
  };
  metadata: {
    HashtagsCount: number;
    limit: number;
    category: string;
  };
}
export interface Trend {
  tag: string;
  totalPosts: number;
}
