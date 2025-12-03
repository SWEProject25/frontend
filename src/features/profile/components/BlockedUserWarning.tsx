'use client';
import React from 'react';
import Button from '@/components/ui/Button';

interface BlockedUserWarningProps {
  username: string;
  onViewPosts: () => void;
}

const BlockedUserWarning: React.FC<BlockedUserWarningProps> = ({
  username,
  onViewPosts,
}) => {
  return (
    <div
      className="flex flex-col items-center justify-center py-16 px-6 border-t border-border mt-4"
      data-testid="blocked-user-warning"
    >
      <div className="max-w-md w-full text-center space-y-4">
        <div
          className="flex justify-center mb-4"
          data-testid="blocked-user-icon"
        >
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <svg
              className="w-8 h-8 text-text-secondary"
              viewBox="0 0 24 24"
              aria-hidden="true"
              fill="currentColor"
            >
              <path d="M12 3.75c-4.55 0-8.25 3.69-8.25 8.25 0 1.92.66 3.68 1.75 5.08L17.09 5.5C15.68 4.4 13.92 3.75 12 3.75zm6.5 3.17L6.92 18.5c1.4 1.1 3.16 1.75 5.08 1.75 4.56 0 8.25-3.69 8.25-8.25 0-1.92-.65-3.68-1.75-5.08zM1.75 12C1.75 6.34 6.34 1.75 12 1.75S22.25 6.34 22.25 12 17.66 22.25 12 22.25 1.75 17.66 1.75 12z" />
            </svg>
          </div>
        </div>

        <h2
          className="text-xl font-bold text-text-active"
          data-testid="blocked-user-title"
        >
          @{username} is blocked
        </h2>

        <p
          className="text-sm text-text-secondary leading-relaxed"
          data-testid="blocked-user-description"
        >
          Are you sure you want to view these posts? Viewing posts won&apos;t
          unblock @{username}.
        </p>

        <div className="pt-4">
          <Button
            variant="primary"
            size="md"
            onClick={onViewPosts}
            data-testid="view-posts-button"
            className="px-8"
          >
            View posts
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BlockedUserWarning;
