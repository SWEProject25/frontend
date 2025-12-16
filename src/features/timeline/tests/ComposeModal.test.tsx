import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import ComposeModal from '../components/ComposeModal';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock the AddTweet component with correct path
vi.mock('../components/AddTweet', () => ({
  default: ({ type }: { type: string }) => (
    <div data-testid="add-tweet-mock">AddTweet component with type: {type}</div>
  ),
}));

vi.mock('./AddTweet', () => ({
  default: ({ type }: { type: string }) => (
    <div data-testid="add-tweet-mock">AddTweet component with type: {type}</div>
  ),
}));

// Mock XModal
vi.mock('@/components/ui/hoc/XModal', () => ({
  default: ({
    isOpen,
    onClose,
    children,
    overlayColor,
    size,
  }: {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    overlayColor?: string;
    size?: string;
    title?: string;
    padding?: string;
    showCloseButton?: boolean;
    showLogo?: boolean;
  }) =>
    isOpen ? (
      <div
        data-testid="x-modal"
        data-overlay-color={overlayColor}
        data-size={size}
      >
        <button data-testid="close-button" onClick={onClose}>
          Close
        </button>
        {children}
      </div>
    ) : null,
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  })),
  usePathname: vi.fn(() => '/home'),
  useSearchParams: vi.fn(() => new URLSearchParams()),
}));

describe('ComposeModal Component', () => {
  const mockOnClose = vi.fn();
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it('should not render when isOpen is false', () => {
    render(<ComposeModal isOpen={false} onClose={mockOnClose} />, { wrapper });

    expect(screen.queryByTestId('x-modal')).not.toBeInTheDocument();
  });

  it('should render when isOpen is true', () => {
    render(<ComposeModal isOpen={true} onClose={mockOnClose} />, { wrapper });

    expect(screen.getByTestId('x-modal')).toBeInTheDocument();
  });

  it('should render AddTweet component', () => {
    render(<ComposeModal isOpen={true} onClose={mockOnClose} />, { wrapper });

    expect(screen.getByTestId('add-tweet-mock')).toBeInTheDocument();
  });

  it('should pass correct type to AddTweet', () => {
    render(<ComposeModal isOpen={true} onClose={mockOnClose} />, { wrapper });

    const addTweet = screen.getByTestId('add-tweet-mock');
    expect(addTweet).toHaveTextContent('POST');
  });

  it('should call onClose when close button is clicked', () => {
    render(<ComposeModal isOpen={true} onClose={mockOnClose} />, { wrapper });

    const closeButton = screen.getByTestId('close-button');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should pass correct overlay color', () => {
    render(<ComposeModal isOpen={true} onClose={mockOnClose} />, { wrapper });

    const modal = screen.getByTestId('x-modal');
    expect(modal).toHaveAttribute(
      'data-overlay-color',
      'bg-[rgba(91,112,131,0.4)]'
    );
  });

  it('should pass correct size', () => {
    render(<ComposeModal isOpen={true} onClose={mockOnClose} />, { wrapper });

    const modal = screen.getByTestId('x-modal');
    expect(modal).toHaveAttribute('data-size', '4xl');
  });

  it('should transition from closed to open', () => {
    const { rerender } = render(
      <ComposeModal isOpen={false} onClose={mockOnClose} />,
      { wrapper }
    );

    expect(screen.queryByTestId('x-modal')).not.toBeInTheDocument();

    rerender(<ComposeModal isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByTestId('x-modal')).toBeInTheDocument();
  });

  it('should transition from open to closed', () => {
    const { rerender } = render(
      <ComposeModal isOpen={true} onClose={mockOnClose} />,
      { wrapper }
    );

    expect(screen.getByTestId('x-modal')).toBeInTheDocument();

    rerender(<ComposeModal isOpen={false} onClose={mockOnClose} />);

    expect(screen.queryByTestId('x-modal')).not.toBeInTheDocument();
  });

  it('should have correct container styling', () => {
    render(<ComposeModal isOpen={true} onClose={mockOnClose} />, { wrapper });

    // The container div with pt-14 px-5 classes wraps AddTweet
    const addTweet = screen.getByTestId('add-tweet-mock');
    expect(addTweet.parentElement).toHaveClass('pt-14');
    expect(addTweet.parentElement).toHaveClass('px-5');
    expect(addTweet.parentElement).toHaveClass('w-full');
    expect(addTweet.parentElement).toHaveClass('h-full');
    expect(addTweet.parentElement).toHaveClass('flex');
    expect(addTweet.parentElement).toHaveClass('flex-col');
  });
});
