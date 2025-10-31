// Profile API Types
export interface UserProfile {
  id: number;
  user_id: number;
  name: string;
  birth_date: string;
  profile_image_url: string | null;
  banner_image_url: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  is_deactivated: boolean;
  created_at: string;
  updated_at: string;
  User: {
    id: number;
    username: string;
    email: string;
    role: string;
    created_at: string;
  };
}

export interface ProfileResponseDto {
  status: string;
  message: string;
  data: UserProfile;
}

export interface UpdateProfileDto {
  name?: string;
  birthDate?: string;
  profileImageUrl?: string;
  bannerImageUrl?: string;
  bio?: string;
  location?: string;
  website?: string;
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
