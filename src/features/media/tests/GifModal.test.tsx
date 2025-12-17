import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    back: vi.fn(),
  })),
}));

// Mock next/image
vi.mock('next/image', () => ({
  default: function MockImage(props: {
    src: string;
    alt: string;
    fill?: boolean;
    sizes?: string;
    className?: string;
    priority?: boolean;
    width?: number;
    height?: number;
  }) {
    return (
      <div
        data-testid={`image-${props.alt}`}
        data-src={props.src}
        data-alt={props.alt}
        className={props.className}
      />
    );
  },
}));

// Mock XModal
vi.mock('@/components/ui/hoc/XModal', () => ({
  default: function MockXModal({
    isOpen,
    onClose,
    children,
  }: {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
  }) {
    if (!isOpen) return null;
    return (
      <div data-testid="x-modal">
        <button data-testid="modal-close" onClick={onClose}>
          Close
        </button>
        {children}
      </div>
    );
  },
}));

// Mock Icon
vi.mock('@/components/ui/home/Icon', () => ({
  default: function MockIcon(props: { onClick?: () => void }) {
    return (
      <button data-testid="icon-close" onClick={props.onClick}>
        X
      </button>
    );
  },
}));

// Mock SearchInput
vi.mock('@/components/ui/input', () => ({
  SearchInput: function MockSearchInput({
    value,
    onChange,
    placeholder,
  }: {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
  }) {
    return (
      <input
        data-testid="search-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    );
  },
}));

// Mock Loader
vi.mock('@/components/generic', () => ({
  Loader: function MockLoader() {
    return <div data-testid="loader">Loading...</div>;
  },
}));

// Mock InfiniteScroll
vi.mock('@/components/ui/home/InfiniteScroll', () => ({
  default: function MockInfiniteScroll({
    children,
    loadMore,
    hasMoreData,
  }: {
    children: React.ReactNode;
    loadMore: () => void;
    hasMoreData: boolean;
  }) {
    return (
      <div data-testid="infinite-scroll">
        {children}
        {hasMoreData && (
          <button data-testid="load-more" onClick={loadMore}>
            Load More
          </button>
        )}
      </div>
    );
  },
}));

// Mock ToasterMessage
vi.mock('@/components/ui/home/ToasterMessage', () => ({
  default: vi.fn(),
}));

// Use vi.hoisted for mocks used inside vi.mock factories
const {
  mockSearchCategories,
  mockSearchGif,
  mockClose,
  mockSetSearch,
  mockAddGifs,
  mockUseGifVisibility,
  mockUseGifsSearch,
} = vi.hoisted(() => ({
  mockSearchCategories: vi.fn(),
  mockSearchGif: vi.fn(),
  mockClose: vi.fn(),
  mockSetSearch: vi.fn(),
  mockAddGifs: vi.fn(),
  mockUseGifVisibility: vi.fn(),
  mockUseGifsSearch: vi.fn(),
}));

// Mock hooks
vi.mock('../hooks/mediaQueries', () => ({
  useSearchCategories: () => mockSearchCategories(),
  useSearchGif: () => mockSearchGif(),
}));

// Mock AddPostContext
vi.mock('@/features/timeline/store/AddPostContext', () => ({
  useAddPostContext: vi.fn(() => ({
    useActions: () => ({
      close: mockClose,
      setSearch: mockSetSearch,
      addGifs: mockAddGifs,
    }),
    useGifVisibility: mockUseGifVisibility,
    useGifsSearch: mockUseGifsSearch,
  })),
}));

// Mock gifApi
vi.mock('../services/gifAPi', () => ({
  gifApi: {
    getCategories: vi.fn(),
    searchGif: vi.fn(),
  },
}));

// Mock constants
vi.mock('../constants/data', () => ({
  gifs: [],
}));

vi.mock('../constants/api', () => ({
  CATERGORIES: [
    'Trending',
    'Reactions',
    'Entertainment',
    'Sports',
    'Stickers',
    'Artists',
    'Anime',
    'News',
  ],
}));

import GifModal from '../components/GifModal';

describe('GifModal Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseGifVisibility.mockReturnValue(true);
    mockUseGifsSearch.mockReturnValue('');
    mockSearchCategories.mockReturnValue({
      data: [
        {
          id: '1',
          title: 'Category 1',
          images: { original: { url: 'https://example.com/1.gif' } },
        },
        {
          id: '2',
          title: 'Category 2',
          images: { original: { url: 'https://example.com/2.gif' } },
        },
      ],
      status: 'success',
      error: null,
    });
    mockSearchGif.mockReturnValue({
      data: null,
      error: null,
      isError: null,
      isLoading: null,
      fetchNextPage: null,
      isFetchingNextPage: null,
      hasNextPage: null,
    });
  });

  it('should not render when not open', () => {
    mockUseGifVisibility.mockReturnValue(false);
    const { container } = render(<GifModal />);
    expect(container.firstChild).toBeNull();
  });

  it('should render modal when open', () => {
    render(<GifModal />);
    expect(screen.getByTestId('x-modal')).toBeInTheDocument();
  });

  it('should render search input', () => {
    render(<GifModal />);
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('search for GIFs')).toBeInTheDocument();
  });

  it('should render close icon', () => {
    render(<GifModal />);
    expect(screen.getByTestId('icon-close')).toBeInTheDocument();
  });

  it('should call close and clear search on close', () => {
    render(<GifModal />);
    const closeIcon = screen.getByTestId('icon-close');
    fireEvent.click(closeIcon);

    expect(mockClose).toHaveBeenCalled();
    expect(mockSetSearch).toHaveBeenCalledWith('');
  });

  it('should render loader when pending', () => {
    mockSearchCategories.mockReturnValue({
      data: null,
      status: 'pending',
      error: null,
    });

    render(<GifModal />);
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('should render categories when search is empty', () => {
    render(<GifModal />);
    expect(screen.getByTestId('image-Category 1')).toBeInTheDocument();
    expect(screen.getByTestId('image-Category 2')).toBeInTheDocument();
  });

  it('should update search on input change', () => {
    render(<GifModal />);
    const input = screen.getByTestId('search-input');
    fireEvent.change(input, { target: { value: 'funny' } });

    expect(mockSetSearch).toHaveBeenCalledWith('funny');
  });

  it('should render searched gifs when search has value', () => {
    mockUseGifsSearch.mockReturnValue('funny');
    mockSearchGif.mockReturnValue({
      data: {
        pages: [
          {
            data: [
              {
                id: 'gif1',
                title: 'Funny GIF',
                images: {
                  fixed_width_downsampled: {
                    url: 'https://example.com/funny.gif',
                  },
                },
              },
            ],
            pagination: { count: 1, offset: 0, total_count: 1 },
          },
        ],
      },
      error: null,
      isError: false,
      isLoading: false,
      fetchNextPage: vi.fn(),
      isFetchingNextPage: false,
      hasNextPage: false,
    });

    render(<GifModal />);
    expect(screen.getByTestId('render-gif-list')).toBeInTheDocument();
  });

  it('should add gif and close modal when gif is clicked', () => {
    mockUseGifsSearch.mockReturnValue('funny');
    mockSearchGif.mockReturnValue({
      data: {
        pages: [
          {
            data: [
              {
                id: 'gif1',
                title: 'Funny GIF',
                images: {
                  fixed_width_downsampled: {
                    url: 'https://example.com/funny.gif',
                  },
                },
              },
            ],
            pagination: { count: 1, offset: 0, total_count: 1 },
          },
        ],
      },
      error: null,
      isError: false,
      isLoading: false,
      fetchNextPage: vi.fn(),
      isFetchingNextPage: false,
      hasNextPage: false,
    });

    render(<GifModal />);
    const gifImage = screen.getByTestId('image-Funny GIF');
    fireEvent.click(gifImage.parentElement!);

    expect(mockAddGifs).toHaveBeenCalled();
    expect(mockClose).toHaveBeenCalled();
  });

  it('should show loader when searching', () => {
    mockUseGifsSearch.mockReturnValue('funny');
    mockSearchGif.mockReturnValue({
      data: null,
      error: null,
      isError: false,
      isLoading: true,
      fetchNextPage: vi.fn(),
      isFetchingNextPage: false,
      hasNextPage: false,
    });

    render(<GifModal />);
    expect(screen.getByTestId('tweet-list-loading')).toBeInTheDocument();
  });

  it('should search category when category is clicked', () => {
    render(<GifModal />);
    const categoryImage = screen.getByTestId('image-Category 1');
    fireEvent.click(categoryImage.parentElement!);

    expect(mockSetSearch).toHaveBeenCalledWith('Trending');
  });

  it('should render infinite scroll with load more', () => {
    mockUseGifsSearch.mockReturnValue('funny');
    mockSearchGif.mockReturnValue({
      data: {
        pages: [
          {
            data: [
              {
                id: 'gif1',
                title: 'Funny GIF',
                images: {
                  fixed_width_downsampled: {
                    url: 'https://example.com/funny.gif',
                  },
                },
              },
            ],
            pagination: { count: 1, offset: 0, total_count: 10 },
          },
        ],
      },
      error: null,
      isError: false,
      isLoading: false,
      fetchNextPage: vi.fn(),
      isFetchingNextPage: false,
      hasNextPage: true,
    });

    render(<GifModal />);
    expect(screen.getByTestId('infinite-scroll')).toBeInTheDocument();
  });

  it('should handle categories fetch error', async () => {
    const mockError = new Error('Failed to fetch categories');
    mockSearchCategories.mockReturnValue({
      data: null,
      status: 'error',
      error: mockError,
    });

    render(<GifModal />);

    // Verify error state is triggered (toasterMessage and router.push are called)
    const toasterMessage = await import(
      '@/components/ui/home/ToasterMessage'
    ).then((m) => m.default);
    expect(toasterMessage).toHaveBeenCalledWith(
      'Failed to fetch categories',
      'bottom-center',
      'error'
    );
  });

  it('should handle gif search error', async () => {
    mockUseGifsSearch.mockReturnValue('test');
    const mockError = new Error('Failed to search gifs');
    mockSearchGif.mockReturnValue({
      data: null,
      error: mockError,
      isError: true,
      isLoading: false,
      fetchNextPage: vi.fn(),
      isFetchingNextPage: false,
      hasNextPage: false,
    });

    render(<GifModal />);

    // Verify error state is triggered
    const toasterMessage = await import(
      '@/components/ui/home/ToasterMessage'
    ).then((m) => m.default);
    expect(toasterMessage).toHaveBeenCalledWith(
      'Failed to search gifs',
      'bottom-center',
      'error'
    );
  });
});
