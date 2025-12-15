import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import InterestsModal from './InterestsModal';
import { useUpdateInterests, useGetInterests } from '../hooks/useOnboarding';

// Mock the hooks
vi.mock('../hooks/useOnboarding', () => ({
  useUpdateInterests: vi.fn(),
  useGetInterests: vi.fn(),
}));

// Mock the XModal component
vi.mock('@/components/ui/hoc/XModal', () => ({
  default: ({
    children,
    isOpen,
  }: {
    children: React.ReactNode;
    isOpen: boolean;
  }) => (isOpen ? <div data-testid="x-modal">{children}</div> : null),
}));

// Mock the AuthButton component
vi.mock('@/components/ui/AuthButton', () => ({
  AuthButton: ({
    children,
    onClick,
    disabled,
    loading,
  }: {
    children: React.ReactNode;
    onClick: () => void;
    disabled: boolean;
    loading: boolean;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      data-testid="submit-button"
      data-loading={loading}
    >
      {children}
    </button>
  ),
}));

describe('InterestsModal', () => {
  const mockMutateAsync = vi.fn();
  const mockOnClose = vi.fn();
  const mockOnComplete = vi.fn();

  const mockInterests = {
    data: [
      {
        id: 1,
        name: 'Technology',
        slug: 'technology',
        description: 'All about tech',
        icon: 'tech-icon',
      },
      {
        id: 2,
        name: 'Sports',
        slug: 'sports',
        description: 'Sports and athletics',
        icon: 'sports-icon',
      },
      {
        id: 3,
        name: 'Music',
        slug: 'music',
        description: 'Music and entertainment',
        icon: 'music-icon',
      },
    ],
    total: 3,
  };

  const defaultMockUpdateInterests = {
    mutateAsync: mockMutateAsync,
    isPending: false,
    isError: false,
    error: null,
  };

  const defaultMockGetInterests = {
    data: mockInterests,
    isLoading: false,
    error: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useUpdateInterests as any).mockReturnValue(defaultMockUpdateInterests);
    (useGetInterests as any).mockReturnValue(defaultMockGetInterests);
  });

  describe('Rendering', () => {
    it('should render the modal when isOpen is true', () => {
      render(
        <InterestsModal
          isOpen={true}
          onClose={mockOnClose}
          onComplete={mockOnComplete}
        />
      );

      expect(screen.getByTestId('x-modal')).toBeInTheDocument();
      expect(
        screen.getByText('What do you want to see on Hankers?')
      ).toBeInTheDocument();
    });

    it('should not render the modal when isOpen is false', () => {
      render(
        <InterestsModal
          isOpen={false}
          onClose={mockOnClose}
          onComplete={mockOnComplete}
        />
      );

      expect(screen.queryByTestId('x-modal')).not.toBeInTheDocument();
    });

    it('should render all interests from the API', () => {
      render(
        <InterestsModal
          isOpen={true}
          onClose={mockOnClose}
          onComplete={mockOnComplete}
        />
      );

      expect(screen.getByText('Technology')).toBeInTheDocument();
      expect(screen.getByText('All about tech')).toBeInTheDocument();
      expect(screen.getByText('Sports')).toBeInTheDocument();
      expect(screen.getByText('Music')).toBeInTheDocument();
    });

    it('should display interest counter correctly', () => {
      render(
        <InterestsModal
          isOpen={true}
          onClose={mockOnClose}
          onComplete={mockOnComplete}
        />
      );

      expect(screen.getByText('0 of 3 selected')).toBeInTheDocument();
    });

    it('should only fetch interests when modal is open', () => {
      const { rerender } = render(
        <InterestsModal
          isOpen={false}
          onClose={mockOnClose}
          onComplete={mockOnComplete}
        />
      );

      expect(useGetInterests).toHaveBeenCalledWith(false);

      rerender(
        <InterestsModal
          isOpen={true}
          onClose={mockOnClose}
          onComplete={mockOnComplete}
        />
      );

      expect(useGetInterests).toHaveBeenCalledWith(true);
    });
  });

  describe('Loading State', () => {
    it('should display loading message when interests are being fetched', () => {
      (useGetInterests as any).mockReturnValue({
        data: null,
        isLoading: true,
        error: null,
      });

      render(
        <InterestsModal
          isOpen={true}
          onClose={mockOnClose}
          onComplete={mockOnComplete}
        />
      );

      expect(screen.getByText('Loading interests...')).toBeInTheDocument();
    });

    it('should not display interests grid when loading', () => {
      (useGetInterests as any).mockReturnValue({
        data: null,
        isLoading: true,
        error: null,
      });

      render(
        <InterestsModal
          isOpen={true}
          onClose={mockOnClose}
          onComplete={mockOnComplete}
        />
      );

      expect(screen.queryByText('Technology')).not.toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('should display error message when interests fail to load', () => {
      (useGetInterests as any).mockReturnValue({
        data: null,
        isLoading: false,
        error: new Error('Failed to fetch'),
      });

      render(
        <InterestsModal
          isOpen={true}
          onClose={mockOnClose}
          onComplete={mockOnComplete}
        />
      );

      expect(screen.getByText('Failed to load interests')).toBeInTheDocument();
    });

    it('should display submission error message', () => {
      (useUpdateInterests as any).mockReturnValue({
        ...defaultMockUpdateInterests,
        isError: true,
        error: { message: 'Failed to update interests' },
      });

      render(
        <InterestsModal
          isOpen={true}
          onClose={mockOnClose}
          onComplete={mockOnComplete}
        />
      );

      expect(
        screen.getByText('Failed to update interests')
      ).toBeInTheDocument();
    });

    it('should display generic error message when no specific error message', () => {
      (useUpdateInterests as any).mockReturnValue({
        ...defaultMockUpdateInterests,
        isError: true,
        error: {},
      });

      render(
        <InterestsModal
          isOpen={true}
          onClose={mockOnClose}
          onComplete={mockOnComplete}
        />
      );

      expect(
        screen.getByText('Failed to update interests')
      ).toBeInTheDocument();
    });
  });

  describe('Interest Selection', () => {
    it('should select an interest when clicked', async () => {
      const user = userEvent.setup();

      render(
        <InterestsModal
          isOpen={true}
          onClose={mockOnClose}
          onComplete={mockOnComplete}
        />
      );

      const technologyButton = screen.getByText('Technology').closest('button');
      expect(technologyButton).toBeInTheDocument();

      await user.click(technologyButton!);

      expect(screen.getByText('1 of 3 selected')).toBeInTheDocument();
    });

    it('should deselect an interest when clicked again', async () => {
      const user = userEvent.setup();

      render(
        <InterestsModal
          isOpen={true}
          onClose={mockOnClose}
          onComplete={mockOnComplete}
        />
      );

      const technologyButton = screen.getByText('Technology').closest('button');

      // First click - select
      await user.click(technologyButton!);
      expect(screen.getByText('1 of 3 selected')).toBeInTheDocument();

      // Second click - deselect
      await user.click(technologyButton!);
      expect(screen.getByText('0 of 3 selected')).toBeInTheDocument();
    });

    it('should select multiple interests', async () => {
      const user = userEvent.setup();

      render(
        <InterestsModal
          isOpen={true}
          onClose={mockOnClose}
          onComplete={mockOnComplete}
        />
      );

      const technologyButton = screen.getByText('Technology').closest('button');
      const sportsButton = screen.getByText('Sports').closest('button');

      await user.click(technologyButton!);
      await user.click(sportsButton!);

      expect(screen.getByText('2 of 3 selected')).toBeInTheDocument();
    });

    it('should update counter correctly when selecting and deselecting', async () => {
      const user = userEvent.setup();

      render(
        <InterestsModal
          isOpen={true}
          onClose={mockOnClose}
          onComplete={mockOnComplete}
        />
      );

      const technologyButton = screen.getByText('Technology').closest('button');
      const sportsButton = screen.getByText('Sports').closest('button');
      const musicButton = screen.getByText('Music').closest('button');

      await user.click(technologyButton!);
      await user.click(sportsButton!);
      await user.click(musicButton!);
      expect(screen.getByText('3 of 3 selected')).toBeInTheDocument();

      await user.click(sportsButton!);
      expect(screen.getByText('2 of 3 selected')).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('should disable submit button when no interests are selected', () => {
      render(
        <InterestsModal
          isOpen={true}
          onClose={mockOnClose}
          onComplete={mockOnComplete}
        />
      );

      const submitButton = screen.getByTestId('submit-button');
      expect(submitButton).toBeDisabled();
    });

    it('should enable submit button when at least one interest is selected', async () => {
      const user = userEvent.setup();

      render(
        <InterestsModal
          isOpen={true}
          onClose={mockOnClose}
          onComplete={mockOnComplete}
        />
      );

      const technologyButton = screen.getByText('Technology').closest('button');
      await user.click(technologyButton!);

      const submitButton = screen.getByTestId('submit-button');
      expect(submitButton).not.toBeDisabled();
    });

    it('should disable submit button during submission', () => {
      (useUpdateInterests as any).mockReturnValue({
        ...defaultMockUpdateInterests,
        isPending: true,
      });

      render(
        <InterestsModal
          isOpen={true}
          onClose={mockOnClose}
          onComplete={mockOnComplete}
        />
      );

      const submitButton = screen.getByTestId('submit-button');
      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveAttribute('data-loading', 'true');
    });
  });

  describe('Form Submission', () => {
    it('should call mutateAsync with selected interest IDs on submit', async () => {
      const user = userEvent.setup();
      mockMutateAsync.mockResolvedValueOnce({});

      render(
        <InterestsModal
          isOpen={true}
          onClose={mockOnClose}
          onComplete={mockOnComplete}
        />
      );

      const technologyButton = screen.getByText('Technology').closest('button');
      const sportsButton = screen.getByText('Sports').closest('button');

      await user.click(technologyButton!);
      await user.click(sportsButton!);

      const submitButton = screen.getByTestId('submit-button');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockMutateAsync).toHaveBeenCalledWith({
          interestIds: [1, 2],
        });
      });
    });

    it('should call onComplete after successful submission', async () => {
      const user = userEvent.setup();
      mockMutateAsync.mockResolvedValueOnce({});

      render(
        <InterestsModal
          isOpen={true}
          onClose={mockOnClose}
          onComplete={mockOnComplete}
        />
      );

      const musicButton = screen.getByText('Music').closest('button');
      await user.click(musicButton!);

      const submitButton = screen.getByTestId('submit-button');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnComplete).toHaveBeenCalled();
      });
    });

    it('should not submit when no interests are selected', async () => {
      const user = userEvent.setup();

      render(
        <InterestsModal
          isOpen={true}
          onClose={mockOnClose}
          onComplete={mockOnComplete}
        />
      );

      const submitButton = screen.getByTestId('submit-button');
      expect(submitButton).toBeDisabled();
      await user.click(submitButton);

      expect(mockMutateAsync).not.toHaveBeenCalled();
    });

    it('should handle submission error gracefully', async () => {
      const user = userEvent.setup();
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      mockMutateAsync.mockRejectedValueOnce(new Error('Network error'));

      render(
        <InterestsModal
          isOpen={true}
          onClose={mockOnClose}
          onComplete={mockOnComplete}
        />
      );

      const technologyButton = screen.getByText('Technology').closest('button');
      await user.click(technologyButton!);

      const submitButton = screen.getByTestId('submit-button');
      await user.click(submitButton);

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Failed to update interests:',
          expect.any(Error)
        );
      });

      expect(mockOnComplete).not.toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('UI Interactions', () => {
    it('should display correct styling for selected interests', async () => {
      const user = userEvent.setup();

      render(
        <InterestsModal
          isOpen={true}
          onClose={mockOnClose}
          onComplete={mockOnComplete}
        />
      );

      const technologyButton = screen.getByText('Technology').closest('button');

      await user.click(technologyButton!);

      // Check if the button has the selected styling classes
      expect(technologyButton).toHaveClass('bg-primary/10');
      expect(technologyButton).toHaveClass('border-primary');
    });

    it('should display all three interests in grid layout', () => {
      render(
        <InterestsModal
          isOpen={true}
          onClose={mockOnClose}
          onComplete={mockOnComplete}
        />
      );

      const interests = screen.getAllByRole('button', {
        name: /Technology|Sports|Music/i,
      });
      expect(interests).toHaveLength(3);
    });
  });
});
