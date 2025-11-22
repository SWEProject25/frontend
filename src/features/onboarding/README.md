# Onboarding Feature

This feature handles the user onboarding flow after registration or login, including:

- Date of birth collection
- Interest selection
- Follow suggestions

## Structure

```
onboarding/
├── components/          # React components
│   ├── DateOfBirthModal.tsx
│   ├── InterestsModal.tsx
│   ├── FollowSuggestionsModal.tsx
│   ├── OnboardingFlow.tsx
│   └── index.ts
├── constants/          # API endpoints and configuration
│   └── api.ts
├── hooks/             # React hooks for data fetching and mutations
│   └── useOnboarding.ts
├── mocks/             # MSW mock handlers for testing
│   └── handlers.ts
├── services/          # API service layer
│   └── onboardingApi.ts
├── types/             # TypeScript type definitions
│   ├── api.ts
│   └── interests.ts
└── index.ts           # Public exports
```

## Components

### `OnboardingFlow`

Main orchestrator that determines which onboarding step to show based on user's completion status.

### `DateOfBirthModal`

Collects user's date of birth (required for account completion).

### `InterestsModal`

Allows users to select their interests to personalize their experience.

### `FollowSuggestionsModal`

Suggests users to follow based on interests and popular accounts.

## Hooks

### `useUpdateDateOfBirth()`

Mutation hook to update user's date of birth.

### `useGetInterests(enabled)`

Query hook to fetch available interests (only when enabled).

### `useUpdateInterests()`

Mutation hook to save user's selected interests.

### `useSuggestedUsers(params, enabled)`

Query hook to fetch suggested users to follow (only when enabled).

### `useFollowUser()`

Mutation hook to follow a user.

### `useUnfollowUser()`

Mutation hook to unfollow a user.

## Usage

```tsx
import { OnboardingFlow } from '@/features/onboarding';

function Layout() {
  return (
    <>
      <YourContent />
      <OnboardingFlow onComplete={() => console.log('Onboarding complete!')} />
    </>
  );
}
```

## API Integration

All API calls use React Query for caching and state management. The hooks automatically:

- Set loading states
- Handle errors
- Update the auth store with new user data
- Only fetch when needed (conditional queries)
