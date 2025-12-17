import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

// Mock Tweet component
vi.mock('@/features/tweets/components/Tweet', () => ({
  default: ({
    data,
    showColumn,
    showBorder,
    showUpperColumn,
    inProfile,
  }: {
    data: { text?: string };
    showColumn?: boolean;
    showBorder?: boolean;
    showUpperColumn?: boolean;
    inProfile?: boolean;
  }) => (
    <div
      data-testid="tweet"
      data-show-column={showColumn}
      data-show-border={showBorder}
      data-show-upper-column={showUpperColumn}
      data-in-profile={inProfile}
    >
      {data?.text || 'Tweet'}
    </div>
  ),
}));

// Mock DeletedTweet
vi.mock('@/features/tweets/components/DeletedTweet', () => ({
  default: ({ id }: { id: number }) => (
    <div data-testid="deleted-tweet" data-id={id}>
      Deleted Tweet
    </div>
  ),
}));

// Mock useTweetById
vi.mock('@/features/tweets/hooks/tweetQueries', () => ({
  useTweetById: vi.fn(() => ({
    data: null,
    isLoading: false,
  })),
}));

import Reply from '../components/Reply';
import { ADD_TWEET } from '../constants/tweetConstants';

describe('Reply', () => {
  const mockReplyData = {
    postId: 1,
    userId: 1,
    text: 'This is a reply',
    date: '2024-01-01',
    isRepost: false,
    isQuote: false,
    type: 'REPLY',
    originalPostData: {
      postId: 2,
      userId: 2,
      text: 'Original post',
      date: '2024-01-01',
      isRepost: false,
      isQuote: false,
      isDeleted: false,
      type: 'POST',
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render reply component', () => {
    render(<Reply data={mockReplyData as never} />);
    expect(screen.getAllByTestId('tweet').length).toBeGreaterThan(0);
  });

  it('should render without original post', () => {
    render(<Reply data={mockReplyData as never} withoutOriginal={true} />);
    expect(screen.getAllByTestId('tweet').length).toBeGreaterThan(0);
  });

  it('should render in profile mode', () => {
    render(<Reply data={mockReplyData as never} inProfile={true} />);
    expect(screen.getAllByTestId('tweet').length).toBeGreaterThan(0);
  });

  it('should render deleted tweet when original is deleted', () => {
    const deletedData = {
      ...mockReplyData,
      originalPostData: {
        ...mockReplyData.originalPostData,
        isDeleted: true,
      },
    };
    render(<Reply data={deletedData as never} />);
    expect(screen.getByTestId('deleted-tweet')).toBeInTheDocument();
  });

  it('should show column when withoutOriginal is true', () => {
    render(<Reply data={mockReplyData as never} withoutOriginal={true} />);
    const tweets = screen.getAllByTestId('tweet');
    const replyTweet = tweets[tweets.length - 1];
    expect(replyTweet.getAttribute('data-show-column')).toBe('true');
  });

  it('should show border when withoutOriginal is false', () => {
    render(<Reply data={mockReplyData as never} withoutOriginal={false} />);
    const tweets = screen.getAllByTestId('tweet');
    const replyTweet = tweets[tweets.length - 1];
    expect(replyTweet.getAttribute('data-show-border')).toBe('true');
  });

  it('should render nested reply when original is also a reply', () => {
    const nestedReplyData = {
      ...mockReplyData,
      originalPostData: {
        ...mockReplyData.originalPostData,
        type: ADD_TWEET.REPLY,
        originalPostData: {
          postId: 3,
          userId: 3,
          text: 'Root post',
          date: '2024-01-01',
          isRepost: false,
          isQuote: false,
          isDeleted: false,
          type: 'POST',
        },
      },
    };
    render(<Reply data={nestedReplyData as never} />);
    expect(screen.getAllByTestId('tweet').length).toBeGreaterThanOrEqual(1);
  });

  it('should handle missing originalPostData', () => {
    const dataWithoutOriginal = {
      postId: 1,
      userId: 1,
      text: 'Reply without original',
      date: '2024-01-01',
      isRepost: false,
      isQuote: false,
      type: 'REPLY',
      originalPostData: null,
    };
    render(<Reply data={dataWithoutOriginal as never} />);
    expect(screen.getByTestId('tweet')).toBeInTheDocument();
  });

  it('should pass inProfile prop to Tweet components', () => {
    render(<Reply data={mockReplyData as never} inProfile={true} />);
    const tweets = screen.getAllByTestId('tweet');
    tweets.forEach((tweet) => {
      expect(tweet.getAttribute('data-in-profile')).toBe('true');
    });
  });

  it('should show upper column when original is deleted', () => {
    const deletedData = {
      ...mockReplyData,
      originalPostData: {
        ...mockReplyData.originalPostData,
        isDeleted: true,
      },
    };
    render(<Reply data={deletedData as never} />);
    const tweet = screen.getByTestId('tweet');
    expect(tweet.getAttribute('data-show-upper-column')).toBe('true');
  });

  it('should render original post with showColumn true', () => {
    render(<Reply data={mockReplyData as never} />);
    const tweets = screen.getAllByTestId('tweet');
    const originalTweet = tweets[0];
    expect(originalTweet.getAttribute('data-show-column')).toBe('true');
  });

  it('should handle quote in original post', () => {
    const quoteData = {
      ...mockReplyData,
      originalPostData: {
        ...mockReplyData.originalPostData,
        isQuote: true,
      },
    };
    render(<Reply data={quoteData as never} />);
    expect(screen.getAllByTestId('tweet').length).toBeGreaterThan(0);
  });

  it('should handle repost in original post', () => {
    const repostData = {
      ...mockReplyData,
      originalPostData: {
        ...mockReplyData.originalPostData,
        isRepost: true,
      },
    };
    render(<Reply data={repostData as never} />);
    expect(screen.getAllByTestId('tweet').length).toBeGreaterThan(0);
  });

  it('should pass deleted tweet id correctly', () => {
    const deletedData = {
      ...mockReplyData,
      originalPostData: {
        ...mockReplyData.originalPostData,
        postId: 42,
        isDeleted: true,
      },
    };
    render(<Reply data={deletedData as never} />);
    const deletedTweet = screen.getByTestId('deleted-tweet');
    expect(deletedTweet.getAttribute('data-id')).toBe('42');
  });
});
