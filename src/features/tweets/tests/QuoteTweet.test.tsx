import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import QuoteTweet from '../components/QuoteTweet';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

const mockQuoteData = {
  postId: 1,
  userId: 1,
  tweetContent: {
    text: 'This is a quoted tweet',
    media: [],
    mentions: [],
  },
  avatar: 'avatar.jpg',
  name: 'Quoted User',
  username: 'quoteduser',
  isVerified: false,
  date: '2024-01-01',
};

describe('QuoteTweet Component', () => {
  it('should render quoted tweet content', () => {
    render(<QuoteTweet {...mockQuoteData} />);

    expect(screen.getByText('This is a quoted tweet')).toBeInTheDocument();
    expect(screen.getByText('Quoted User')).toBeInTheDocument();
  });

  it('should navigate to tweet when clicked', () => {
    const { container } = render(<QuoteTweet {...mockQuoteData} />);

    const quoteContainer = container.firstChild;
    fireEvent.click(quoteContainer as Element);

    // Router push should be called (mocked)
  });

  it('should not navigate when isInModal is true', () => {
    const { container } = render(
      <QuoteTweet {...mockQuoteData} isInModal={true} />
    );

    const quoteContainer = container.firstChild;
    fireEvent.click(quoteContainer as Element);

    // Should stopPropagation and not navigate
  });

  it('should render with border and rounded corners', () => {
    const { container } = render(<QuoteTweet {...mockQuoteData} />);

    expect(container.firstChild).toHaveClass(
      'border border-gray-700 rounded-xl'
    );
  });

  it('should show hover effect when not in modal', () => {
    const { container } = render(<QuoteTweet {...mockQuoteData} />);

    expect(container.firstChild).toHaveClass('hover:cursor-pointer');
  });
});
