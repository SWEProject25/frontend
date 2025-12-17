'use client';

import React, { useState } from 'react';
import { NotificationList } from '@/features/notifications/components';
import { usePageTitleNotifications } from '@/features/notifications/hooks';

type TabType = 'all' | 'mentions';

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('all');

  // Update page title with unread count (uses "H" branding, static favicon)
  usePageTitleNotifications('H', false);

  const getFilterParams = () => {
    switch (activeTab) {
      case 'mentions':
        // Show only MENTION notifications, exclude DM
        return { include: 'MENTION' };
      case 'all':
      default:
        // Show all notifications except DM (DM notifications appear in Messages tab)
        return { exclude: 'DM' };
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold text-foreground">Notifications</h1>
        </div>

        {/* Tabs */}
        <div className="flex">
          <button
            onClick={() => setActiveTab('all')}
            className={`relative flex-1 px-4 py-4 text-[15px] font-medium transition-colors hover:bg-white/10 ${
              activeTab === 'all'
                ? 'font-bold text-foreground'
                : 'text-secondary'
            }`}
          >
            All
            {activeTab === 'all' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('mentions')}
            className={`relative flex-1 px-4 py-4 text-[15px] font-medium transition-colors hover:bg-white/10 ${
              activeTab === 'mentions'
                ? 'font-bold text-foreground'
                : 'text-secondary'
            }`}
          >
            Mentions
            {activeTab === 'mentions' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary" />
            )}
          </button>
        </div>
      </div>

      {/* Notification List */}
      <NotificationList
        params={getFilterParams()}
        emptyMessage={
          activeTab === 'mentions' ? 'No mentions yet' : 'No notifications yet'
        }
      />
    </div>
  );
}
