# User Interactions Hooks

This directory contains all hooks related to user interactions (follow, block, mute).

## Structure

```
interactions/
├── index.ts                 # Main export file
├── queryKeys.ts            # React Query keys for caching
├── useInteractions.ts      # Main composite hook
├── useFollow.ts            # Follow/unfollow functionality
├── useBlock.ts             # Block/unblock functionality
├── useMute.ts              # Mute/unmute functionality
└── README.md               # This file
```

## Usage

### Simple Usage (Recommended)

For most use cases, use the main `useInteractions` hook:

```tsx
import { useInteractions } from '@/hooks/interactions';

function UserProfile({ userId, isFollowing }) {
  const {
    followUser,
    unfollowUser,
    toggleFollow,
    blockUser,
    muteUser,
    isAnyActionLoading,
    followError,
  } = useInteractions();

  const handleFollow = async () => {
    await toggleFollow(userId, isFollowing);
  };

  return (
    <button onClick={handleFollow} disabled={isAnyActionLoading}>
      {isFollowing ? 'Unfollow' : 'Follow'}
    </button>
  );
}
```

### Specific Functionality

If you only need specific functionality, import individual hooks:

```tsx
import { useFollow, useFollowers } from '@/hooks/interactions';

function FollowButton({ userId, isFollowing }) {
  const { toggleFollow, isLoading } = useFollow();

  return (
    <button
      onClick={() => toggleFollow(userId, isFollowing)}
      disabled={isLoading}
    >
      {isFollowing ? 'Unfollow' : 'Follow'}
    </button>
  );
}
```

### Fetching Lists

```tsx
import {
  useFollowers,
  useFollowing,
  useBlockedUsers,
} from '@/hooks/interactions';

function UserLists({ userId }) {
  const { data: followers, isLoading: loadingFollowers } = useFollowers(
    userId,
    {
      page: 1,
      limit: 20,
    }
  );

  const { data: following } = useFollowing(userId);
  const { data: blockedUsers } = useBlockedUsers();

  // Render lists...
}
```

## Available Hooks

### Main Hooks

- **`useInteractions()`** - Composite hook with all interaction functionality
- **`useFollow()`** - Follow/unfollow functionality
- **`useBlock()`** - Block/unblock functionality
- **`useMute()`** - Mute/unmute functionality

### List Hooks

- **`useFollowers(userId, params?, enabled?)`** - Fetch followers list
- **`useFollowing(userId, params?, enabled?)`** - Fetch following list
- **`useBlockedUsers(params?, enabled?)`** - Fetch blocked users list
- **`useMutedUsers(params?, enabled?)`** - Fetch muted users list

### Low-Level Hooks

If you need more control, you can use the low-level mutation hooks:

- `useFollowUser()` - Follow mutation
- `useUnfollowUser()` - Unfollow mutation
- `useBlockUser()` - Block mutation
- `useUnblockUser()` - Unblock mutation
- `useMuteUser()` - Mute mutation
- `useUnmuteUser()` - Unmute mutation

## Return Values

### Action Functions

All action functions return a Promise and can be awaited:

```tsx
const { followUser } = useInteractions();

try {
  const response = await followUser(userId);
  console.log('Success:', response);
} catch (error) {
  console.error('Failed:', error);
}
```

### Loading States

- `isFollowing` - Following in progress
- `isUnfollowing` - Unfollowing in progress
- `isFollowLoading` - Either following or unfollowing
- `isBlocking` - Blocking in progress
- `isUnblocking` - Unblocking in progress
- `isBlockLoading` - Either blocking or unblocking
- `isMuting` - Muting in progress
- `isUnmuting` - Unmuting in progress
- `isMuteLoading` - Either muting or unmuting
- `isAnyActionLoading` - Any action in progress

### Error States

- `followError` - Follow/unfollow error
- `blockError` - Block/unblock error
- `muteError` - Mute/unmute error

### Success States

- `isFollowSuccess` - Follow/unfollow succeeded
- `isBlockSuccess` - Block/unblock succeeded
- `isMuteSuccess` - Mute/unmute succeeded

## Features

- ✅ Automatic cache invalidation
- ✅ Optimistic updates support (ready for implementation)
- ✅ Type-safe with TypeScript
- ✅ Error handling
- ✅ Loading states
- ✅ Success states
- ✅ Pagination support for lists
- ✅ Modular and tree-shakeable
- ✅ Easy to test

## Best Practices

1. **Use the composite hook** (`useInteractions`) for components that need multiple interaction types
2. **Use specific hooks** (`useFollow`, `useBlock`, `useMute`) when you only need one type
3. **Handle errors** appropriately in your components
4. **Show loading states** to improve UX
5. **Disable buttons** during actions to prevent duplicate requests

## Migration from Old Structure

If you're migrating from the old structure:

```tsx
// Old
import { useInteractions } from '@/hooks/useInteractions';

// New (same API!)
import { useInteractions } from '@/hooks/interactions';
```

The API is backward compatible, so no changes needed in your components!
