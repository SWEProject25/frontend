import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import TweetSubmitSection from '../components/TweetSubmitSection';

vi.mock('@/components/ui/home/Button', () => ({
  default: ({
    label,
    disabled,
    onClick,
    'data-testid': testId,
    height,
    width,
    size,
  }: any) => (
    <button
      data-testid={testId}
      disabled={disabled}
      onClick={onClick}
      className={`${height} ${width} ${size}`}
    >
      {label}
    </button>
  ),
}));

vi.mock('./TypingProgressCircle', () => ({
  default: () => <div data-testid="typing-progress-circle">Progress</div>,
}));

vi.mock('../components/TypingProgressCircle', () => ({
  default: () => <div data-testid="typing-progress-circle">Progress</div>,
}));

describe('TweetSubmitSection Component', () => {
  const mockHandleAddTweet = vi.fn();

  beforeEach(() => {
    mockHandleAddTweet.mockClear();
  });

  it('should render the submit section container', () => {
    render(
      <TweetSubmitSection
        enableSection={false}
        enableAddTweet={false}
        handleAddTweet={mockHandleAddTweet}
        label="Post"
      />
    );

    const container = screen.getByTestId('tweet-submit-section');
    expect(container).toBeInTheDocument();
  });

  it('should render the submit button with correct label', () => {
    render(
      <TweetSubmitSection
        enableSection={false}
        enableAddTweet={true}
        handleAddTweet={mockHandleAddTweet}
        label="Post"
      />
    );

    const button = screen.getByTestId('tweet-post-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Post');
  });

  it('should render button with "Reply" label', () => {
    render(
      <TweetSubmitSection
        enableSection={false}
        enableAddTweet={true}
        handleAddTweet={mockHandleAddTweet}
        label="Reply"
      />
    );

    const button = screen.getByTestId('tweet-post-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Reply');
  });

  it('should disable button when enableAddTweet is false', () => {
    render(
      <TweetSubmitSection
        enableSection={false}
        enableAddTweet={false}
        handleAddTweet={mockHandleAddTweet}
        label="Post"
      />
    );

    const button = screen.getByTestId('tweet-post-button');
    expect(button).toBeDisabled();
  });

  it('should enable button when enableAddTweet is true', () => {
    render(
      <TweetSubmitSection
        enableSection={false}
        enableAddTweet={true}
        handleAddTweet={mockHandleAddTweet}
        label="Post"
      />
    );

    const button = screen.getByTestId('tweet-post-button');
    expect(button).not.toBeDisabled();
  });

  it('should call handleAddTweet when button is clicked', () => {
    render(
      <TweetSubmitSection
        enableSection={false}
        enableAddTweet={true}
        handleAddTweet={mockHandleAddTweet}
        label="Post"
      />
    );

    const button = screen.getByTestId('tweet-post-button');
    fireEvent.click(button);

    expect(mockHandleAddTweet).toHaveBeenCalledTimes(1);
  });

  it('should not call handleAddTweet when button is disabled', () => {
    render(
      <TweetSubmitSection
        enableSection={false}
        enableAddTweet={false}
        handleAddTweet={mockHandleAddTweet}
        label="Post"
      />
    );

    const button = screen.getByTestId('tweet-post-button');
    fireEvent.click(button);

    expect(mockHandleAddTweet).not.toHaveBeenCalled();
  });

  it('should not show progress section when enableSection is false', () => {
    render(
      <TweetSubmitSection
        enableSection={false}
        enableAddTweet={true}
        handleAddTweet={mockHandleAddTweet}
        label="Post"
      />
    );

    // The border divider should not be present
    const container = screen.getByTestId('tweet-submit-section');
    const borderElement = container.querySelector('.border-l-2');
    expect(borderElement).not.toBeInTheDocument();
  });

  it('should show progress section when enableSection is true', () => {
    render(
      <TweetSubmitSection
        enableSection={true}
        enableAddTweet={true}
        handleAddTweet={mockHandleAddTweet}
        label="Post"
      />
    );

    // The border divider should be present
    const container = screen.getByTestId('tweet-submit-section');
    const borderElement = container.querySelector('.border-l-2');
    expect(borderElement).toBeInTheDocument();
  });

  it('should have correct styling classes', () => {
    render(
      <TweetSubmitSection
        enableSection={false}
        enableAddTweet={true}
        handleAddTweet={mockHandleAddTweet}
        label="Post"
      />
    );

    const container = screen.getByTestId('tweet-submit-section');
    expect(container).toHaveClass('flex');
    expect(container).toHaveClass('flex-row-reverse');
    expect(container).toHaveClass('items-center');
    expect(container).toHaveClass('mt-2');
  });

  it('should render with different labels', () => {
    const { rerender } = render(
      <TweetSubmitSection
        enableSection={false}
        enableAddTweet={true}
        handleAddTweet={mockHandleAddTweet}
        label="Post"
      />
    );

    expect(screen.getByTestId('tweet-post-button')).toBeInTheDocument();

    rerender(
      <TweetSubmitSection
        enableSection={false}
        enableAddTweet={true}
        handleAddTweet={mockHandleAddTweet}
        label="Reply"
      />
    );

    expect(screen.getByTestId('tweet-post-button')).toBeInTheDocument();
  });

  it('should handle multiple clicks when enabled', () => {
    render(
      <TweetSubmitSection
        enableSection={false}
        enableAddTweet={true}
        handleAddTweet={mockHandleAddTweet}
        label="Post"
      />
    );

    const button = screen.getByTestId('tweet-post-button');
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);

    expect(mockHandleAddTweet).toHaveBeenCalledTimes(3);
  });
});
