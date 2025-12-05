# Notifications Feature

A complete, production-ready notification system for the Hankers social platform, inspired by X (Twitter).

## 🎯 Features

- **Real-time Updates**: REST API polling (30s intervals) for instant notifications
- **Firestore Integration**: Optional real-time subscriptions via WebSocket
- **Multiple Notification Types**: Like, Repost, Quote, Reply, Mention, Follow, DM
- **Infinite Scroll**: Efficient pagination with React Query
- **Optimistic Updates**: Instant UI updates with automatic rollback on error
- **Unread Counter**: Auto-updating badge showing unread count
- **Page Title Badge**: Shows unread count in browser tab title (e.g., "(3) Notifications / X")
- **Mark as Read**: Individual and bulk mark as read functionality
- **Filter Tabs**: All, Verified, Mentions (X-style interface)
- **Responsive Design**: Mobile-first, fully responsive UI
- **X/Twitter Design**: Pixel-perfect dark theme matching Twitter/X

## � Current Implementation Status

✅ **Working**: REST API integration with polling  
✅ **Working**: Unread count badge with auto-refresh  
✅ **Working**: Infinite scroll pagination  
✅ **Working**: Mark as read (optimistic updates)  
✅ **Working**: 3-column layout integration  
⚠️ **Optional**: Firestore real-time subscriptions (requires backend security rules)

## �📁 Architecture

```
src/features/notifications/
├── types/
│   └── index.ts              # TypeScript types & interfaces
├── constants/
│   └── index.ts              # API endpoints, query keys, templates
├── lib/
│   └── firebase/
│       ├── config.ts         # Firebase initialization (Firestore only)
│       └── firestore.ts      # Firestore utilities (for future use)
├── api/
│   ├── notificationsApi.ts   # REST API service
│   └── index.ts
├── hooks/
│   ├── useNotifications.ts   # React Query hooks (infinite scroll)
│   ├── useFirebaseNotifications.ts  # Real-time listener (optional)
│   └── index.ts
├── components/
│   ├── NotificationItem.tsx  # Individual notification
│   ├── NotificationList.tsx  # Notification list with infinite scroll
│   ├── NotificationBadge.tsx # Unread count badge
│   ├── NotificationProvider.tsx # Global provider
│   └── index.ts
└── README.md                 # This file
```

## 🚀 Usage

### 1. Basic Implementation

The notification system is automatically integrated via the `NotificationProvider` in `src/lib/providers.tsx`.

### 2. Displaying Notifications

```tsx
import { NotificationList } from '@/features/notifications/components';

export default function NotificationsPage() {
  return <NotificationList />;
}
```

### 3. Unread Badge

```tsx
import { NotificationBadge } from '@/features/notifications/components';

export default function NavBar() {
  return (
    <div className="relative">
      <BellIcon />
      <NotificationBadge />
    </div>
  );
}
```

### 4. Using Hooks

```tsx
import {
  useNotifications,
  useUnreadCount,
  useMarkAsRead,
  useMarkAllAsRead,
  usePageTitleNotifications,
} from '@/features/notifications/hooks';

function MyComponent() {
  const { data, isLoading } = useNotifications();
  const { data: unreadCount } = useUnreadCount();
  const { mutate: markAsRead } = useMarkAsRead();
  const { mutate: markAllAsRead } = useMarkAllAsRead();

  // Mark single notification as read
  const handleClick = (notificationId: string) => {
    markAsRead(notificationId);
  };

  // Mark all as read
  const handleMarkAll = () => {
    markAllAsRead();
  };
}
```

### 5. Page Title with Unread Count

Automatically update the browser tab title with unread notification count (X/Twitter style):

```tsx
'use client';

import { usePageTitleNotifications } from '@/features/notifications/hooks';

export default function NotificationsPage() {
  // Updates title to "(3) Notifications / X" when there are 3 unread notifications
  usePageTitleNotifications('Notifications / X');

  return <div>Your content here</div>;
}
```

**Features:**

