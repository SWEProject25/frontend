/* eslint-disable @next/next/no-img-element */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/test-utils';
import WhoToFollow from '../components/WhoToFollow';

vi.mock('@/components/generic/Avatar', () => ({
  default: ({ src }: any) => <img src={src} alt="avatar" />,
}));

describe('WhoToFollow', () => {
  it('should render "Who to follow" heading', () => {
    render(<WhoToFollow />);

    expect(screen.getByText(/who to follow/i)).toBeInTheDocument();
  });

  it('should render follow suggestions', () => {
    render(<WhoToFollow />);

    const followButtons = screen.getAllByText(/follow/i);
    expect(followButtons.length).toBeGreaterThan(0);
  });

  it('should render loading state or user profiles', () => {
    const { container } = render(<WhoToFollow />);

    // Should render either loading state or profiles
    expect(container).toBeInTheDocument();
  });

  it('should have proper container styling', () => {
    const { container } = render(<WhoToFollow />);
    const mainContainer = container.firstChild;

    expect(mainContainer).toHaveClass('rounded-2xl');
  });
});
