'use client';

import Timeline from '@/features/timeline/components/Timeline';
import { usePageTitleNotifications } from '@/features/notifications/hooks';

export default function Home() {
  // Update page title with unread count (uses "H" branding)
  usePageTitleNotifications();

  return <Timeline />;
}
