# Profile Feature

This folder contains all the profile-related functionality including API services, Zustand store, and TanStack Query hooks.

## Structure

```
profile/
├── constants/
│   └── api.ts              # API configuration and endpoints
├── hooks/
│   ├── index.ts            # Barrel export for all hooks
│   ├── profileQueries.ts   # TanStack Query hooks for profile operations
│   └── USAGE_EXAMPLES.ts   # Examples of how to use the hooks
├── services/
│   └── profileApi.ts       # API service methods
├── store/
│   └── profileStore.ts     # Zustand store for profile state
└── types/
    ├── api.ts              # API request/response types
    └── store.ts            # Store types
```

## Features

### 📦 API Service (`services/profileApi.ts`)

- `getMyProfile()` - Get current user's profile
- `updateMyProfile(data)` - Update current user's profile
- `getProfileByUserId(userId)` - Get profile by user ID
- `getProfileByUsername(username)` - Get profile by username
- `searchProfiles(params)` - Search profiles with pagination

### 🎣 TanStack Query Hooks (`hooks/profileQueries.ts`)

- `useMyProfile()` - Hook to fetch and cache current user's profile
- `useUpdateMyProfile()` - Mutation hook to update profile
- `useProfileByUserId(userId)` - Hook to fetch profile by user ID
- `useProfileByUsername(username)` - Hook to fetch profile by username
- `useSearchProfiles(params)` - Hook to search profiles

### 🏪 Zustand Store (`store/profileStore.ts`)

- Persists current user's profile to localStorage
- Manages loading and error states
- Syncs with TanStack Query operations

## Quick Start

### 1. Get Current User's Profile

```typescript
import { useMyProfile } from '@/features/profile/hooks';

function MyProfile() {
  const { data, isLoading, error } = useMyProfile();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>{data?.data.name}</h1>
      <p>{data?.data.bio}</p>
    </div>
  );
}
```

### 2. Update Profile

```typescript
import { useUpdateMyProfile } from '@/features/profile/hooks';

function EditProfile() {
  const updateProfile = useUpdateMyProfile();

  const handleUpdate = async () => {
    await updateProfile.mutateAsync({
      name: 'John Doe',
      bio: 'Updated bio',
    });
  };

  return (
    <button onClick={handleUpdate} disabled={updateProfile.isPending}>
      Update Profile
    </button>
  );
}
```

### 3. View Another User's Profile

```typescript
import { useProfileByUsername } from '@/features/profile/hooks';

function UserProfile({ username }: { username: string }) {
  const { data, isLoading } = useProfileByUsername(username);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>{data?.data.name}</h1>
      <p>@{data?.data.User.username}</p>
    </div>
  );
}
```

### 4. Search Users

```typescript
import { useSearchProfiles } from '@/features/profile/hooks';

function SearchUsers({ query }: { query: string }) {
  const { data, isLoading } = useSearchProfiles({
    query,
    page: 1,
    limit: 10,
  });

  return (
    <div>
      {data?.data.map((profile) => (
        <div key={profile.id}>{profile.name}</div>
      ))}
    </div>
  );
}
```

## API Endpoints

All endpoints are defined in `constants/api.ts`:

- `GET /api/v1.0/profile/me` - Get current user profile
- `PATCH /api/v1.0/profile/me` - Update current user profile
- `GET /api/v1.0/profile/user/{userId}` - Get profile by user ID
- `GET /api/v1.0/profile/username/{username}` - Get profile by username
- `GET /api/v1.0/profile/search` - Search profiles

## Type Safety

All API requests and responses are fully typed:

```typescript
// Update profile with type safety
const updateData: UpdateProfileDto = {
  name: 'John Doe',
  bio: 'Software Developer',
  location: 'San Francisco',
};

await updateProfile.mutateAsync(updateData);
```

## Caching Strategy

- Profile data is cached for 5 minutes (staleTime)
- Search results are cached for 2 minutes
- Automatic cache invalidation on profile updates
- Current user profile is persisted to localStorage via Zustand

## Error Handling

All API errors are handled gracefully with user-friendly messages:

```typescript
const { data, error } = useMyProfile();

if (error) {
  // Error message is already formatted
  console.error(error.message); // e.g., "Profile not found"
}
```
