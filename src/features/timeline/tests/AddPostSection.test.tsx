import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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
const mockMutate = vi.fn();
vi.mock('../hooks/timelineQueries', () => ({
  useAddTweet: vi.fn(() => ({
    mutate: mockMutate,
    isPending: false,
    isSuccess: false,
    isError: false,
  })),
}));

// Mock TweetSubmitSection
vi.mock('./TweetSubmitSection', () => ({
  default: ({
    label,
    handleAddTweet,
    enableAddTweet,
    enableSection,
  }: {
    label: string;
    handleAddTweet: () => void;
    enableAddTweet: boolean;
    enableSection: boolean;
  }) => (
    <div
      data-testid="tweet-submit-section"
      data-enable-section={String(enableSection)}
    >
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
import { useAddPostContext } from '../store/AddPostContext';
import { LOCAL_MEDIA } from '@/features/media/constants/mediaConstants';

describe('AddPostSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn().mockResolvedValue({
      blob: () => Promise.resolve(new Blob(['test'], { type: 'image/gif' })),
    });
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
    const button = screen.getByRole('button');
    expect(button).not.toBeDisabled();
  });

  it('should render submit button', () => {
    render(<AddPostSection />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should disable button when tweet text is empty and no media', () => {
    vi.mocked(useAddPostContext).mockReturnValue({
      useTweetText: () => '',
      useMedia: () => [],
      useMentions: () => [],
      useActions: () => ({
        setTweetText: vi.fn(),
        addMedia: vi.fn(),
        reset: vi.fn(),
      }),
    } as ReturnType<typeof useAddPostContext>);

    render(<AddPostSection />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should enable button when media exists but no text', () => {
    vi.mocked(useAddPostContext).mockReturnValue({
      useTweetText: () => '',
      useMedia: () => [{ type: LOCAL_MEDIA, data: new File([''], 'test.jpg') }],
      useMentions: () => [],
      useActions: () => ({
        setTweetText: vi.fn(),
        addMedia: vi.fn(),
        reset: vi.fn(),
      }),
    } as ReturnType<typeof useAddPostContext>);

    render(<AddPostSection />);
    const button = screen.getByRole('button');
    expect(button).not.toBeDisabled();
  });

  it('should disable button when text exceeds max length', () => {
    vi.mocked(useAddPostContext).mockReturnValue({
      useTweetText: () => 'x'.repeat(281),
      useMedia: () => [],
      useMentions: () => [],
      useActions: () => ({
        setTweetText: vi.fn(),
        addMedia: vi.fn(),
        reset: vi.fn(),
      }),
    } as ReturnType<typeof useAddPostContext>);

    render(<AddPostSection />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should call mutate when handleAddTweet is triggered with local media', async () => {
    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    vi.mocked(useAddPostContext).mockReturnValue({
      useTweetText: () => 'test tweet',
      useMedia: () => [{ type: LOCAL_MEDIA, data: mockFile }],
      useMentions: () => [{ id: 1, username: 'user1' }],
      useActions: () => ({
        setTweetText: vi.fn(),
        addMedia: vi.fn(),
        reset: vi.fn(),
      }),
    } as ReturnType<typeof useAddPostContext>);

    render(<AddPostSection />);
    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalled();
    });
  });

  it('should call mutate when handleAddTweet is triggered with GIF media', async () => {
    const mockGifData = {
      type: 'GIF',
      data: {
        images: { original: { url: 'https://example.com/gif.gif' } },
        title: 'test-gif',
      },
    };
    vi.mocked(useAddPostContext).mockReturnValue({
      useTweetText: () => 'test tweet',
      useMedia: () => [mockGifData],
      useMentions: () => [],
      useActions: () => ({
        setTweetText: vi.fn(),
        addMedia: vi.fn(),
        reset: vi.fn(),
      }),
    } as ReturnType<typeof useAddPostContext>);

    render(<AddPostSection />);
    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalled();
    });
  });

  it('should disable button when only whitespace in text', () => {
    vi.mocked(useAddPostContext).mockReturnValue({
      useTweetText: () => '   ',
      useMedia: () => [],
      useMentions: () => [],
      useActions: () => ({
        setTweetText: vi.fn(),
        addMedia: vi.fn(),
        reset: vi.fn(),
      }),
    } as ReturnType<typeof useAddPostContext>);

    render(<AddPostSection />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should render submit section with proper structure', () => {
    vi.mocked(useAddPostContext).mockReturnValue({
      useTweetText: () => 'test',
      useMedia: () => [],
      useMentions: () => [],
      useActions: () => ({
        setTweetText: vi.fn(),
        addMedia: vi.fn(),
        reset: vi.fn(),
      }),
    } as ReturnType<typeof useAddPostContext>);

    render(<AddPostSection />);
    expect(screen.getByTestId('tweet-submit-section')).toBeInTheDocument();
  });
});
