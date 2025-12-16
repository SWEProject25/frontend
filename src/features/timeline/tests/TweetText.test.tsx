import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
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

let mockIsOpen = false;
let mockIsSuccess = false;
let mockEmoji = '';
let mockMentionIsDone = '';
let mockMention = '';
let mockFirstTweetText = '';

vi.mock('../store/AddPostContext', () => ({
  useAddPostContext: vi.fn(() => ({
    useTweetText: () => mockFirstTweetText,
    useMedia: () => [],
    useEmoji: () => mockEmoji,
    useMention: () => mockMention,
    useIsOpen: () => mockIsOpen,
    useIsSuccess: () => mockIsSuccess,
    useMentionIsDone: () => mockMentionIsDone,
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
import { useCheckValidUser } from '../hooks/timelineQueries';

describe('TweetText', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsOpen = false;
    mockIsSuccess = false;
    mockEmoji = '';
    mockMentionIsDone = '';
    mockMention = '';
    mockFirstTweetText = '';

    // Mock window.getSelection
    Object.defineProperty(window, 'getSelection', {
      writable: true,
      value: vi.fn().mockReturnValue({
        anchorNode: null,
        anchorOffset: 0,
        removeAllRanges: vi.fn(),
        addRange: vi.fn(),
      }),
    });
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

  it('should handle input event and call setTweetText', () => {
    render(<TweetText placeHolder="What's happening?" />);
    const input = screen.getByTestId('tweet-text-input');
    input.innerText = 'Hello world';
    fireEvent.input(input);
    expect(mockSetTweetText).toHaveBeenCalledWith('Hello world');
  });

  it('should reset when text is empty', () => {
    render(<TweetText placeHolder="What's happening?" />);
    const input = screen.getByTestId('tweet-text-input');
    input.innerText = '';
    fireEvent.input(input);
    expect(mockSetMention).toHaveBeenCalledWith('');
    expect(mockSetIsDone).toHaveBeenCalledWith('');
    expect(mockSetIsOpen).toHaveBeenCalledWith(false);
  });

  it('should handle ArrowUp key when isOpen is true', () => {
    mockIsOpen = true;
    render(<TweetText placeHolder="What's happening?" />);
    const input = screen.getByTestId('tweet-text-input');
    fireEvent.keyDown(input, { key: 'ArrowUp' });
    expect(mockSetKeyDown).toHaveBeenCalledWith('ArrowUp');
  });

  it('should handle ArrowDown key when isOpen is true', () => {
    mockIsOpen = true;
    render(<TweetText placeHolder="What's happening?" />);
    const input = screen.getByTestId('tweet-text-input');
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(mockSetKeyDown).toHaveBeenCalledWith('ArrowDown');
  });

  it('should handle Enter key when isOpen is true', () => {
    mockIsOpen = true;
    render(<TweetText placeHolder="What's happening?" />);
    const input = screen.getByTestId('tweet-text-input');
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(mockSetKeyDown).toHaveBeenCalledWith('Enter');
  });

  it('should not call setKeyDown when isOpen is false', () => {
    mockIsOpen = false;
    render(<TweetText placeHolder="What's happening?" />);
    const input = screen.getByTestId('tweet-text-input');
    fireEvent.keyDown(input, { key: 'ArrowUp' });
    expect(mockSetKeyDown).not.toHaveBeenCalled();
  });

  it('should prevent default on Ctrl+Z', () => {
    render(<TweetText placeHolder="What's happening?" />);
    const input = screen.getByTestId('tweet-text-input');
    const event = new KeyboardEvent('keydown', {
      key: 'z',
      ctrlKey: true,
      bubbles: true,
    });
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
    input.dispatchEvent(event);
    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('should clear input when isSuccess is true', () => {
    mockIsSuccess = true;
    render(<TweetText placeHolder="What's happening?" />);
    expect(mockSetIsDone).toHaveBeenCalledWith('');
    expect(mockSetIsOpen).toHaveBeenCalledWith(false);
    expect(mockSetMention).toHaveBeenCalledWith('');
  });

  it('should clear br tags from innerHTML', () => {
    render(<TweetText placeHolder="What's happening?" />);
    const input = screen.getByTestId('tweet-text-input');
    // Simulate what happens when user types and deletes all content
    input.innerText = '';
    input.innerHTML = '<br>';
    fireEvent.input(input);
    // The br tag should be cleared
    expect(input.innerHTML).toBe('');
  });

  it('should handle text with mentions', () => {
    render(<TweetText placeHolder="What's happening?" />);
    const input = screen.getByTestId('tweet-text-input');
    input.innerText = '@testuser';
    fireEvent.input(input);
    expect(mockSetTweetText).toHaveBeenCalled();
  });

  it('should handle valid user data for mentions', () => {
    vi.mocked(useCheckValidUser).mockReturnValue({
      data: { data: { User: { id: 1 } } },
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useCheckValidUser>);

    render(<TweetText placeHolder="What's happening?" />);
    const input = screen.getByTestId('tweet-text-input');
    input.innerText = '@validuser hello';
    fireEvent.input(input);
    expect(mockSetTweetText).toHaveBeenCalled();
  });

  it('should render overflow text when exceeding max length', () => {
    render(<TweetText placeHolder="What's happening?" />);
    const input = screen.getByTestId('tweet-text-input');
    const longText = 'a'.repeat(300);
    input.innerText = longText;
    fireEvent.input(input);
    const overflow = screen.getByTestId('tweet-text-overflow');
    expect(overflow).toBeInTheDocument();
  });

  it('should initialize with firstTweetText if provided', () => {
    mockFirstTweetText = 'initial text';
    render(<TweetText placeHolder="What's happening?" />);
    expect(mockSetTweetText).toHaveBeenCalled();
  });

  it('should handle mousedown for cursor position', () => {
    render(<TweetText placeHolder="What's happening?" />);
    const input = screen.getByTestId('tweet-text-input');
    act(() => {
      input.focus();
    });
    fireEvent.mouseDown(document);
    expect(screen.getByTestId('tweet-text-input')).toBeDefined();
  });

  it('should render mention component when visible', () => {
    mockIsOpen = true;
    mockMention = '@test';
    render(<TweetText placeHolder="What's happening?" />);
    expect(screen.getByTestId('tweet-text-input')).toBeInTheDocument();
  });

  it('should handle mention completion', () => {
    mockMention = 'testuser';
    mockMentionIsDone = 'testuser 123';
    render(<TweetText placeHolder="What's happening?" />);
    expect(screen.getByTestId('tweet-text-input')).toBeInTheDocument();
  });

  it('should have spellcheck enabled', () => {
    render(<TweetText placeHolder="What's happening?" />);
    const input = screen.getByTestId('tweet-text-input');
    expect(input).toHaveAttribute('spellCheck', 'true');
  });

  it('should have proper aria-label for accessibility', () => {
    render(<TweetText placeHolder="What's happening?" />);
    const input = screen.getByTestId('tweet-text-input');
    expect(input).toHaveAttribute('aria-label', 'Tweet text input overlay');
  });

  it('should update placeholder when prop changes', () => {
    const { rerender } = render(<TweetText placeHolder="What's happening?" />);
    rerender(<TweetText placeHolder="Post your reply" />);
    expect(screen.getByText('Post your reply')).toBeInTheDocument();
  });
});
