// Suggested Users Types
export interface SuggestedUserProfile {
  name: string;
  bio?: string | null;
  profileImageUrl?: string | null;
  bannerImageUrl?: string | null;
  location?: string | null;
  website?: string | null;
}

export interface SuggestedUser {
  id: number;
  username: string;
  email: string;
  isVerified: boolean;
  profile: SuggestedUserProfile;
  followersCount: number;
  is_followed_by_me: boolean;
}

export interface SuggestedUsersResponseDto {
  status: string;
  message: string;
  total: number;
  data: {
    users: SuggestedUser[];
  };
}

// Trending Hashtags Types
export interface TrendingHashtag {
  tag: string;
  totalPosts: number;
}

export interface TrendingHashtagsResponseDto {
  status: string;
  data: {
    trending: TrendingHashtag[];
  };
  metadata: {
    HashtagsCount: number;
    limit: number;
    category: string;
  };
}
