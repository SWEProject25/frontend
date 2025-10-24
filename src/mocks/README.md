# Shared MSW Mock Setup

This folder contains the centralized Mock Service Worker (MSW) configuration that combines handlers from all features across the application.

## Structure

```
src/mocks/
├── browser.ts         # Browser worker for development
├── server.ts          # Node server for tests
├── MSWProvider.tsx    # React provider component
└── index.ts           # Exports
```

## Files

### `browser.ts`

- Creates MSW worker for browser (development mode)
- Combines handlers from all features
- Used automatically by MSWProvider

### `server.ts`

- Creates MSW server for Node.js (test environment)
- Combines handlers from all features
- Used in `src/test/setup.ts`

### `MSWProvider.tsx`

- React component that initializes MSW in the browser
- Only runs in development mode
- Wrapped around the app in `src/app/layout.tsx`

## Usage

### In Tests

The MSW server is automatically configured in `src/test/setup.ts`:

```typescript
import { server } from '@/mocks/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### In Development

MSW is automatically enabled through `MSWProvider` in the root layout. No manual setup needed.

### Adding New Feature Handlers

1. Create handlers in your feature folder:

```typescript
// src/features/myFeature/mocks/handlers.ts
export const myFeatureHandlers = [
  http.get('/api/v1.0/myFeature', () => {...}),
];
```

2. Add to shared MSW setup:

```typescript
// src/mocks/browser.ts & src/mocks/server.ts
import { myFeatureHandlers } from '@/features/myFeature/mocks/handlers';

export const handlers = [
  ...profileHandlers,
  ...myFeatureHandlers, // Add your handlers here
];
```

## Current Features Using MSW

- **Profile** - User profile endpoints (`/api/v1.0/profile/*`)

## Notes

- MSW only runs in development and test environments
- Production builds don't include MSW code
- The service worker file is located at `public/mockServiceWorker.js`
- Unhandled requests are bypassed (no warnings for non-mocked endpoints)
