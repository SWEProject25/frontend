'use client';

import { useEffect } from 'react';
import { useUnreadCount } from './useNotifications';

/**
 * Hook to update page title with unread notification count
 * Mimics X (Twitter) behavior of showing (count) in the title
 *
 * @param baseTitle - The base title to display (default: 'X')
 * @param updateFavicon - Whether to update the favicon with a badge (default: false)
 */
export const usePageTitleNotifications = (
  baseTitle: string = 'X',
  updateFavicon: boolean = false
) => {
  const { data: unreadCount } = useUnreadCount();

  useEffect(() => {
    // Get the current path to determine the page title
    const path = window.location.pathname;
    let pageTitle = baseTitle;

    // Set page-specific titles
    if (path.includes('/notifications')) {
      pageTitle = 'Notifications / X';
    } else if (path.includes('/messages')) {
      pageTitle = 'Messages / X';
    } else if (path.includes('/home')) {
      pageTitle = 'Home / X';
    }

    // Update title with unread count if there are unread notifications
    if (unreadCount && unreadCount > 0) {
      document.title = `(${unreadCount}) ${pageTitle}`;
    } else {
      document.title = pageTitle;
    }

    // Optionally update favicon (future enhancement)
    if (updateFavicon && unreadCount && unreadCount > 0) {
      // This could be enhanced to draw a badge on the favicon
      // For now, we just change the title which is the main X behavior
    }

    // Cleanup function to reset title when component unmounts
    return () => {
      document.title = baseTitle;
    };
  }, [unreadCount, baseTitle, updateFavicon]);

  return unreadCount;
};
