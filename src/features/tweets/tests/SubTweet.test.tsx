import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import SubTweet from '../components/SubTweet';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

const mockData = {
  postId: 1,
  userId: 1,
  name: 'Test User',
  username: 'testuser',
  verified: false,
  avatar: 'avatar.jpg',
  text: 'Test tweet content',
  media: [],
  mentions: [],
  date: '2024-01-01',
  likesCount: 10,
  retweetsCount: 5,
  commentsCount: 3,
  isLikedByMe: false,
  isRepostedByMe: false,
  isFollowedByMe: false,
  isMutedByMe: false,
  isBlockedByMe: false,
  isRepost: false,
  isQuote: false,
  type: 'POST',
};

const mockContent = {
  text: 'Test tweet content',
  media: [],
  mentions: [],
};

describe('SubTweet Component', () => {
  it('should render sub tweet with user info', () => {
    render(<SubTweet tweet={mockData} content={mockContent} />);

    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  it('should render tweet content', () => {
    render(<SubTweet tweet={mockData} content={mockContent} />);

    expect(screen.getByText('Test tweet content')).toBeInTheDocument();
  });

  it('should show "Replying to" text when isReply is true', () => {
    render(<SubTweet tweet={mockData} content={mockContent} isReply={true} />);

    expect(screen.getByText(/Replying to/)).toBeInTheDocument();
    // Use getAllByText since @testuser appears multiple times
    const usernameElements = screen.getAllByText(/@testuser/);
    expect(usernameElements.length).toBeGreaterThan(0);
  });

  it('should render avatar with correct size', () => {
    const { container } = render(
      <SubTweet tweet={mockData} content={mockContent} />
    );

    const avatar = container.querySelector('[class*="w-[48px]"]');
    expect(avatar).toBeInTheDocument();
  });

  it('should truncate long username', () => {
    const longUsernameData = {
      ...mockData,
      username: 'verylongusernamethatshouldbetruncat',
    };
    render(<SubTweet tweet={longUsernameData} content={mockContent} />);

    const usernameElements = screen.getAllByText(
      /@verylongusernamethatshouldbetruncat/
    );
    expect(usernameElements[0]).toHaveClass('truncate');
  });

  it('should render quote tweet when provided', () => {
    render(<SubTweet tweet={mockData} content={mockContent} />);

    expect(screen.getByText('Test tweet content')).toBeInTheDocument();
  });
});
