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
