// Follow Types
export interface FollowResponseDto {
  success: boolean;
  message: string;
  data?: {
    followerId: number;
    followingId: number;
    createdAt: string;
  };
}

export interface FollowerDto {
  id: number;
  username: string;
  displayName: string;
  profileImageUrl?: string | null;
  bio?: string | null;
  verified?: boolean;
  followedAt: string;
  is_followed_by_me: boolean;
}

export interface FollowersListResponseDto {
  status: string;
  message: string;
  data: FollowerDto[];
  metadata: {
    totalItems: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface FollowingListResponseDto {
  status: string;
  message: string;
  data: FollowerDto[];
  metadata: {
    totalItems: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface FollowerYouKnowDto {
  id: number;
  username: string;
  displayName: string;
  bio?: string | null;
  profileImageUrl?: string | null;
  followedAt: string;
  isFollowingMe: boolean;
}

export interface FollowersYouKnowListResponseDto {
  status: string;
  message: string;
  data: FollowerYouKnowDto[];
  metadata: {
    totalItems: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Block Types
export interface BlockResponseDto {
  success: boolean;
  message: string;
  data?: {
    blockerId: number;
    blockedId: number;
    createdAt: string;
  };
}

export interface BlockedUserDto {
  id: number;
  username: string;
  displayName: string;
  profileImageUrl?: string | null;
  bio?: string | null;
  blockedAt: string;
}

export interface BlockedUsersListResponseDto {
  status: string;
  message: string;
  data: BlockedUserDto[];
  metadata: {
    totalItems: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Mute Types
export interface MuteResponseDto {
  success: boolean;
  message: string;
  data?: {
    muterId: number;
    mutedId: number;
    createdAt: string;
  };
}

export interface MutedUserDto {
  id: number;
  username: string;
  displayName: string;
  profileImageUrl?: string | null;
  bio?: string | null;
  mutedAt: string;
}

export interface MutedUsersListResponseDto {
  status: string;
  message: string;
  data: MutedUserDto[];
  metadata: {
    totalItems: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Common Params
export interface PaginationParams {
  page?: number;
  limit?: number;
}
