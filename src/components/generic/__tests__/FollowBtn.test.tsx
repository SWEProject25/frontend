import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@/test/test-utils';
import FollowBtn from '../buttons/FollowBtn';

vi.mock('@/hooks/useInteractions', () => ({
  useInteractions: () => ({
    followUser: vi.fn().mockResolvedValue(undefined),
    unfollowUser: vi.fn().mockResolvedValue(undefined),
    isFollowLoading: false,
  }),
}));

vi.mock('@/components/ui/hoc/ConfirmModal', () => ({
  default: ({
    isOpen,
    onConfirm,
    title,
  }: {
    isOpen: boolean;
    onConfirm: () => void;
    title: string;
  }) =>
    isOpen ? (
      <div data-testid="confirm-modal">
        <div>{title}</div>
        <button onClick={onConfirm} data-testid="confirm-button">
          Confirm
        </button>
      </div>
    ) : null,
}));

describe('FollowBtn Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render follow button when not followed', () => {
    render(<FollowBtn userId={1} isFollowed={false} />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button.textContent).toBe('Follow');
  });

  it('should render following button when followed', () => {
    render(<FollowBtn userId={1} isFollowed={true} />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button.textContent).toBe('Following');
  });

  it('should show "Unfollow" on hover when already following', async () => {
    render(<FollowBtn userId={1} isFollowed={true} />);

    const button = screen.getByRole('button');
    fireEvent.mouseEnter(button);

    await waitFor(() => {
      expect(button.textContent).toBe('Unfollow');
    });
  });

  it('should show "Following" when mouse leaves after hover', async () => {
    render(<FollowBtn userId={1} isFollowed={true} />);

    const button = screen.getByRole('button');
    fireEvent.mouseEnter(button);
    await waitFor(() => expect(button.textContent).toBe('Unfollow'));

    fireEvent.mouseLeave(button);
    await waitFor(() => {
      expect(button.textContent).toBe('Following');
    });
  });

  it('should follow user when clicking follow button', async () => {
    render(<FollowBtn userId={123} isFollowed={false} />);

    const button = screen.getByRole('button');
    expect(button.textContent).toBe('Follow');

    fireEvent.click(button);

    await waitFor(() => {
      expect(button.textContent).toBe('Following');
    });
  });

  it('should show unfollow confirmation modal when clicking unfollow', async () => {
    render(<FollowBtn userId={1} isFollowed={true} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByTestId('confirm-modal')).toBeInTheDocument();
    });
  });

  it('should call onFollowChange callback after following', async () => {
    const mockOnFollowChange = vi.fn();

    render(
      <FollowBtn
        userId={123}
        isFollowed={false}
        onFollowChange={mockOnFollowChange}
      />
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockOnFollowChange).toHaveBeenCalledWith(123, true);
    });
  });

  it('should stop propagation when button is clicked', () => {
    const mockParentClick = vi.fn();

    render(
      <div onClick={mockParentClick}>
        <FollowBtn userId={1} isFollowed={false} />
      </div>
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockParentClick).not.toHaveBeenCalled();
  });

  it('should update state when isFollowed prop changes', () => {
    const { rerender } = render(<FollowBtn userId={1} isFollowed={false} />);

    let button = screen.getByRole('button');
    expect(button.textContent).toBe('Follow');

    rerender(<FollowBtn userId={1} isFollowed={true} />);

    button = screen.getByRole('button');
    expect(button.textContent).toBe('Following');
  });
});
