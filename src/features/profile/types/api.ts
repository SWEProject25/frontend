// Profile API Types
export interface UserProfile {
  id: number;
  user_id: number;
  name: string;
  birth_date: string;
  profile_image_url?: string;
  banner_image_url?: string;
  bio: string | null;
  location: string | null;
  website: string | null;
  is_deactivated: boolean;
  created_at: string;
  updated_at: string;
  is_followed_by_me?: boolean;
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
