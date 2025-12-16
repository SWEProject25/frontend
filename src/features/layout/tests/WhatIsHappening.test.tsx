import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@/test/test-utils';
import WhatIsHappening from '../components/WhatIsHappening';

const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: mockPush,
    replace: vi.fn(),
    prefetch: vi.fn(),
  })),
}));

const mockUseTrendingHashtags = vi.fn();

vi.mock('../hooks/useTrendingHashtags', () => ({
  useTrendingHashtags: () => mockUseTrendingHashtags(),
}));

describe('WhatIsHappening', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseTrendingHashtags.mockReturnValue({
      data: { data: { trending: [] }, metadata: { category: 'Trending' } },
      isLoading: false,
    });
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

  it('should render loading state when isLoading is true', () => {
    mockUseTrendingHashtags.mockReturnValue({
      data: undefined,
      isLoading: true,
    });
    render(<WhatIsHappening />);
    expect(screen.getByText(/what's happening/i)).toBeInTheDocument();
    // XLoader should be rendered
    expect(screen.queryByText(/show more/i)).not.toBeInTheDocument();
  });

  it('should render trending hashtags', () => {
    mockUseTrendingHashtags.mockReturnValue({
      data: {
        data: {
          trending: [
            { tag: '#React', totalPosts: 1000 },
            { tag: 'JavaScript', totalPosts: 500 },
          ],
        },
        metadata: { category: 'Technology' },
      },
      isLoading: false,
    });
    render(<WhatIsHappening />);
    expect(screen.getByText('#React')).toBeInTheDocument();
    expect(screen.getByText('#JavaScript')).toBeInTheDocument();
    expect(screen.getByText('1,000 posts')).toBeInTheDocument();
    expect(screen.getByText('500 posts')).toBeInTheDocument();
  });

  it('should render category from metadata', () => {
    mockUseTrendingHashtags.mockReturnValue({
      data: {
        data: {
          trending: [{ tag: '#Test', totalPosts: 100 }],
        },
        metadata: { category: 'Sports' },
      },
      isLoading: false,
    });
    render(<WhatIsHappening />);
    expect(screen.getByText('Sports')).toBeInTheDocument();
  });

  it('should render "Show more" link', () => {
    mockUseTrendingHashtags.mockReturnValue({
      data: { data: { trending: [] }, metadata: {} },
      isLoading: false,
    });
    render(<WhatIsHappening />);
    const showMoreLink = screen.getByText(/show more/i);
    expect(showMoreLink).toBeInTheDocument();
    expect(showMoreLink).toHaveAttribute('href', '/explore/tabs/general');
  });

  it('should navigate to search when trend is clicked', () => {
    mockUseTrendingHashtags.mockReturnValue({
      data: {
        data: {
          trending: [{ tag: '#TestTag', totalPosts: 50 }],
        },
        metadata: { category: 'Trending' },
      },
      isLoading: false,
    });
    render(<WhatIsHappening />);
    const trendItem = screen.getByText('#TestTag').closest('div');
    fireEvent.click(trendItem!);
    expect(mockPush).toHaveBeenCalledWith('/search?q=%23TestTag');
  });

  it('should navigate with raw tag without hashtag prefix', () => {
    mockUseTrendingHashtags.mockReturnValue({
      data: {
        data: {
          trending: [{ tag: 'RawTag', totalPosts: 30 }],
        },
        metadata: { category: 'Trending' },
      },
      isLoading: false,
    });
    render(<WhatIsHappening />);
    const trendItem = screen.getByText('#RawTag').closest('div');
    fireEvent.click(trendItem!);
    expect(mockPush).toHaveBeenCalledWith('/search?q=RawTag');
  });

  it('should handle empty trending data', () => {
    mockUseTrendingHashtags.mockReturnValue({
      data: { data: { trending: [] }, metadata: {} },
      isLoading: false,
    });
    render(<WhatIsHappening />);
    expect(screen.getByText(/what's happening/i)).toBeInTheDocument();
    expect(screen.getByText(/show more/i)).toBeInTheDocument();
  });

  it('should handle undefined data response', () => {
    mockUseTrendingHashtags.mockReturnValue({
      data: undefined,
      isLoading: false,
    });
    render(<WhatIsHappening />);
    expect(screen.getByText(/what's happening/i)).toBeInTheDocument();
  });

  it('should handle null trending array', () => {
    mockUseTrendingHashtags.mockReturnValue({
      data: { data: { trending: null }, metadata: {} },
      isLoading: false,
    });
    render(<WhatIsHappening />);
    expect(screen.getByText(/show more/i)).toBeInTheDocument();
  });

  it('should use default category when metadata is empty', () => {
    mockUseTrendingHashtags.mockReturnValue({
      data: {
        data: {
          trending: [{ tag: '#Default', totalPosts: 10 }],
        },
        metadata: {},
      },
      isLoading: false,
    });
    render(<WhatIsHappening />);
    expect(screen.getByText('Trending')).toBeInTheDocument();
  });

  it('should display multiple trending hashtags', () => {
    mockUseTrendingHashtags.mockReturnValue({
      data: {
        data: {
          trending: [
            { tag: '#Tag1', totalPosts: 100 },
            { tag: '#Tag2', totalPosts: 200 },
            { tag: '#Tag3', totalPosts: 300 },
          ],
        },
        metadata: { category: 'Trending' },
      },
      isLoading: false,
    });
    render(<WhatIsHappening />);
    expect(screen.getByText('#Tag1')).toBeInTheDocument();
    expect(screen.getByText('#Tag2')).toBeInTheDocument();
    expect(screen.getByText('#Tag3')).toBeInTheDocument();
  });

  it('should format large post counts with locale string', () => {
    mockUseTrendingHashtags.mockReturnValue({
      data: {
        data: {
          trending: [{ tag: '#Popular', totalPosts: 1234567 }],
        },
        metadata: { category: 'Trending' },
      },
      isLoading: false,
    });
    render(<WhatIsHappening />);
    expect(screen.getByText('1,234,567 posts')).toBeInTheDocument();
  });

  it('should apply hover styles on trend item', () => {
    mockUseTrendingHashtags.mockReturnValue({
      data: {
        data: {
          trending: [{ tag: '#Hover', totalPosts: 10 }],
        },
        metadata: { category: 'Trending' },
      },
      isLoading: false,
    });
    render(<WhatIsHappening />);
    const trendItem = screen.getByText('#Hover').closest('div');
    expect(trendItem).toHaveClass('hover:bg-[#1D1F23]');
    expect(trendItem).toHaveClass('cursor-pointer');
  });

  it('should render posts count text', () => {
    mockUseTrendingHashtags.mockReturnValue({
      data: {
        data: {
          trending: [{ tag: '#Count', totalPosts: 42 }],
        },
        metadata: { category: 'Trending' },
      },
      isLoading: false,
    });
    render(<WhatIsHappening />);
    expect(screen.getByText('42 posts')).toBeInTheDocument();
  });

  it('should handle hashtag with special characters in URL', () => {
    mockUseTrendingHashtags.mockReturnValue({
      data: {
        data: {
          trending: [{ tag: '#Test&Special', totalPosts: 10 }],
        },
        metadata: { category: 'Trending' },
      },
      isLoading: false,
    });
    render(<WhatIsHappening />);
    const trendItem = screen.getByText('#Test&Special').closest('div');
    fireEvent.click(trendItem!);
    expect(mockPush).toHaveBeenCalledWith('/search?q=%23Test%26Special');
  });

  it('should handle undefined metadata', () => {
    mockUseTrendingHashtags.mockReturnValue({
      data: {
        data: {
          trending: [{ tag: '#NoMeta', totalPosts: 5 }],
        },
        metadata: undefined,
      },
      isLoading: false,
    });
    render(<WhatIsHappening />);
    expect(screen.getByText('Trending')).toBeInTheDocument();
  });

  it('should have border styling on container', () => {
    const { container } = render(<WhatIsHappening />);
    const mainContainer = container.firstChild;
    expect(mainContainer).toHaveClass('border');
    expect(mainContainer).toHaveClass('border-gray-700');
  });

  it('should have proper heading styling', () => {
    render(<WhatIsHappening />);
    const heading = screen.getByText(/what's happening/i);
    expect(heading).toHaveClass('text-xl');
    expect(heading).toHaveClass('font-bold');
    expect(heading).toHaveClass('text-white');
  });
});
