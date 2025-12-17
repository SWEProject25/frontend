import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@/test/test-utils';
import BlockBtn from '../buttons/BlockBtn';

vi.mock('@/hooks/useInteractions', () => ({
  useInteractions: () => ({
    blockUser: vi.fn().mockResolvedValue(undefined),
    unblockUser: vi.fn().mockResolvedValue(undefined),
    isBlockLoading: false,
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

describe('BlockBtn Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render block button when not blocked', () => {
    render(<BlockBtn userId={1} isBlocked={false} />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button.textContent).toBe('Block');
  });

  it('should render blocked button when blocked', () => {
    render(<BlockBtn userId={1} isBlocked={true} />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button.textContent).toBe('Blocked');
  });

  it('should show "Unblock" on hover when already blocked', async () => {
    render(<BlockBtn userId={1} isBlocked={true} />);

    const button = screen.getByRole('button');
    fireEvent.mouseEnter(button);

    await waitFor(() => {
      expect(button.textContent).toBe('Unblock');
    });
  });

  it('should show "Blocked" when mouse leaves after hover', async () => {
    render(<BlockBtn userId={1} isBlocked={true} />);

    const button = screen.getByRole('button');
    fireEvent.mouseEnter(button);
    await waitFor(() => expect(button.textContent).toBe('Unblock'));

    fireEvent.mouseLeave(button);
    await waitFor(() => {
      expect(button.textContent).toBe('Blocked');
    });
  });

  it('should show confirmation modal when clicking block button', async () => {
    render(<BlockBtn userId={1} isBlocked={false} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByTestId('confirm-modal')).toBeInTheDocument();
      expect(screen.getByText('Block user?')).toBeInTheDocument();
    });
  });

  it('should show confirmation modal when clicking unblock button', async () => {
    render(<BlockBtn userId={1} isBlocked={true} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByTestId('confirm-modal')).toBeInTheDocument();
      expect(screen.getByText('Unblock user?')).toBeInTheDocument();
    });
  });

  it('should block user when confirmation is accepted', async () => {
    render(<BlockBtn userId={123} isBlocked={false} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByTestId('confirm-modal')).toBeInTheDocument();
    });

    const confirmButton = screen.getByTestId('confirm-button');
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(button.textContent).toBe('Blocked');
    });
  });

  it('should unblock user when confirmation is accepted', async () => {
    render(<BlockBtn userId={123} isBlocked={true} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByTestId('confirm-modal')).toBeInTheDocument();
    });

    const confirmButton = screen.getByTestId('confirm-button');
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(button.textContent).toBe('Block');
    });
  });

  it('should stop propagation when button is clicked', () => {
    const mockParentClick = vi.fn();

    render(
      <div onClick={mockParentClick}>
        <BlockBtn userId={1} isBlocked={false} />
      </div>
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockParentClick).not.toHaveBeenCalled();
  });

  it('should update state when isBlocked prop changes', () => {
    const { rerender } = render(<BlockBtn userId={1} isBlocked={false} />);

    let button = screen.getByRole('button');
    expect(button.textContent).toBe('Block');

    rerender(<BlockBtn userId={1} isBlocked={true} />);

    button = screen.getByRole('button');
    expect(button.textContent).toBe('Blocked');
  });
});
