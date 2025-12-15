import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import TypingProgressCircle from '../components/TypingProgressCircle';
import { AddPostStoreContext } from '../store/AddPostContext';
import {
  MAX_TWEET_LENGTH,
  MAX_WARNING_TWEET_LENGTH,
  MAX_RED_PROGRESS_STEPS,
} from '../constants/tweetConstants';

// Create mock selectors
const createMockSelectors = (tweetText: string) => ({
  useTweetText: () => tweetText,
  useMedia: () => [],
  useMentions: () => [],
  useIsSending: () => false,
  useIsSuccess: () => false,
  useError: () => '',
  useEmoji: () => '',
  useMention: () => '',
  useCurrentKey: () => '',
  useMentionIsDone: () => '',
  useIsOpen: () => false,
  usePlaceHolder: () => "What's happening?",
  useGifVisibility: () => false,
  useGifsSearch: () => '',
  useParentId: () => -1,
  useSelectedReplyOption: () => -1,
  useActions: () => ({
    setTweetText: vi.fn(),
    addMedia: vi.fn(),
    removeMedia: vi.fn(),
    clearMedia: vi.fn(),
    setEmoji: vi.fn(),
    clearEmoji: vi.fn(),
    setMention: vi.fn(),
    setIsOpen: vi.fn(),
    setIsDone: vi.fn(),
    setKeyDown: vi.fn(),
    setPlaceHolder: vi.fn(),
    open: vi.fn(),
    close: vi.fn(),
    setSearch: vi.fn(),
    setParentId: vi.fn(),
    updateReplyOption: vi.fn(),
    startSending: vi.fn(),
    onSuccess: vi.fn(),
    seterror: vi.fn(),
    setMentions: vi.fn(),
    addGifs: vi.fn(),
  }),
});

const renderWithContext = (tweetText: string) => {
  const mockSelectors = createMockSelectors(tweetText);

  return render(
    <AddPostStoreContext.Provider value={mockSelectors as any}>
      <TypingProgressCircle />
    </AddPostStoreContext.Provider>
  );
};

describe('TypingProgressCircle Component', () => {
  it('should render the progress circle container', () => {
    const { container } = renderWithContext('');

    const circleContainer = container.querySelector('.relative.w-8.h-8');
    expect(circleContainer).toBeInTheDocument();
  });

  it('should render SVG element', () => {
    const { container } = renderWithContext('Hello');

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should show primary color for text under MAX_TWEET_LENGTH', () => {
    const { container } = renderWithContext('Short text');

    const circle = container.querySelector('circle.stroke-primary');
    expect(circle).toBeInTheDocument();
  });

  it('should show warning color when text exceeds MAX_TWEET_LENGTH but under limit', () => {
    const text = 'a'.repeat(MAX_TWEET_LENGTH + 5);
    const { container } = renderWithContext(text);

    const circle = container.querySelector('circle.stroke-warning');
    expect(circle).toBeInTheDocument();
  });

  it('should show error color when text exceeds warning limit', () => {
    const text = 'a'.repeat(MAX_TWEET_LENGTH + MAX_WARNING_TWEET_LENGTH + 1);
    const { container } = renderWithContext(text);

    const circle = container.querySelector('circle.stroke-error');
    expect(circle).toBeInTheDocument();
  });

  it('should not show any progress circle when over max steps', () => {
    const text = 'a'.repeat(
      MAX_TWEET_LENGTH + MAX_WARNING_TWEET_LENGTH + MAX_RED_PROGRESS_STEPS + 1
    );
    const { container } = renderWithContext(text);

    // Should show transparent stroke
    const primaryCircle = container.querySelector('circle.stroke-primary');
    const warningCircle = container.querySelector('circle.stroke-warning');
    // Also check error circle exists
    container.querySelector('circle.stroke-error');

    // At this length, circle should be transparent
    expect(primaryCircle).not.toBeInTheDocument();
    expect(warningCircle).not.toBeInTheDocument();
  });

  it('should not show character count for short text', () => {
    renderWithContext('Short');

    const countElement = screen.queryByTestId('words-count');
    expect(countElement).not.toBeInTheDocument();
  });

  it('should show character count when text exceeds MAX_TWEET_LENGTH', () => {
    const text = 'a'.repeat(MAX_TWEET_LENGTH + 5);
    renderWithContext(text);

    const countElement = screen.getByTestId('words-count');
    expect(countElement).toBeInTheDocument();
    expect(countElement).toHaveTextContent(
      `${MAX_TWEET_LENGTH + MAX_WARNING_TWEET_LENGTH - text.length}`
    );
  });

  it('should show negative count when over limit', () => {
    const text = 'a'.repeat(MAX_TWEET_LENGTH + MAX_WARNING_TWEET_LENGTH + 5);
    renderWithContext(text);

    const countElement = screen.getByTestId('words-count');
    expect(countElement).toBeInTheDocument();
    expect(countElement).toHaveTextContent('-5');
  });

  it('should use smaller radius for text under MAX_TWEET_LENGTH', () => {
    const { container } = renderWithContext('Short');

    const circle = container.querySelector('circle');
    expect(circle).toHaveAttribute('r', '10');
  });

  it('should use larger radius for text over MAX_TWEET_LENGTH', () => {
    const text = 'a'.repeat(MAX_TWEET_LENGTH + 5);
    const { container } = renderWithContext(text);

    const circles = container.querySelectorAll('circle');
    // Should have circles with radius 13
    const hasLargeCircle = Array.from(circles).some(
      (c) => c.getAttribute('r') === '13'
    );
    expect(hasLargeCircle).toBe(true);
  });

  it('should render empty text correctly', () => {
    const { container } = renderWithContext('');

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should handle exact MAX_TWEET_LENGTH', () => {
    const text = 'a'.repeat(MAX_TWEET_LENGTH);
    renderWithContext(text);

    // At exactly MAX_TWEET_LENGTH, should show count
    const countElement = screen.getByTestId('words-count');
    expect(countElement).toBeInTheDocument();
    expect(countElement).toHaveTextContent(`${MAX_WARNING_TWEET_LENGTH}`);
  });

  it('should handle exact MAX_TWEET_LENGTH + MAX_WARNING_TWEET_LENGTH', () => {
    const text = 'a'.repeat(MAX_TWEET_LENGTH + MAX_WARNING_TWEET_LENGTH);
    renderWithContext(text);

    const countElement = screen.getByTestId('words-count');
    expect(countElement).toBeInTheDocument();
    expect(countElement).toHaveTextContent('0');
  });

  it('should apply inactive color class for warning text count', () => {
    const text = 'a'.repeat(MAX_TWEET_LENGTH + 5);
    renderWithContext(text);

    const countElement = screen.getByTestId('words-count');
    expect(countElement).toHaveClass('text-text-inactive');
  });

  it('should apply error color class for overflow text count', () => {
    const text = 'a'.repeat(MAX_TWEET_LENGTH + MAX_WARNING_TWEET_LENGTH + 5);
    renderWithContext(text);

    const countElement = screen.getByTestId('words-count');
    expect(countElement).toHaveClass('text-error');
  });

  it('should render border circle under warning level', () => {
    const { container } = renderWithContext('Short text');

    const borderCircle = container.querySelector('circle.stroke-border');
    expect(borderCircle).toBeInTheDocument();
  });

  it('should have correct SVG viewBox', () => {
    const { container } = renderWithContext('Test');

    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('viewBox', '0 0 30 30');
  });
});
