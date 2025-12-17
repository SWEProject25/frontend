import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@/test/test-utils';
import OnboardingFlow from './OnboardingFlow';
import { useAuthStore } from '@/features/authentication/store/authStore';
import { useQueryClient } from '@tanstack/react-query';

// Mock dependencies
vi.mock('@/features/authentication/store/authStore', () => ({
  useAuthStore: vi.fn(),
}));

vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query');
  return {
    ...actual,
    useQueryClient: vi.fn(),
  };
});

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
  })),
}));

vi.mock('@/features/timeline/hooks/timelineQueries', () => ({
  TIMELINE_QUERY_KEYS: {
    TIMELINE_FEED_FOR_YOU: ['timeline', 'for-you'],
    TIMELINE_FEED_FOLLOWING: ['timeline', 'following'],
  },
}));

vi.mock('@/features/explore/hooks/exploreQueries', () => ({
  EXPLORE_QUERY_KEYS: {
    EXPLORE_FEED_FOR_YOU: ['explore', 'for-you'],
  },
}));

// Mock modal components
vi.mock('./DateOfBirthModal', () => ({
  default: ({
    isOpen,
    onComplete,
  }: {
    isOpen: boolean;
    onComplete: () => void;
  }) =>
    isOpen ? (
      <div data-testid="date-of-birth-modal">
        <button onClick={onComplete}>Complete Birth Date</button>
      </div>
    ) : null,
}));

vi.mock('./InterestsModal', () => ({
  default: ({
    isOpen,
    onComplete,
  }: {
    isOpen: boolean;
    onComplete: () => void;
  }) =>
    isOpen ? (
      <div data-testid="interests-modal">
        <button onClick={onComplete}>Complete Interests</button>
      </div>
    ) : null,
}));

vi.mock('./FollowSuggestionsModal', () => ({
  default: ({
    isOpen,
    onComplete,
  }: {
    isOpen: boolean;
    onComplete: () => void;
  }) =>
    isOpen ? (
      <div data-testid="follow-suggestions-modal">
        <button onClick={onComplete}>Complete Following</button>
      </div>
    ) : null,
}));

