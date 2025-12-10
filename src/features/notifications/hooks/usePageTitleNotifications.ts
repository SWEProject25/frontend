'use client';

import { useEffect } from 'react';
import { useUnreadCount } from './useNotifications';
import { setNotificationFavicon, resetFavicon } from '../lib/favicon';

/**
 * Hook to update page title with unread notification count
 * Shows (count) in the title and updates favicon with red badge when there are notifications
 * Excludes DM notifications (they have their own badge in Messages)
 *
 * @param baseTitle - The base title to display (default: 'H')
 * @param updateFavicon - Whether to update the favicon with a badge (default: true)
 */
export const usePageTitleNotifications = (
  baseTitle: string = 'H',
  updateFavicon: boolean = true
) => {
  // Exclude DM notifications - they're shown in the Messages badge
  const { data: unreadCount } = useUnreadCount({
    exclude: 'DM',
  });

  useEffect(() => {
    // Get the current path to determine the page title
    const path = window.location.pathname;
    let pageTitle = baseTitle;

    // Set page-specific titles with "H" branding
    if (path.includes('/notifications')) {
      pageTitle = 'Notifications / H';
    } else if (path.includes('/messages')) {
      pageTitle = 'Messages / H';
    } else if (path.includes('/home')) {
      pageTitle = 'Home / H';
    }

    const hasNotifications = unreadCount && unreadCount > 0;

    // Update title with unread count if there are unread notifications
    if (hasNotifications) {
      document.title = `(${unreadCount}) ${pageTitle}`;
    } else {
      document.title = pageTitle;
    }

    // Update favicon with notification badge
    if (updateFavicon) {
      if (hasNotifications) {
        setNotificationFavicon();
      } else {
        resetFavicon();
      }
    }

    // Cleanup function to reset when component unmounts
    return () => {
      if (updateFavicon) {
        resetFavicon();
      }
      document.title = baseTitle;
    };
  }, [unreadCount, baseTitle, updateFavicon]);

  return unreadCount;
};
