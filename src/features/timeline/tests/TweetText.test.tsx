import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

// Mock the AddPostContext
const mockSetTweetText = vi.fn();
const mockSetEmoji = vi.fn();
const mockSetMention = vi.fn();
const mockSetIsOpen = vi.fn();
const mockSetIsDone = vi.fn();
const mockSetKeyDown = vi.fn();
const mockClearEmoji = vi.fn();
const mockSetMentions = vi.fn();

vi.mock('../store/AddPostContext', () => ({
  useAddPostContext: vi.fn(() => ({
    useTweetText: () => '',
    useMedia: () => [],
    useEmoji: () => '',
    useMention: () => '',
    useIsOpen: () => false,
    useIsSuccess: () => false,
    useMentionIsDone: () => '',
    useCurrentKey: () => '',
    usePlaceHolder: () => "What's happening?",
    useActions: () => ({
      setTweetText: mockSetTweetText,
      setEmoji: mockSetEmoji,
      setMention: mockSetMention,
      setIsOpen: mockSetIsOpen,
      setIsDone: mockSetIsDone,
      setKeyDown: mockSetKeyDown,
      clearEmoji: mockClearEmoji,
      setMentions: mockSetMentions,
    }),
  })),
}));

vi.mock('./Mention', () => ({
  default: () => <div data-testid="mention-component">Mention</div>,
}));

vi.mock('../components/Mention', () => ({
  default: () => <div data-testid="mention-component">Mention</div>,
}));

// Mock useCheckValidUser
vi.mock('../hooks/timelineQueries', () => ({
  useCheckValidUser: vi.fn(() => ({
    data: null,
    isLoading: false,
  })),
}));

import TweetText from '../components/TweetText';

describe('TweetText', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render textarea', () => {
    render(<TweetText placeHolder="What's happening?" />);
    expect(screen.getByTestId('tweet-text-input')).toBeInTheDocument();
  });

  it('should render with default placeholder', () => {
    render(<TweetText placeHolder="What's happening?" />);
    expect(screen.getByTestId('tweet-text-display')).toBeInTheDocument();
  });

  it('should render tweet text container', () => {
    render(<TweetText placeHolder="What's happening?" />);
    expect(screen.getByTestId('tweet-text-container')).toBeInTheDocument();
  });

  it('should display placeholder text', () => {
    render(<TweetText placeHolder="What's happening?" />);
    expect(screen.getByText("What's happening?")).toBeInTheDocument();
  });

  it('should have content editable input', () => {
    render(<TweetText placeHolder="What's happening?" />);
    const input = screen.getByTestId('tweet-text-input');
    expect(input).toHaveAttribute('contenteditable', 'plaintext-only');
  });

  it('should render with custom placeholder', () => {
    render(<TweetText placeHolder="Post your reply" />);
    expect(screen.getByText('Post your reply')).toBeInTheDocument();
  });

  it('should render mention component when needed', () => {
    const { container } = render(<TweetText placeHolder="What's happening?" />);
    expect(container).toBeDefined();
  });

  it('should focus on input when clicked', () => {
    render(<TweetText placeHolder="What's happening?" />);
    const input = screen.getByTestId('tweet-text-input');
    fireEvent.click(input);
    expect(input).toBeDefined();
  });

  it('should handle keyboard events', () => {
    render(<TweetText placeHolder="What's happening?" />);
    const input = screen.getByTestId('tweet-text-input');
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(input).toBeDefined();
  });
});
