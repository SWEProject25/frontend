# User Interactions Hooks

This folder contains individual hooks for managing user interactions (follow, block, mute) with optimistic UI updates.

## 📁 Structure

```
userInteractions/
├── index.ts                 # Export all hooks
├── useFollow.ts            # Follow/unfollow functionality
├── useBlock.ts             # Block/unblock functionality
├── useMute.ts              # Mute/unmute functionality
├── useFollowLists.ts       # Followers & following lists
└── useBlockMuteLists.ts    # Blocked & muted users lists
```

## 🎯 Usage

### Individual Hooks (Recommended)

```typescript
import { useFollow } from '@/hooks/userInteractions';

function MyComponent() {
  const {
    followUser,
    unfollowUser,
    toggleFollow,
    getFollowState,
    isLoading,
    error,
  } = useFollow();

  const handleFollow = async () => {
    try {
      await followUser(userId);
    } catch (error) {
      // Error already handled with rollback
    }
  };
}
```

### Combined Hook (Backward Compatibility)

```typescript
import { useInteractions } from '@/hooks/useInteractions';

function MyComponent() {
  const {
    followUser,
    blockUser,
    muteUser,
    isFollowLoading,
    // ... all functions from all hooks
  } = useInteractions();
}
```

## 📚 Available Hooks

### `useFollow()`

Manages follow/unfollow operations with optimistic updates.

**Returns:**

- `followUser(userId)` - Follow a user
- `unfollowUser(userId)` - Unfollow a user
- `toggleFollow(userId, isFollowing)` - Toggle follow status
- `getFollowState(userId)` - Get current follow state from store
- `isFollowing` - Is currently following
- `isUnfollowing` - Is currently unfollowing
- `isLoading` - Combined loading state
- `error` - Error if any
- `isSuccess` - Success state

### `useBlock()`

Manages block/unblock operations with optimistic updates.

**Returns:**

- `blockUser(userId, userInfo?)` - Block a user (userInfo optional for optimistic update)
- `unblockUser(userId)` - Unblock a user
- `toggleBlock(userId, isBlocked)` - Toggle block status
- `isUserBlocked(userId)` - Check if user is blocked
- `isBlocking` - Is currently blocking
- `isUnblocking` - Is currently unblocking
- `isLoading` - Combined loading state
- `error` - Error if any
- `isSuccess` - Success state

### `useMute()`

Manages mute/unmute operations with optimistic updates.

**Returns:**

- `muteUser(userId, userInfo?)` - Mute a user (userInfo optional for optimistic update)
- `unmuteUser(userId)` - Unmute a user
- `toggleMute(userId, isMuted)` - Toggle mute status
- `isUserMuted(userId)` - Check if user is muted
- `isMuting` - Is currently muting
- `isUnmuting` - Is currently unmuting
- `isLoading` - Combined loading state
- `error` - Error if any
- `isSuccess` - Success state

### `useFollowers(userId, params?, enabled?)`

Fetches followers list with TanStack Query.

### `useFollowing(userId, params?, enabled?)`

Fetches following list with TanStack Query.

### `useBlockedUsers(params?, enabled?)`

Fetches blocked users list with TanStack Query.

### `useMutedUsers(params?, enabled?)`

Fetches muted users list with TanStack Query.

## ✨ Features

### 🚀 Optimistic UI Updates

All mutation hooks update the UI immediately before the API call completes.

### 🔄 Automatic Rollback

If an API call fails, the UI automatically reverts to the previous state.

### 💾 Persistent State

State is stored in Zustand with localStorage persistence.

### 🎯 Type Safety

Full TypeScript support with proper types.

### ⚡ Performance

Uses Map and Set data structures for O(1) lookups.

## 🔧 Integration with Store

All hooks integrate with the global `useInteractionStore` for state management:

```typescript
import { useInteractionStore } from '@/store/interactionStore';

// Direct store access
const isBlocked = useInteractionStore((state) => state.isUserBlocked(userId));
const followState = useInteractionStore((state) =>
  state.getFollowState(userId)
);
```

## 📝 Examples

### Follow Button Component

```typescript
import { useFollow } from '@/hooks/userInteractions';

export function FollowButton({ userId }: { userId: number }) {
  const { followUser, unfollowUser, getFollowState, isLoading } = useFollow();
  const isFollowing = getFollowState(userId);

  const handleClick = async () => {
    if (isFollowing) {
      await unfollowUser(userId);
    } else {
      await followUser(userId);
    }
  };

  return (
    <button onClick={handleClick} disabled={isLoading}>
      {isFollowing ? 'Unfollow' : 'Follow'}
    </button>
  );
}
```

### Block Button with Optimistic Update

```typescript
import { useBlock } from '@/hooks/userInteractions';

export function BlockButton({ user }: { user: User }) {
  const { blockUser, unblockUser, isUserBlocked, isLoading } = useBlock();
  const isBlocked = isUserBlocked(user.id);

  const handleBlock = async () => {
    // Pass user info for instant UI update
    await blockUser(user.id, {
      username: user.username,
      name: user.name,
      profile_image_url: user.profileImage,
    });
  };

  return (
    <button onClick={isBlocked ? () => unblockUser(user.id) : handleBlock} disabled={isLoading}>
      {isBlocked ? 'Unblock' : 'Block'}
    </button>
  );
}
```

## 🔗 Related Files

- `/src/store/interactionStore.ts` - Zustand store
- `/src/types/interactionTypes.ts` - TypeScript types
- `/src/hooks/userInteractionsQueries.ts` - TanStack Query hooks
- `/src/services/userInteractionsApi.ts` - API services
