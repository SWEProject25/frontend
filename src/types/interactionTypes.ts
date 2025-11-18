// Types for interaction states
export interface InteractionUser {
  id: number;
  username: string;
  name: string;
  profile_image_url?: string;
  bio?: string;
  verified?: boolean;
}

export interface FollowState {
  userId: number;
  isFollowing: boolean;
  timestamp: number;
}

export interface BlockedUser extends InteractionUser {
  blockedAt: string;
}

export interface MutedUser extends InteractionUser {
  mutedAt: string;
}

export interface InteractionStore {
  // Follow states
  followStates: Map<number, boolean>;

  // Blocked users
  blockedUsers: BlockedUser[];
  blockedUserIds: Set<number>;

  // Muted users
  mutedUsers: MutedUser[];
  mutedUserIds: Set<number>;

  // Loading states
  isLoading: boolean;

  // Actions - Follow
  setFollowState: (userId: number, isFollowing: boolean) => void;
  getFollowState: (userId: number) => boolean | undefined;
  clearFollowState: (userId: number) => void;

  // Actions - Block
  addBlockedUser: (user: BlockedUser) => void;
  removeBlockedUser: (userId: number) => void;
  setBlockedUsers: (users: BlockedUser[]) => void;
  isUserBlocked: (userId: number) => boolean;

  // Actions - Mute
  addMutedUser: (user: MutedUser) => void;
  removeMutedUser: (userId: number) => void;
  setMutedUsers: (users: MutedUser[]) => void;
  isUserMuted: (userId: number) => boolean;

  // General actions
  setLoading: (loading: boolean) => void;
  clearAllStates: () => void;
}
