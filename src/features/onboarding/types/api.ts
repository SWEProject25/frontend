// API Request/Response Types for onboarding
import { Interest } from './interests';

// Get Available Interests
export interface GetInterestsResponseDto {
  status: string;
  message: string;
  total: number;
  data: Interest[];
}

// Update Date of Birth
export interface UpdateDateOfBirthDto {
  dateOfBirth: string; // ISO date string YYYY-MM-DD
}

export interface UpdateDateOfBirthResponseDto {
  status: string;
  message: string;
  data: {
    id: number;
    user_id: number;
    name: string;
    birthDate: string;
    profileImageUrl: string | null;
    bannerImageUrl: string | null;
    bio: string | null;
    location: string | null;
    website: string | null;
    is_deactivated: boolean;
    createdAt: string;
    updatedAt: string;
    User: {
      id: number;
      username: string;
      email: string;
      role: string;
      created_at: string;
    };
    followersCount: number;
    followingCount: number;
  };
}

// Update Interests
export interface UpdateInterestsDto {
  interestIds: number[];
}

export interface UpdateInterestsResponseDto {
  status: string;
  message: string;
  savedCount: number;
  nextStep: string;
}

// Follow User
export interface FollowUserDto {
  userId: number;
}

export interface FollowUserResponseDto {
  status: string;
  message: string;
  data: {
    userId: number;
    isFollowing: boolean;
  };
}

// Unfollow User
export interface UnfollowUserDto {
  userId: number;
}

export interface UnfollowUserResponseDto {
  status: string;
  message: string;
  data: {
    userId: number;
    isFollowing: boolean;
  };
}

// Get suggested users to follow
export interface GetSuggestedUsersDto {
  limit?: number; // Default: 10
  excludeFollowed?: boolean; // Default: true for authenticated users
  excludeBlocked?: boolean; // Default: true for authenticated users
}

export interface SuggestedUser {
  id: number;
  username: string;
  email: string;
  isVerified: boolean;
  profile: {
    name: string;
    bio: string | null;
    profileImageUrl: string | null;
    bannerImageUrl: string | null;
    location: string | null;
    website: string | null;
  };
  followersCount: number;
}

export interface GetSuggestedUsersResponseDto {
  status: string;
  message: string;
  data: {
    users: SuggestedUser[];
  };
  total: number;
}