- Shows count in parentheses: `(5) Home / X`
- Automatically updates as notifications are read/received
- Clears count when all notifications are read
- Works on all pages (Home, Notifications, Messages, etc.)

## 🔥 Firebase Setup (Optional)

Firebase is used for optional real-time subscriptions via Firestore. The notification system works fully with REST API polling alone.

### Environment Variables

Add these to your `.env.local` if using Firestore:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your-project.firebaseio.com/
```

### Firestore Structure

```
users/
  {userId}/
    notifications/
      {notificationId}:
        notificationId: string
        type: NotificationType
        createdAt: string
        actorId: number
```

## 🎨 Notification Types

| Type      | Icon | Description               |
| --------- | ---- | ------------------------- |
| `LIKE`    | ❤️   | User liked your post      |
| `REPOST`  | 🔁   | User reposted your post   |
| `QUOTE`   | 💬   | User quoted your post     |
| `REPLY`   | 💬   | User replied to your post |
| `MENTION` | @    | User mentioned you        |
| `FOLLOW`  | 👤   | User followed you         |
| `DM`      | ✉️   | User sent you a message   |

## 📡 API Endpoints

All endpoints are prefixed with `/api/v1.0`:

- `GET /notifications` - Get paginated notifications
- `GET /notifications/unread-count` - Get unread count
- `PATCH /notifications/{id}/read` - Mark as read
- `PATCH /notifications/read-all` - Mark all as read

## 🎯 Query Keys

```typescript
NOTIFICATION_QUERY_KEYS.ALL; // ['notifications']
NOTIFICATION_QUERY_KEYS.LIST(params); // ['notifications', 'list', params]
NOTIFICATION_QUERY_KEYS.UNREAD_COUNT; // ['notifications', 'unread-count']
```

## � Real-time Updates

The notification system uses two methods for real-time updates:

1. **REST API Polling** (Primary): Fetches new notifications every 30 seconds
2. **Firestore Subscriptions** (Optional): WebSocket-based real-time updates when Firebase is configured

The `NotificationProvider` automatically:

1. Polls REST API every 30 seconds for new notifications
2. Optionally subscribes to Firestore real-time updates (if configured)
3. Updates React Query cache automatically
4. Increments unread counter in real-time

## 🎨 Styling

All components use Tailwind CSS with dark mode support. They match the existing design system and are fully customizable.

## ⚡ Performance

- **Infinite Scroll**: Only loads 20 notifications at a time
- **Optimistic Updates**: Instant UI feedback
- **Smart Caching**: React Query handles deduplication and background refetching
- **Lazy Loading**: Components are code-split automatically

## 🧪 Testing

```bash
# Run tests (when available)
npm test -- notifications

# Type checking
npm run type-check

# Linting
npm run lint
```

## 🐛 Troubleshooting

### No notifications appearing

- Verify backend API is running and accessible
- Check network tab for failed API requests
- Ensure authentication token is valid
- Check browser console for errors

### Badge not showing

- Verify `useUnreadCount` hook is fetching data
- Check React Query DevTools for query state
- Ensure API endpoint `/notifications/unread-count` is working
- Verify polling interval is active (30 seconds)

### Firestore real-time updates not working (if enabled)

- Check Firebase configuration in `.env.local`
- Verify Firebase Firestore rules allow access
- Check browser console for Firebase subscription errors
- Ensure user is authenticated with Firebase

## 📚 Dependencies

- `firebase` - Firebase SDK
- `@tanstack/react-query` - Data fetching and caching
- `date-fns` - Date formatting
- `react-intersection-observer` - Infinite scroll
- `lucide-react` - Icons

## 🤝 Contributing

When adding new notification types:

1. Add to `NotificationType` enum in `types/index.ts`
2. Add template in `constants/index.ts`
3. Add icon and handling in `NotificationItem.tsx`
4. Update backend to send Firebase events

## 📝 License

Part of the Hankers project.

---

**Built with ❤️ for Hankers** 🐦
