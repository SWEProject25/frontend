// Profile API Types
export interface UserProfile {
  id: number;
  userId: number;
  name: string;
  birthDate: string;
  profileImageUrl: string | null;
  bannerImageUrl: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  isDeactivated: boolean;
  createdAt: string;
  updatedAt: string;
  User: {
    id: number;
    username: string;
    email: string;
    role: string;
    createdAt: string;
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
