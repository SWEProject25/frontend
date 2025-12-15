import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

// Mock Tweet component
vi.mock('@/features/tweets/components/Tweet', () => ({
  default: ({ data }: any) => (
    <div data-testid="tweet">{data?.text || 'Tweet'}</div>
  ),
}));

// Mock DeletedTweet
vi.mock('@/features/tweets/components/DeletedTweet', () => ({
  default: () => <div data-testid="deleted-tweet">Deleted Tweet</div>,
}));

// Mock useTweetById
vi.mock('@/features/tweets/hooks/tweetQueries', () => ({
  useTweetById: vi.fn(() => ({
    data: null,
    isLoading: false,
  })),
}));

import Reply from '../components/Reply';

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
    render(<Reply data={mockReplyData as any} />);
    expect(screen.getAllByTestId('tweet').length).toBeGreaterThan(0);
  });

  it('should render without original post', () => {
    render(<Reply data={mockReplyData as any} withoutOriginal={true} />);
    expect(screen.getAllByTestId('tweet').length).toBeGreaterThan(0);
  });

  it('should render in profile mode', () => {
    render(<Reply data={mockReplyData as any} inProfile={true} />);
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
    render(<Reply data={deletedData as any} />);
    expect(screen.getByTestId('deleted-tweet')).toBeInTheDocument();
  });
});