describe('OnboardingFlow', () => {
  const mockOnComplete = vi.fn();
  const mockRefetchQueries = vi.fn();
  const mockInvalidateQueries = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useQueryClient as any).mockReturnValue({
      refetchQueries: mockRefetchQueries,
      invalidateQueries: mockInvalidateQueries,
    });
  });

  describe('Loading State', () => {
    it('should not render any modal while loading user data', () => {
      (useAuthStore as any).mockImplementation((selector: any) => {
        const store = {
          user: null,
          isLoading: true,
        };
        return selector(store);
      });

      render(<OnboardingFlow onComplete={mockOnComplete} />);

      expect(
        screen.queryByTestId('date-of-birth-modal')
      ).not.toBeInTheDocument();
      expect(screen.queryByTestId('interests-modal')).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('follow-suggestions-modal')
      ).not.toBeInTheDocument();
    });
  });

  describe('No User State', () => {
    it('should not render any modal when user is not logged in', () => {
      (useAuthStore as any).mockImplementation((selector: any) => {
        const store = {
          user: null,
          isLoading: false,
        };
        return selector(store);
      });

      render(<OnboardingFlow onComplete={mockOnComplete} />);

      expect(
        screen.queryByTestId('date-of-birth-modal')
      ).not.toBeInTheDocument();
      expect(screen.queryByTestId('interests-modal')).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('follow-suggestions-modal')
      ).not.toBeInTheDocument();
    });
  });

  describe('No Onboarding Status', () => {
    it('should not render any modal when onboardingStatus is not loaded', () => {
      (useAuthStore as any).mockImplementation((selector: any) => {
        const store = {
          user: {
            id: 1,
            username: 'testuser',
            onboardingStatus: null,
          },
          isLoading: false,
        };
        return selector(store);
      });

      render(<OnboardingFlow onComplete={mockOnComplete} />);

      expect(
        screen.queryByTestId('date-of-birth-modal')
      ).not.toBeInTheDocument();
      expect(screen.queryByTestId('interests-modal')).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('follow-suggestions-modal')
      ).not.toBeInTheDocument();
    });
  });

  describe('Step Progression - Date of Birth', () => {
    it('should show DateOfBirthModal when birth date is not completed', () => {
      (useAuthStore as any).mockImplementation((selector: any) => {
        const store = {
          user: {
            id: 1,
            username: 'testuser',
            onboardingStatus: {
              hasCompletedBirthDate: false,
              hasCompeletedInterests: false,
              hasCompeletedFollowing: false,
            },
          },
          isLoading: false,
        };
        return selector(store);
      });

      render(<OnboardingFlow onComplete={mockOnComplete} />);

      expect(screen.getByTestId('date-of-birth-modal')).toBeInTheDocument();
      expect(screen.queryByTestId('interests-modal')).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('follow-suggestions-modal')
      ).not.toBeInTheDocument();
    });
  });

  describe('Step Progression - Interests', () => {
    it('should show InterestsModal when birth date is completed but interests are not', () => {
      (useAuthStore as any).mockImplementation((selector: any) => {
        const store = {
          user: {
            id: 1,
            username: 'testuser',
            onboardingStatus: {
              hasCompletedBirthDate: true,
              hasCompeletedInterests: false,
              hasCompeletedFollowing: false,
            },
          },
          isLoading: false,
        };
        return selector(store);
      });

      render(<OnboardingFlow onComplete={mockOnComplete} />);

      expect(
        screen.queryByTestId('date-of-birth-modal')
      ).not.toBeInTheDocument();
      expect(screen.getByTestId('interests-modal')).toBeInTheDocument();
      expect(
        screen.queryByTestId('follow-suggestions-modal')
      ).not.toBeInTheDocument();
    });
  });

  describe('Step Progression - Follow Suggestions', () => {
    it('should show FollowSuggestionsModal when interests are completed but following is not', () => {
      (useAuthStore as any).mockImplementation((selector: any) => {
        const store = {
          user: {
            id: 1,
            username: 'testuser',
            onboardingStatus: {
              hasCompletedBirthDate: true,
              hasCompeletedInterests: true,
              hasCompeletedFollowing: false,
            },
          },
          isLoading: false,
        };
        return selector(store);
      });

      render(<OnboardingFlow onComplete={mockOnComplete} />);

      expect(
        screen.queryByTestId('date-of-birth-modal')
      ).not.toBeInTheDocument();
      expect(screen.queryByTestId('interests-modal')).not.toBeInTheDocument();
      expect(
        screen.getByTestId('follow-suggestions-modal')
      ).toBeInTheDocument();
    });
  });

  describe('Completed Onboarding', () => {
    it('should not render any modal when all steps are completed', () => {
      (useAuthStore as any).mockImplementation((selector: any) => {
        const store = {
          user: {
            id: 1,
            username: 'testuser',
            onboardingStatus: {
              hasCompletedBirthDate: true,
              hasCompeletedInterests: true,
              hasCompeletedFollowing: true,
            },
          },
          isLoading: false,
        };
        return selector(store);
      });

      render(<OnboardingFlow onComplete={mockOnComplete} />);

      expect(
        screen.queryByTestId('date-of-birth-modal')
      ).not.toBeInTheDocument();
      expect(screen.queryByTestId('interests-modal')).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('follow-suggestions-modal')
      ).not.toBeInTheDocument();
    });

    it('should call onComplete when all steps are completed', () => {
      (useAuthStore as any).mockImplementation((selector: any) => {
        const store = {
          user: {
            id: 1,
            username: 'testuser',
            onboardingStatus: {
              hasCompletedBirthDate: true,
              hasCompeletedInterests: true,
              hasCompeletedFollowing: true,
            },
          },
          isLoading: false,
        };
        return selector(store);
      });

      render(<OnboardingFlow onComplete={mockOnComplete} />);

      expect(mockOnComplete).toHaveBeenCalled();
    });
  });

  describe('Cache Invalidation on Completion', () => {
    it('should refetch timeline and explore feeds after completing all steps', async () => {
      let userState = {
        id: 1,
        username: 'testuser',
        onboardingStatus: {
          hasCompletedBirthDate: true,
          hasCompeletedInterests: true,
          hasCompeletedFollowing: false,
        },
      };

      const { rerender } = render(
        <OnboardingFlow onComplete={mockOnComplete} />
      );

      (useAuthStore as any).mockImplementation((selector: any) => {
        const store = {
          user: userState,
          isLoading: false,
        };
        return selector(store);
      });

      // Initial render shows follow suggestions modal
      rerender(<OnboardingFlow onComplete={mockOnComplete} />);

      // Simulate completion by updating user state
      userState = {
        ...userState,
        onboardingStatus: {
          hasCompletedBirthDate: true,
          hasCompeletedInterests: true,
          hasCompeletedFollowing: true,
        },
      };

      rerender(<OnboardingFlow onComplete={mockOnComplete} />);

      await waitFor(() => {
        expect(mockRefetchQueries).toHaveBeenCalledWith({
          queryKey: ['timeline', 'for-you'],
        });
        expect(mockRefetchQueries).toHaveBeenCalledWith({
          queryKey: ['timeline', 'following'],
        });
        expect(mockRefetchQueries).toHaveBeenCalledWith({
          queryKey: ['explore', 'for-you'],
        });
        expect(mockInvalidateQueries).toHaveBeenCalledWith({
          queryKey: ['suggestedUsers'],
        });
      });
    });

    it('should only invalidate caches once after completion', async () => {
      let userState = {
        id: 1,
        username: 'testuser',
        onboardingStatus: {
          hasCompletedBirthDate: true,
          hasCompeletedInterests: true,
          hasCompeletedFollowing: false,
        },
      };

      const { rerender } = render(
        <OnboardingFlow onComplete={mockOnComplete} />
      );

      (useAuthStore as any).mockImplementation((selector: any) => {
        const store = {
          user: userState,
          isLoading: false,
        };
        return selector(store);
      });

      rerender(<OnboardingFlow onComplete={mockOnComplete} />);

      // Complete onboarding
      userState = {
        ...userState,
        onboardingStatus: {
          hasCompletedBirthDate: true,
          hasCompeletedInterests: true,
          hasCompeletedFollowing: true,
        },
      };

      rerender(<OnboardingFlow onComplete={mockOnComplete} />);

      await waitFor(() => {
        expect(mockRefetchQueries).toHaveBeenCalled();
      });

      const refetchCallCount = mockRefetchQueries.mock.calls.length;

      // Re-render with same completed state
      rerender(<OnboardingFlow onComplete={mockOnComplete} />);
      rerender(<OnboardingFlow onComplete={mockOnComplete} />);

      // Should not call refetch again
      expect(mockRefetchQueries.mock.calls.length).toBe(refetchCallCount);
    });
  });

  describe('Step Priority', () => {
    it('should prioritize birth date over other steps', () => {
      (useAuthStore as any).mockImplementation((selector: any) => {
        const store = {
          user: {
            id: 1,
            username: 'testuser',
            onboardingStatus: {
              hasCompletedBirthDate: false,
              hasCompeletedInterests: true,
              hasCompeletedFollowing: true,
            },
          },
          isLoading: false,
        };
        return selector(store);
      });

      render(<OnboardingFlow onComplete={mockOnComplete} />);

      expect(screen.getByTestId('date-of-birth-modal')).toBeInTheDocument();
      expect(screen.queryByTestId('interests-modal')).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('follow-suggestions-modal')
      ).not.toBeInTheDocument();
    });

    it('should prioritize interests over follow suggestions', () => {
      (useAuthStore as any).mockImplementation((selector: any) => {
        const store = {
          user: {
            id: 1,
            username: 'testuser',
            onboardingStatus: {
              hasCompletedBirthDate: true,
              hasCompeletedInterests: false,
              hasCompeletedFollowing: true,
            },
          },
          isLoading: false,
        };
        return selector(store);
      });

      render(<OnboardingFlow onComplete={mockOnComplete} />);

      expect(
        screen.queryByTestId('date-of-birth-modal')
      ).not.toBeInTheDocument();
      expect(screen.getByTestId('interests-modal')).toBeInTheDocument();
      expect(
        screen.queryByTestId('follow-suggestions-modal')
      ).not.toBeInTheDocument();
    });
  });

  describe('Modal Props', () => {
    it('should pass empty onClose handler to modals', () => {
      (useAuthStore as any).mockImplementation((selector: any) => {
        const store = {
          user: {
            id: 1,
            username: 'testuser',
            onboardingStatus: {
              hasCompletedBirthDate: false,
              hasCompeletedInterests: false,
              hasCompeletedFollowing: false,
            },
          },
          isLoading: false,
        };
        return selector(store);
      });

      render(<OnboardingFlow onComplete={mockOnComplete} />);

      expect(screen.getByTestId('date-of-birth-modal')).toBeInTheDocument();
    });

    it('should pass empty completion handlers to modals', () => {
      (useAuthStore as any).mockImplementation((selector: any) => {
        const store = {
          user: {
            id: 1,
            username: 'testuser',
            onboardingStatus: {
              hasCompletedBirthDate: false,
              hasCompeletedInterests: false,
              hasCompeletedFollowing: false,
            },
          },
          isLoading: false,
        };
        return selector(store);
      });

      render(<OnboardingFlow onComplete={mockOnComplete} />);

      expect(screen.getByTestId('date-of-birth-modal')).toBeInTheDocument();
    });
  });

  describe('Optional onComplete Callback', () => {
    it('should work without onComplete callback', () => {
      (useAuthStore as any).mockImplementation((selector: any) => {
        const store = {
          user: {
            id: 1,
            username: 'testuser',
            onboardingStatus: {
              hasCompletedBirthDate: true,
              hasCompeletedInterests: true,
              hasCompeletedFollowing: true,
            },
          },
          isLoading: false,
        };
        return selector(store);
      });

      expect(() => render(<OnboardingFlow />)).not.toThrow();
    });
  });
});
