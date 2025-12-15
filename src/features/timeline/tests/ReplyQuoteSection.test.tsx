import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

// Mock AddPostContext
vi.mock('../store/AddPostContext', () => ({
  useAddPostContext: vi.fn(() => ({
    useTweetText: () => 'test tweet',
    useMedia: () => [],
    useMentions: () => [],
    useActions: () => ({
      setTweetText: vi.fn(),
      addMedia: vi.fn(),
      reset: vi.fn(),
    }),
  })),
}));

// Mock useParentId
vi.mock('../store/useTimelineStore', () => ({
  useParentId: vi.fn(() => 1),
}));

// Mock useAddTweet
vi.mock('../hooks/timelineQueries', () => ({
  useAddTweet: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
    isSuccess: false,
    isError: false,
  })),
}));

// Mock TweetSubmitSection
vi.mock('./TweetSubmitSection', () => ({
  default: ({ label, handleAddTweet, enableAddTweet }: any) => (
    <div data-testid="tweet-submit-section">
      <button
        data-testid="submit-button"
        onClick={handleAddTweet}
        disabled={!enableAddTweet}
      >
        {label}
      </button>
    </div>
  ),
}));

import ReplyQuoteSections from '../components/ReplyQuoteSection';

describe('ReplyQuoteSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render tweet submit section', () => {
    render(<ReplyQuoteSections label="REPLY" />);
    expect(screen.getByTestId('tweet-submit-section')).toBeInTheDocument();
  });

  it('should render Reply label for REPLY type', () => {
    render(<ReplyQuoteSections label="REPLY" />);
    expect(screen.getByText('Reply')).toBeInTheDocument();
  });

  it('should render Post label for QUOTE type', () => {
    render(<ReplyQuoteSections label="QUOTE" />);
    expect(screen.getByText('Post')).toBeInTheDocument();
  });

  it('should render submit button', () => {
    render(<ReplyQuoteSections label="REPLY" />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
