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
  name: string;
  profile_image_url?: string;
  bio?: string;
  blockedAt: string;
}

export interface BlockedUsersListResponseDto {
  success: boolean;
  data: {
    blockedUsers: BlockedUserDto[];
    total: number;
    page: number;
    limit: number;
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
  name: string;
  profile_image_url?: string;
  bio?: string;
  mutedAt: string;
}

export interface MutedUsersListResponseDto {
  success: boolean;
  data: {
    mutedUsers: MutedUserDto[];
    total: number;
    page: number;
    limit: number;
  };
}

// Common Params
export interface PaginationParams {
  page?: number;
  limit?: number;
}
