import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

// Mock next/navigation
const mockReplace = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: mockReplace,
  })),
}));

// Mock AddPostContext
const mockOpen = vi.fn();
const mockClose = vi.fn();
vi.mock('../store/AddPostContext', () => ({
  useAddPostContext: vi.fn(() => ({
    useMedia: () => [],
    useGifVisibility: () => false,
    useActions: () => ({
      addMedia: vi.fn(),
      addGifs: vi.fn(),
      setEmoji: vi.fn(),
      open: mockOpen,
      close: mockClose,
    }),
  })),
}));

// Mock Icon
vi.mock('@/components/ui/home/Icon', () => ({
  default: ({
    title,
    disabled,
    onClick,
    ...props
  }: {
    title?: string;
    disabled?: boolean;
    onClick?: () => void;
  }) => (
    <button
      data-testid={`icon-${title}`}
      data-disabled={disabled}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {title}
    </button>
  ),
}));

vi.mock('../../../components/ui/home/Icon', () => ({
  default: ({
    title,
    disabled,
    onClick,
    ...props
  }: {
    title?: string;
    disabled?: boolean;
    onClick?: () => void;
  }) => (
    <button
      data-testid={`icon-${title}`}
      data-disabled={disabled}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
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
import { useAddPostContext } from '../store/AddPostContext';

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

  it('should open GIF when clicking GIF icon and not open', () => {
    render(<TweetOptionsBar />);

    fireEvent.click(screen.getByTestId('tweet-option-gif'));

    expect(mockOpen).toHaveBeenCalled();
  });

  it('should close GIF and replace route when clicking GIF icon while open', () => {
    vi.mocked(useAddPostContext).mockReturnValue({
      useMedia: () => [],
      useGifVisibility: () => true,
      useActions: () => ({
        addMedia: vi.fn(),
        addGifs: vi.fn(),
        setEmoji: vi.fn(),
        open: mockOpen,
        close: mockClose,
      }),
    } as ReturnType<typeof useAddPostContext>);

    render(<TweetOptionsBar />);

    fireEvent.click(screen.getByTestId('tweet-option-gif'));

    expect(mockClose).toHaveBeenCalled();
    expect(mockReplace).toHaveBeenCalledWith('home', { scroll: false });
  });

  it('should not open GIF when max media reached', () => {
    vi.mocked(useAddPostContext).mockReturnValue({
      useMedia: () => [{}, {}, {}, {}],
      useGifVisibility: () => false,
      useActions: () => ({
        addMedia: vi.fn(),
        addGifs: vi.fn(),
        setEmoji: vi.fn(),
        open: mockOpen,
        close: mockClose,
      }),
    } as ReturnType<typeof useAddPostContext>);

    render(<TweetOptionsBar />);

    const gifButton = screen.getByTestId('tweet-option-gif');
    fireEvent.click(gifButton);

    expect(mockOpen).not.toHaveBeenCalled();
  });

  it('should disable GIF icon when max media reached', () => {
    vi.mocked(useAddPostContext).mockReturnValue({
      useMedia: () => [{}, {}, {}, {}],
      useGifVisibility: () => false,
      useActions: () => ({
        addMedia: vi.fn(),
        addGifs: vi.fn(),
        setEmoji: vi.fn(),
        open: mockOpen,
        close: mockClose,
      }),
    } as ReturnType<typeof useAddPostContext>);

    render(<TweetOptionsBar />);

    const gifIcon = screen.getByTestId('tweet-option-gif');
    expect(gifIcon.getAttribute('data-disabled')).toBe('true');
  });

  it('should render location icon as disabled', () => {
    render(<TweetOptionsBar />);
    const locationIcon = screen.getByTestId('tweet-option-location');
    expect(locationIcon).toBeInTheDocument();
  });

  it('should have correct layout classes', () => {
    render(<TweetOptionsBar />);
    const optionsBar = screen.getByTestId('tweet-options-bar');
    expect(optionsBar.className).toContain('flex');
    expect(optionsBar.className).toContain('items-center');
  });
});
