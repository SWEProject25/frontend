# Features Structure & Development Guide

This guide documents the standard architecture and workflow for building features in this application. Each feature follows a consistent structure for API integration, state management, mocking, and testing.

## 📁 Standard Feature Structure

```
features/
└── [feature-name]/           # e.g., profile, authentication, settings
    ├── index.ts              # Barrel export - exports everything from the feature
    ├── README.md             # Feature-specific documentation
    │
    ├── components/           # React components specific to this feature
    │   ├── index.ts
    │   └── [ComponentName].tsx
    │
    ├── constants/            # Constants and configurations
    │   └── api.ts           # API endpoints and config
    │
    ├── hooks/               # Custom React hooks (TanStack Query)
    │   ├── index.ts
    │   ├── [featureName]Queries.ts  # TanStack Query hooks
    │   └── USAGE_EXAMPLES.ts        # Usage examples
    │
    ├── services/            # API service layer
    │   └── [featureName]Api.ts      # API methods (fetch calls)
    │
    ├── store/               # Zustand state management
    │   └── [featureName]Store.ts    # Zustand store
    │
    ├── mocks/               # Mock Service Worker (MSW) setup
    │   ├── index.ts
    │   ├── mockData.ts              # Mock data
    │   ├── handlers.ts              # MSW request handlers
    │   ├── server.ts                # MSW server (for tests)
    │   ├── browser.ts               # MSW worker (for browser)
    │   └── MSW_SETUP.md             # MSW documentation
    │
    ├── tests/               # All test files
    │   └── [featureName].test.ts
    │
    ├── types/               # TypeScript types
    │   ├── api.ts          # API request/response types
    │   ├── store.ts        # Store types
    │   └── index.ts        # Barrel export
    │
    └── utils/               # Utility functions
        └── index.ts
```

---

## 🔄 Development Workflow

### Step 1: Define API Types

Start by defining your API request/response types based on your backend API specification.

**File:** `types/api.ts`

```typescript
// Example from profile feature
export interface UserProfile {
  id: number;
  user_id: number;
  name: string;
  bio: string | null;
  // ... other fields
}

export interface ProfileResponseDto {
  status: string;
  message: string;
  data: UserProfile;
}

export interface UpdateProfileDto {
  name?: string;
  bio?: string;
  // ... other fields
}
```

---

### Step 2: Define API Configuration & Endpoints

**File:** `constants/api.ts`

```typescript
// Example from profile feature
export const PROFILE_API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  VERSION: process.env.NEXT_PUBLIC_API_VERSION || 'v1.0',
} as const;

export const PROFILE_ENDPOINTS = {
  GET_MY_PROFILE: `/api/${PROFILE_API_CONFIG.VERSION}/profile/me`,
  UPDATE_MY_PROFILE: `/api/${PROFILE_API_CONFIG.VERSION}/profile/me`,
  GET_PROFILE_BY_USER_ID: (userId: number) =>
    `/api/${PROFILE_API_CONFIG.VERSION}/profile/user/${userId}`,
  SEARCH_PROFILES: `/api/${PROFILE_API_CONFIG.VERSION}/profile/search`,
} as const;
```

---

### Step 3: Create API Service Layer

**File:** `services/[featureName]Api.ts`

