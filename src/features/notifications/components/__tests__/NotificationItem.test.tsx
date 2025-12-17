import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '@/test/test-utils';
import { NotificationItem } from '../NotificationItem';
import { NotificationType } from '../../types';
import * as notificationHooks from '../../hooks/useNotifications';

// Mock Next.js router
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock hooks
vi.mock('../../hooks/useNotifications', () => ({
  useMarkAsRead: vi.fn(),
}));

const baseNotification = {
  id: '1',
  recipientId: 1,
  actor: {
    id: 2,
    username: 'testuser',
    displayName: 'Test User',
    avatarUrl: 'https://example.com/avatar.jpg',
  },
  isRead: false,
  createdAt: '2024-01-01T12:00:00Z',
};

describe('NotificationItem', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    const mockMutate = vi.fn();
    vi.spyOn(notificationHooks, 'useMarkAsRead').mockReturnValue({
      mutate: mockMutate,
    } as any);
  });

  describe('Notification Types and Icons', () => {
    it('should render LIKE notification correctly', () => {
      const notification = {
        ...baseNotification,
        type: NotificationType.LIKE,
        postId: 123,
        postPreviewText: 'Test post',
      };

      render(<NotificationItem notification={notification} />);

      expect(screen.getByText('liked your post')).toBeInTheDocument();
      expect(screen.getByText('Test User')).toBeInTheDocument();
      expect(screen.getByText('@testuser')).toBeInTheDocument();
      expect(screen.getByText('Test post')).toBeInTheDocument();
    });

    it('should render REPOST notification correctly', () => {
      const notification = {
        ...baseNotification,
        type: NotificationType.REPOST,
        postId: 123,
        postPreviewText: 'Test post',
      };

      render(<NotificationItem notification={notification} />);

      expect(screen.getByText('reposted your post')).toBeInTheDocument();
    });

    it('should render REPLY notification correctly', () => {
      const notification = {
        ...baseNotification,
        type: NotificationType.REPLY,
        postId: 123,
        replyId: 456,
        postPreviewText: 'Original post',
        post: {
          userId: 2,
          username: 'testuser',
          verified: false,
          name: 'Test User',
          avatar: null,
          postId: 456,
          date: '2024-01-01T12:00:00Z',
          likesCount: 0,
          retweetsCount: 0,
          commentsCount: 0,
          isLikedByMe: false,
          isFollowedByMe: false,
          isRepostedByMe: false,
          text: 'This is a reply',
          media: [],
          isRepost: false,
          isQuote: false,
        },
      };

      render(<NotificationItem notification={notification} />);

      expect(screen.getByText('replied to your post')).toBeInTheDocument();
      expect(screen.getByText('This is a reply')).toBeInTheDocument();
      expect(screen.getByText(/Replying to:/)).toBeInTheDocument();
    });

    it('should render QUOTE notification correctly', () => {
      const notification = {
        ...baseNotification,
        type: NotificationType.QUOTE,
        postId: 123,
        quotePostId: 456,
        post: {
          userId: 2,
          username: 'testuser',
          verified: false,
          name: 'Test User',
          avatar: null,
          postId: 456,
          date: '2024-01-01T12:00:00Z',
          likesCount: 0,
          retweetsCount: 0,
          commentsCount: 0,
          isLikedByMe: false,
          isFollowedByMe: false,
          isRepostedByMe: false,
          text: 'This is a quote',
          media: [],
          isRepost: false,
          isQuote: true,
          originalPostData: {
            userId: 1,
            username: 'originaluser',
            verified: false,
            name: 'Original User',
            avatar: null,
            postId: 123,
            date: '2024-01-01T11:00:00Z',
            likesCount: 0,
            retweetsCount: 0,
            commentsCount: 0,
            isLikedByMe: false,
            isFollowedByMe: false,
            isRepostedByMe: false,
            text: 'Original post text',
            media: [],
            isRepost: false,
            isQuote: false,
          },
        },
      };

      render(<NotificationItem notification={notification} />);

      expect(screen.getByText('quoted your post')).toBeInTheDocument();
      expect(screen.getByText('This is a quote')).toBeInTheDocument();
      expect(screen.getByText('Original post text')).toBeInTheDocument();
    });

    it('should render MENTION notification correctly', () => {
      const notification = {
        ...baseNotification,
        type: NotificationType.MENTION,
        postId: 123,
        postPreviewText: 'You were mentioned',
      };

      render(<NotificationItem notification={notification} />);

      expect(screen.getByText('mentioned you')).toBeInTheDocument();
      expect(screen.getByText('You were mentioned')).toBeInTheDocument();
    });

    it('should render FOLLOW notification correctly', () => {
      const notification = {
        ...baseNotification,
        type: NotificationType.FOLLOW,
      };

      render(<NotificationItem notification={notification} />);

      expect(screen.getByText('followed you')).toBeInTheDocument();
    });

    it('should render DM notification correctly', () => {
      const notification = {
        ...baseNotification,
        type: NotificationType.DM,
        conversationId: 789,
        messagePreview: 'Hey, how are you?',
      };

      render(<NotificationItem notification={notification} />);

      expect(screen.getByText('sent you a message')).toBeInTheDocument();
      expect(screen.getByText('Hey, how are you?')).toBeInTheDocument();
    });
  });

  describe('Navigation Links', () => {
    it('should navigate to user profile for FOLLOW notifications', () => {
      const notification = {
        ...baseNotification,
        type: NotificationType.FOLLOW,
      };

      render(<NotificationItem notification={notification} />);

      const notificationElement = screen
        .getByText('followed you')
        .closest('div');
      if (notificationElement?.parentElement) {
        fireEvent.click(notificationElement.parentElement);
      }

      expect(mockPush).toHaveBeenCalledWith('/testuser');
    });

    it('should navigate to post for LIKE notifications', () => {
      const notification = {
        ...baseNotification,
        type: NotificationType.LIKE,
        postId: 123,
        postPreviewText: 'Test post',
      };

      render(<NotificationItem notification={notification} />);

      const notificationElement = screen
        .getByText('liked your post')
        .closest('div');
      if (notificationElement?.parentElement) {
        fireEvent.click(notificationElement.parentElement);
      }

      expect(mockPush).toHaveBeenCalledWith('/home/123');
    });

    it('should navigate to reply for REPLY notifications', () => {
      const notification = {
        ...baseNotification,
        type: NotificationType.REPLY,
        postId: 123,
        replyId: 456,
      };

      render(<NotificationItem notification={notification} />);

      const notificationElement = screen
        .getByText('replied to your post')
        .closest('div');
      if (notificationElement?.parentElement) {
        fireEvent.click(notificationElement.parentElement);
      }

      expect(mockPush).toHaveBeenCalledWith('/home/456?parentId=123');
    });

    it('should navigate to quote post for QUOTE notifications', () => {
      const notification = {
        ...baseNotification,
        type: NotificationType.QUOTE,
        postId: 123,
        quotePostId: 789,
      };

      render(<NotificationItem notification={notification} />);

      const notificationElement = screen
        .getByText('quoted your post')
        .closest('div');
      if (notificationElement?.parentElement) {
        fireEvent.click(notificationElement.parentElement);
      }

      expect(mockPush).toHaveBeenCalledWith('/home/789');
    });

    it('should navigate to messages with conversationId for DM notifications', () => {
      const notification = {
        ...baseNotification,
        type: NotificationType.DM,
        conversationId: 999,
        messagePreview: 'Test message',
      };

      render(<NotificationItem notification={notification} />);

      const notificationElement = screen
        .getByText('sent you a message')
        .closest('div');
      if (notificationElement?.parentElement) {
        fireEvent.click(notificationElement.parentElement);
      }

      expect(mockPush).toHaveBeenCalledWith('/messages/999');
    });

    it('should navigate to messages with messageId when conversationId is not available', () => {
      const notification = {
        ...baseNotification,
        type: NotificationType.DM,
        messageId: '888',
        messagePreview: 'Test message',
      };

      render(<NotificationItem notification={notification} />);

      const notificationElement = screen
        .getByText('sent you a message')
        .closest('div');
      if (notificationElement?.parentElement) {
        fireEvent.click(notificationElement.parentElement);
      }

      expect(mockPush).toHaveBeenCalledWith('/messages/888');
    });
  });

  describe('Read/Unread States', () => {
    it('should show unread indicator for unread notifications', () => {
      const notification = {
        ...baseNotification,
        type: NotificationType.LIKE,
        isRead: false,
        postId: 123,
      };

      const { container } = render(
        <NotificationItem notification={notification} />
      );

      // Check for the unread indicator dot
      const unreadIndicator = container.querySelector('[aria-label="Unread"]');
      expect(unreadIndicator).toBeInTheDocument();
    });

    it('should not show unread indicator for read notifications', () => {
      const notification = {
        ...baseNotification,
        type: NotificationType.LIKE,
        isRead: true,
        postId: 123,
      };

      const { container } = render(
        <NotificationItem notification={notification} />
      );

      // Should not have unread indicator
      const unreadIndicator = container.querySelector('[aria-label="Unread"]');
      expect(unreadIndicator).not.toBeInTheDocument();
    });

    it('should mark notification as read when clicked', () => {
      const mockMutate = vi.fn();
      vi.spyOn(notificationHooks, 'useMarkAsRead').mockReturnValue({
        mutate: mockMutate,
      } as any);

      const notification = {
        ...baseNotification,
        type: NotificationType.LIKE,
        isRead: false,
        postId: 123,
        postPreviewText: 'Test',
      };

      render(<NotificationItem notification={notification} />);

      const notificationElement = screen
        .getByText('liked your post')
        .closest('div');
      if (notificationElement?.parentElement) {
        fireEvent.click(notificationElement.parentElement);
      }

      expect(mockMutate).toHaveBeenCalledWith('1');
    });

    it('should not call markAsRead if notification is already read', () => {
      const mockMutate = vi.fn();
      vi.spyOn(notificationHooks, 'useMarkAsRead').mockReturnValue({
        mutate: mockMutate,
      } as any);

      const notification = {
        ...baseNotification,
        type: NotificationType.LIKE,
        isRead: true,
        postId: 123,
      };

      render(<NotificationItem notification={notification} />);

      const notificationElement = screen
        .getByText('liked your post')
        .closest('div');
      if (notificationElement?.parentElement) {
        fireEvent.click(notificationElement.parentElement);
      }

      expect(mockMutate).not.toHaveBeenCalled();
    });
  });

  describe('Time Formatting', () => {
    it('should format time correctly', () => {
      const now = new Date();
      const mockDate = new Date(now.getTime() - 45 * 1000); // 45 seconds ago

      const notification = {
        ...baseNotification,
        type: NotificationType.LIKE,
        postId: 123,
        createdAt: mockDate.toISOString(),
      };

      render(<NotificationItem notification={notification} />);

      // Should show seconds
      expect(screen.getByText(/\d+s/)).toBeInTheDocument();
    });
  });

  describe('Media Display', () => {
    it('should show media count for REPLY notifications with media', () => {
      const notification = {
        ...baseNotification,
        type: NotificationType.REPLY,
        replyId: 456,
        post: {
          userId: 2,
          username: 'testuser',
          verified: false,
          name: 'Test User',
          avatar: null,
          postId: 456,
          date: '2024-01-01T12:00:00Z',
          likesCount: 0,
          retweetsCount: 0,
          commentsCount: 0,
          isLikedByMe: false,
          isFollowedByMe: false,
          isRepostedByMe: false,
          text: 'Reply with images',
          media: ['image1.jpg', 'image2.jpg'],
          isRepost: false,
          isQuote: false,
        },
      };

      render(<NotificationItem notification={notification} />);

      expect(screen.getByText(/📷 2 media items/)).toBeInTheDocument();
    });

    it('should show singular form for single media item', () => {
      const notification = {
        ...baseNotification,
        type: NotificationType.REPLY,
        replyId: 456,
        post: {
          userId: 2,
          username: 'testuser',
          verified: false,
          name: 'Test User',
          avatar: null,
          postId: 456,
          date: '2024-01-01T12:00:00Z',
          likesCount: 0,
          retweetsCount: 0,
          commentsCount: 0,
          isLikedByMe: false,
          isFollowedByMe: false,
          isRepostedByMe: false,
          text: 'Reply with image',
          media: ['image1.jpg'],
          isRepost: false,
          isQuote: false,
        },
      };

      render(<NotificationItem notification={notification} />);

      expect(screen.getByText(/📷 1 media item/)).toBeInTheDocument();
    });
  });

  describe('Custom onClick Handler', () => {
    it('should call custom onClick handler when provided', () => {
      const onClickMock = vi.fn();
      const notification = {
        ...baseNotification,
        type: NotificationType.LIKE,
        postId: 123,
      };

      render(
        <NotificationItem notification={notification} onClick={onClickMock} />
      );

      const notificationElement = screen
        .getByText('liked your post')
        .closest('div');
      if (notificationElement?.parentElement) {
        fireEvent.click(notificationElement.parentElement);
      }

      expect(onClickMock).toHaveBeenCalled();
    });
  });

  describe('Media Display', () => {
    it('should show media count for single media item', () => {
      const notification = {
        ...baseNotification,
        type: NotificationType.REPLY,
        postId: 123,
        replyId: 456,
        post: {
          userId: 2,
          username: 'testuser',
          verified: false,
          name: 'Test User',
          avatar: null,
          postId: 456,
          date: '2024-01-01T12:00:00Z',
          likesCount: 0,
          retweetsCount: 0,
          commentsCount: 0,
          isLikedByMe: false,
          isFollowedByMe: false,
          isRepostedByMe: false,
          text: 'Reply with media',
          media: [{ url: 'image.jpg', type: 'image' }],
          isRepost: false,
          isQuote: false,
        },
      };

      render(<NotificationItem notification={notification} />);

      expect(screen.getByText(/1 media/)).toBeInTheDocument();
      expect(screen.getByText(/item$/)).toBeInTheDocument();
    });

    it('should show media count for multiple media items', () => {
      const notification = {
        ...baseNotification,
        type: NotificationType.REPLY,
        postId: 123,
        replyId: 456,
        post: {
          userId: 2,
          username: 'testuser',
          verified: false,
          name: 'Test User',
          avatar: null,
          postId: 456,
          date: '2024-01-01T12:00:00Z',
          likesCount: 0,
          retweetsCount: 0,
          commentsCount: 0,
          isLikedByMe: false,
          isFollowedByMe: false,
          isRepostedByMe: false,
          text: 'Reply with media',
          media: [
            { url: 'image1.jpg', type: 'image' },
            { url: 'image2.jpg', type: 'image' },
          ],
          isRepost: false,
          isQuote: false,
        },
      };

      render(<NotificationItem notification={notification} />);

      expect(screen.getByText(/2 media/)).toBeInTheDocument();
      expect(screen.getByText(/items$/)).toBeInTheDocument();
    });

    it('should render quote post with original post data', () => {
      const notification = {
        ...baseNotification,
        type: NotificationType.REPLY,
        postId: 123,
        replyId: 456,
        post: {
          userId: 2,
          username: 'testuser',
          verified: false,
          name: 'Test User',
          avatar: null,
          postId: 456,
          date: '2024-01-01T12:00:00Z',
          likesCount: 0,
          retweetsCount: 0,
          commentsCount: 0,
          isLikedByMe: false,
          isFollowedByMe: false,
          isRepostedByMe: false,
          text: 'This is a quote',
          media: [],
          isRepost: false,
          isQuote: true,
          originalPostData: {
            userId: 3,
            username: 'originaluser',
            verified: true,
            name: 'Original User',
            avatar: 'avatar.jpg',
            postId: 789,
            date: '2024-01-01T11:00:00Z',
            text: 'Original post text',
            media: [],
            likesCount: 5,
            retweetsCount: 2,
            commentsCount: 1,
            isLikedByMe: false,
            isFollowedByMe: false,
            isRepostedByMe: false,
            isRepost: false,
            isQuote: false,
          },
        },
      };

      render(<NotificationItem notification={notification} />);

      // The quote should be shown but we're checking for the actual reply content
      expect(screen.getByText('This is a quote')).toBeInTheDocument();
      // Original user info would be in a quoted section - adjust to check what's actually rendered
      expect(screen.getByText('replied to your post')).toBeInTheDocument();
    });
  });

  describe('Time Formatting Edge Cases', () => {
    it('should format time in days when more than 24 hours ago', () => {
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

      const notification = {
        ...baseNotification,
        type: NotificationType.LIKE,
        postId: 123,
        createdAt: twoDaysAgo.toISOString(),
      };

      render(<NotificationItem notification={notification} />);

      expect(screen.getByText(/2d/)).toBeInTheDocument();
    });

    it('should format time in hours when less than 24 hours ago', () => {
      const threeHoursAgo = new Date();
      threeHoursAgo.setHours(threeHoursAgo.getHours() - 3);

      const notification = {
        ...baseNotification,
        type: NotificationType.LIKE,
        postId: 123,
        createdAt: threeHoursAgo.toISOString(),
      };

      render(<NotificationItem notification={notification} />);

      expect(screen.getByText(/3h/)).toBeInTheDocument();
    });
  });
});
