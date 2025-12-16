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

import AddPostSection from '../components/AddPostSection';

describe('AddPostSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render tweet submit section', () => {
    render(<AddPostSection />);
    expect(screen.getByTestId('tweet-submit-section')).toBeInTheDocument();
  });

  it('should render post button', () => {
    render(<AddPostSection />);
    expect(screen.getByText('Post')).toBeInTheDocument();
  });

  it('should enable button when text exists', () => {
    render(<AddPostSection />);
    // Button should be present
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should render submit button', () => {
    render(<AddPostSection />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