```typescript
// Example from profile/services/profileApi.ts
import { ProfileResponseDto, UpdateProfileDto } from '../types/api';
import { PROFILE_API_CONFIG, PROFILE_ENDPOINTS } from '../constants/api';

class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public response?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = 'An error occurred';
    const statusCode = response.status;

    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      errorMessage = response.statusText || errorMessage;
    }

    throw new ApiError(errorMessage, statusCode);
  }

  return response.json();
}

export const profileApi = {
  async getMyProfile(): Promise<ProfileResponseDto> {
    const response = await fetch(
      `${PROFILE_API_CONFIG.BASE_URL}${PROFILE_ENDPOINTS.GET_MY_PROFILE}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Important for HTTPOnly cookies
      }
    );

    return handleResponse<ProfileResponseDto>(response);
  },

  async updateMyProfile(data: UpdateProfileDto): Promise<ProfileResponseDto> {
    const response = await fetch(
      `${PROFILE_API_CONFIG.BASE_URL}${PROFILE_ENDPOINTS.UPDATE_MY_PROFILE}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      }
    );

    return handleResponse<ProfileResponseDto>(response);
  },
};
```

---

### Step 4: Create Zustand Store

**File:** `store/[featureName]Store.ts`

```typescript
// Example from profile/store/profileStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile } from '../types/api';

interface ProfileStore {
  // State
  currentProfile: UserProfile | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setCurrentProfile: (profile: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearProfile: () => void;
}

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      // State
      currentProfile: null,
      isLoading: false,
      error: null,

      // Actions
      setCurrentProfile: (profile) => {
        set({ currentProfile: profile, error: null });
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      setError: (error) => {
        set({ error });
      },

      clearProfile: () => {
        set({ currentProfile: null, error: null, isLoading: false });
      },
    }),
    {
      name: 'profile-storage', // localStorage key
      partialize: (state) => ({
        currentProfile: state.currentProfile, // Only persist currentProfile
      }),
    }
  )
);
```

---

### Step 5: Create TanStack Query Hooks

**File:** `hooks/[featureName]Queries.ts`

```typescript
// Example from profile/hooks/profileQueries.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { profileApi } from '../services/profileApi';
import { UpdateProfileDto, ProfileResponseDto } from '../types/api';
import { useProfileStore } from '../store/profileStore';

// Query keys for cache management
export const PROFILE_QUERY_KEYS = {
  myProfile: ['profile', 'me'] as const,
  profileByUserId: (userId: number) => ['profile', 'user', userId] as const,
};

// Query hook - GET requests
export const useMyProfile = () => {
  const { setCurrentProfile, setLoading, setError } = useProfileStore();

  return useQuery<ProfileResponseDto, Error>({
    queryKey: PROFILE_QUERY_KEYS.myProfile,
    queryFn: async () => {
      setLoading(true);
      try {
        const response = await profileApi.getMyProfile();
        setCurrentProfile(response.data);
        setError(null);
        return response;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to fetch profile';
        setError(errorMessage);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

// Mutation hook - POST/PATCH/DELETE requests
export const useUpdateMyProfile = () => {
  const queryClient = useQueryClient();
  const { setCurrentProfile, setLoading, setError } = useProfileStore();

  return useMutation<ProfileResponseDto, Error, UpdateProfileDto>({
    mutationFn: async (profileData) => {
      setLoading(true);
      try {
        const response = await profileApi.updateMyProfile(profileData);
        setCurrentProfile(response.data);
        setError(null);
        return response;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to update profile';
        setError(errorMessage);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: () => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({
        queryKey: PROFILE_QUERY_KEYS.myProfile,
      });
    },
  });
};
```

---

### Step 6: Create Mock Data

**File:** `mocks/mockData.ts`

```typescript
// Example from profile/mocks/mockData.ts
import { UserProfile } from '../types/api';

export const mockCurrentUserProfile: UserProfile = {
  id: 1,
  user_id: 1,
  name: 'John Doe',
  birth_date: '1990-01-01T00:00:00.000Z',
  profile_image_url: 'https://i.pravatar.cc/150?img=12',
  bio: 'Software developer passionate about clean code',
  location: 'San Francisco, CA',
  website: 'https://johndoe.com',
  is_deactivated: false,
  created_at: '2025-01-01T00:00:00.000Z',
  updated_at: '2025-01-15T10:30:00.000Z',
  User: {
    id: 1,
    username: 'john_doe',
    email: 'john@example.com',
    role: 'USER',
    created_at: '2025-01-01T00:00:00.000Z',
  },
};

export const mockUserProfiles: UserProfile[] = [
  mockCurrentUserProfile,
  // ... more mock profiles
];

// Helper functions
export const getMockProfileById = (id: number): UserProfile | undefined => {
  return mockUserProfiles.find((profile) => profile.id === id);
};
```

---

### Step 7: Create MSW Handlers

**File:** `mocks/handlers.ts`

```typescript
// Example from profile/mocks/handlers.ts
import { http, HttpResponse } from 'msw';
import { PROFILE_API_CONFIG, PROFILE_ENDPOINTS } from '../constants/api';
import { mockCurrentUserProfile } from './mockData';

const buildUrl = (endpoint: string) =>
  `${PROFILE_API_CONFIG.BASE_URL}${endpoint}`;

export const profileHandlers = [
  // GET /api/v1.0/profile/me
  http.get(buildUrl(PROFILE_ENDPOINTS.GET_MY_PROFILE), () => {
    return HttpResponse.json({
      status: 'success',
      message: 'Profile retrieved successfully',
      data: mockCurrentUserProfile,
    });
  }),

  // PATCH /api/v1.0/profile/me
  http.patch(
    buildUrl(PROFILE_ENDPOINTS.UPDATE_MY_PROFILE),
    async ({ request }) => {
      const body = await request.json();

      // Validation
      if (body.website && !body.website.startsWith('http')) {
        return HttpResponse.json(
          {
            status: 'error',
            message: 'Website must be a valid URL',
            error: 'Bad Request',
          },
          { status: 400 }
        );
      }

      const updatedProfile = {
        ...mockCurrentUserProfile,
        ...body,
        updated_at: new Date().toISOString(),
      };

      return HttpResponse.json({
        status: 'success',
        message: 'Profile updated successfully',
        data: updatedProfile,
      });
    }
  ),
];
```

---

### Step 8: Setup MSW Server & Worker

**File:** `mocks/server.ts` (for Node.js/tests)

```typescript
import { setupServer } from 'msw/node';
import { profileHandlers } from './handlers';

export const server = setupServer(...profileHandlers);
```

**File:** `mocks/browser.ts` (for browser/development)

```typescript
import { setupWorker } from 'msw/browser';
import { profileHandlers } from './handlers';

export const worker = setupWorker(...profileHandlers);
```

**File:** `test/setup.ts` (enable MSW in tests)

```typescript
import { beforeAll, afterEach, afterAll } from 'vitest';
import { server } from '@/features/profile/mocks/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

---

### Step 9: Write Tests

**File:** `tests/[featureName].test.ts`

```typescript
// Example from profile/tests/profileMswHandlers.test.ts
import { describe, it, expect } from 'vitest';
import { PROFILE_API_CONFIG, PROFILE_ENDPOINTS } from '../constants/api';

describe('Profile API with MSW', () => {
  const baseUrl = PROFILE_API_CONFIG.BASE_URL;

  it('should fetch current user profile', async () => {
    const response = await fetch(
      `${baseUrl}${PROFILE_ENDPOINTS.GET_MY_PROFILE}`
    );
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.status).toBe('success');
    expect(data.data.name).toBe('John Doe');
  });

  it('should validate website URL on update', async () => {
    const response = await fetch(
      `${baseUrl}${PROFILE_ENDPOINTS.UPDATE_MY_PROFILE}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ website: 'invalid-url' }),
      }
    );
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toBe('Website must be a valid URL');
  });
});
```

---

## 🎯 Usage in Components

### Basic Query Hook Usage

```typescript
import { useMyProfile } from '@/features/profile/hooks';

function ProfileComponent() {
  const { data, isLoading, error, refetch } = useMyProfile();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>{data?.data.name}</h1>
      <p>{data?.data.bio}</p>
      <button onClick={() => refetch()}>Refresh</button>
    </div>
  );
}
```

### Mutation Hook Usage

```typescript
import { useUpdateMyProfile } from '@/features/profile/hooks';

function EditProfileComponent() {
  const updateProfile = useUpdateMyProfile();

  const handleUpdate = async () => {
    try {
      await updateProfile.mutateAsync({
        name: 'New Name',
        bio: 'Updated bio',
      });
      alert('Profile updated!');
    } catch (error) {
      alert('Update failed');
    }
  };

  return (
    <button onClick={handleUpdate} disabled={updateProfile.isPending}>
      {updateProfile.isPending ? 'Updating...' : 'Update Profile'}
    </button>
  );
}
```

### Using Zustand Store Directly

```typescript
import { useProfileStore } from '@/features/profile/store/profileStore';

function ProfileStatusComponent() {
  const { currentProfile, isLoading, error } = useProfileStore();

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {currentProfile && <p>Welcome, {currentProfile.name}!</p>}
    </div>
  );
}
```

---

## 📦 Barrel Exports

**File:** `index.ts` (feature root)

```typescript
// Export all types
export * from './types/api';
export * from './types/store';

// Export hooks
export * from './hooks';

// Export store
export * from './store/[featureName]Store';

// Export services
export * from './services/[featureName]Api';

// Export constants
export * from './constants/api';

// Export mocks (optional)
export * from './mocks';
```

---

## 🎨 Key Concepts

### 1. **Separation of Concerns**

- **Services**: Handle API communication
- **Stores**: Manage application state
- **Hooks**: Combine services + stores with React Query
- **Components**: Use hooks, remain UI-focused

### 2. **Type Safety**

- Define all API types first
- Use TypeScript interfaces for requests/responses
- Type all hooks, stores, and services

### 3. **Caching Strategy**

- Use TanStack Query for server state
- Use Zustand for client state
- Set appropriate `staleTime` for queries
- Invalidate queries on mutations

### 4. **Error Handling**

- Centralized error handling in `handleResponse`
- User-friendly error messages
- Propagate errors to UI through hooks

### 5. **Testing**

- Use MSW for network mocking
- Test at the network level (realistic)
- Test both success and error scenarios
- Test validation and edge cases

---

## 🔧 Environment Setup

### Required Packages

```json
{
  "dependencies": {
    "@tanstack/react-query": "^5.x",
    "zustand": "^4.x"
  },
  "devDependencies": {
    "msw": "^2.x",
    "vitest": "^1.x",
    "@testing-library/react": "^14.x"
  }
}
```

### TanStack Query Provider

```typescript
// lib/providers.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

---

## 📚 Best Practices

### ✅ DO:

- Keep API logic in services layer
- Use TanStack Query for server state
- Use Zustand for client state
- Write tests for all API interactions
- Use MSW for consistent mocking
- Follow the standard structure
- Export everything through index.ts
- Keep components simple and focused

### ❌ DON'T:

- Mix API calls directly in components
- Store server data in Zustand (use React Query)
- Skip error handling
- Forget to invalidate queries on mutations
- Mix concerns between layers
- Create custom fetch wrappers when React Query handles it

---

## 🚀 Quick Start Checklist

When creating a new feature:

1. ✅ Create folder structure
2. ✅ Define API types (`types/api.ts`)
3. ✅ Define API endpoints (`constants/api.ts`)
4. ✅ Create API service (`services/[name]Api.ts`)
5. ✅ Create Zustand store (`store/[name]Store.ts`)
6. ✅ Create TanStack Query hooks (`hooks/[name]Queries.ts`)
7. ✅ Create mock data (`mocks/mockData.ts`)
8. ✅ Create MSW handlers (`mocks/handlers.ts`)
9. ✅ Setup MSW server/worker (`mocks/server.ts`, `mocks/browser.ts`)
10. ✅ Write tests (`tests/[name].test.ts`)
11. ✅ Create barrel exports (`index.ts`)
12. ✅ Document in README.md

---

## 📖 Examples

The **Profile** feature is a complete reference implementation:

- Location: `/src/features/profile/`
- Includes all layers (services, store, hooks, mocks, tests)
- Fully documented with usage examples
- Production-ready code

Study this feature to understand the complete workflow!

---

## 🛠️ Tools & Libraries

- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Server State**: [TanStack Query](https://tanstack.com/query)
- **API Mocking**: [MSW](https://mswjs.io/)
- **Testing**: [Vitest](https://vitest.dev/)
- **React Testing**: [@testing-library/react](https://testing-library.com/react)
