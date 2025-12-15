import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/test-utils';
import WhatIsHappening from '../components/WhatIsHappening';
import { useRouter } from 'next/navigation';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

vi.mock('@/features/explore/hooks/useTrendingHashtags', () => ({
  useTrendingHashtags: vi.fn(() => ({
    data: { data: { trendingHashtags: [] } },
    isLoading: false,
  })),
}));

describe('WhatIsHappening', () => {
  beforeEach(() => {
    vi.mocked(useRouter).mockReturnValue({
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
    } as any);
  });
  it('should render "What\'s happening" heading', () => {
    render(<WhatIsHappening />);

    expect(screen.getByText(/what's happening/i)).toBeInTheDocument();
  });

  it('should render without errors', () => {
    const { container } = render(<WhatIsHappening />);

    expect(container.firstChild).toBeInTheDocument();
  });

  it('should have proper container styling', () => {
    const { container } = render(<WhatIsHappening />);
    const mainContainer = container.firstChild;

    expect(mainContainer).toHaveClass('rounded-2xl');
  });

  it('should render component without crashing', () => {
    const { container } = render(<WhatIsHappening />);

    expect(container).toBeInTheDocument();
  });
});
