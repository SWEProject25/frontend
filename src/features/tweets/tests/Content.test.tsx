import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Content from '../components/Content';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

const mockContent = {
  text: 'Hello @user this is a #test tweet',
  media: [],
  mentions: [{ userId: 1, username: 'user' }],
};

describe('Content Component', () => {
  it('should render text content', () => {
    render(<Content content={mockContent} />);

    expect(screen.getByTestId('tweet-content')).toBeInTheDocument();
    expect(screen.getByText(/Hello/)).toBeInTheDocument();
  });

  it('should render mentions as blue links', () => {
    render(<Content content={mockContent} />);

    const mention = screen.getByText('@user');
    expect(mention).toHaveClass('text-blue-400');
  });

  it('should render hashtags as blue clickable text', () => {
    render(<Content content={mockContent} />);

    const hashtag = screen.getByText('#test');
    expect(hashtag).toHaveClass('text-blue-400');
  });
});
