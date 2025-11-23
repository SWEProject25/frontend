// Profile API Types
export interface UserProfile {
  id: number;
  user_id: number;
  name: string;
  profile_image_url: string | null;
  banner_image_url: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  birth_date: string;
  is_deactivated: boolean;
  created_at: string;
  updated_at: string;
  is_followed_by_me: boolean;
  User: {
    id: number;
    username: string;
    email: string;
    role: string;
    created_at: string;
  };
  followers_count: number;
  following_count: number;
}

export interface ProfileResponseDto {
  status: string;
  message: string;
  data: UserProfile;
}

export interface UpdateProfileDto {
  name?: string;
  birth_date?: string;
  bio?: string;
  location?: string;
  website?: string;
  profile_image_url?: string;
  banner_image_url?: string;
}

export interface UpdateProfileImageDto {
  profile_image_url: string;
}

export interface UpdateBannerImageDto {
  banner_image_url: string;
}

export interface ProfileSearchResponseDto {
  status: string;
  message: string;
  data: UserProfile[];
  metadata: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface SearchProfilesParams {
  query: string;
  page?: number;
  limit?: number;
}

export interface Media {
  url: string;
  type: 'IMAGE' | 'VIDEO';
}
export interface ProfileTweet {
  userId: number;
  username: string;
  verified: boolean;
  name: string;
  avatar: string | null;
  postId: number;
  date: string;
  likesCount: number;
  retweetsCount: number;
  commentsCount: number;
  isLikedByMe: boolean;
  isFollowedByMe: boolean;
  isRepostedByMe: boolean;
  text: string;
  media: Media[];
}
export interface ProfileFeed extends ProfileTweet {
  isRepost: boolean;
  isQuote: boolean;
  originalPostData?: ProfileTweet;
}
export interface ProfileFeedDtoResponse {
  status: string;
  message: string;
  data: {
    posts: ProfileFeed[];
  };
}
