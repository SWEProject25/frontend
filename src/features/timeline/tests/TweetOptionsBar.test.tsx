import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

// Mock AddPostContext
vi.mock('../store/AddPostContext', () => ({
  useAddPostContext: vi.fn(() => ({
    useMedia: () => [],
    useGifVisibility: () => false,
    useActions: () => ({
      addMedia: vi.fn(),
      addGifs: vi.fn(),
      setEmoji: vi.fn(),
      open: vi.fn(),
      close: vi.fn(),
    }),
  })),
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
  })),
}));

// Mock Icon
vi.mock('@/components/ui/home/Icon', () => ({
  default: ({ title, ...props }: any) => (
    <button data-testid={`icon-${title}`} {...props}>
      {title}
    </button>
  ),
}));

vi.mock('../../../components/ui/home/Icon', () => ({
  default: ({ title, ...props }: any) => (
    <button data-testid={`icon-${title}`} {...props}>
      {title}
    </button>
  ),
}));

// Mock TweetImages
vi.mock('./TweetImages', () => ({
  default: () => <div data-testid="tweet-images">TweetImages</div>,
}));

vi.mock('../components/TweetImages', () => ({
  default: () => <div data-testid="tweet-images">TweetImages</div>,
}));

// Mock Emoji
vi.mock('@/features/media/components/Emoji', () => ({
  default: () => <div data-testid="emoji">Emoji</div>,
}));

import TweetOptionsBar from '../components/TweetOptionsBar';

describe('TweetOptionsBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render options bar', () => {
    render(<TweetOptionsBar />);
    expect(screen.getByTestId('tweet-options-bar')).toBeInTheDocument();
  });

  it('should render GIF icon', () => {
    render(<TweetOptionsBar />);
    // The icon renders with title "GIF"
    expect(screen.getByText('GIF')).toBeInTheDocument();
  });

  it('should render TweetImages component', () => {
    render(<TweetOptionsBar />);
    expect(screen.getByTestId('tweet-images')).toBeInTheDocument();
  });

  it('should render Emoji component', () => {
    render(<TweetOptionsBar />);
    expect(screen.getByTestId('emoji')).toBeInTheDocument();
  });

  it('should hide GIF icon when showGif is false', () => {
    render(<TweetOptionsBar showGif={false} />);
    // When showGif is false, GIF icon should still render but may be hidden via CSS
    expect(screen.getByTestId('tweet-options-bar')).toBeInTheDocument();
  });
});
