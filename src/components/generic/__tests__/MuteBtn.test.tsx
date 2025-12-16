import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@/test/test-utils';
import MuteBtn from '../buttons/MuteBtn';

vi.mock('@/hooks/useInteractions', () => ({
  useInteractions: () => ({
    muteUser: vi.fn().mockResolvedValue(undefined),
    unmuteUser: vi.fn().mockResolvedValue(undefined),
    isMuteLoading: false,
  }),
}));

vi.mock('@/components/ui/icons', () => ({
  MuteIcon: ({ className }: { className?: string }) => (
    <div data-testid="mute-icon" className={className}>
      Mute
    </div>
  ),
  UnMuteIcon: ({ className }: { className?: string }) => (
    <div data-testid="unmute-icon" className={className}>
      Unmute
    </div>
  ),
}));

describe('MuteBtn Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render mute button when not muted', () => {
    render(<MuteBtn userId={1} isMuted={false} />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(screen.getByTestId('mute-icon')).toBeInTheDocument();
  });

  it('should render unmute button when muted', () => {
    render(<MuteBtn userId={1} isMuted={true} />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(screen.getByTestId('unmute-icon')).toBeInTheDocument();
  });

  it('should have correct aria-label when not muted', () => {
    render(<MuteBtn userId={1} isMuted={false} />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Mute');
  });

  it('should have correct aria-label when muted', () => {
    render(<MuteBtn userId={1} isMuted={true} />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Unmute');
  });

  it('should mute user when clicking mute button', async () => {
    render(<MuteBtn userId={123} isMuted={false} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByTestId('unmute-icon')).toBeInTheDocument();
    });
  });

  it('should unmute user when clicking unmute button', async () => {
    render(<MuteBtn userId={123} isMuted={true} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByTestId('mute-icon')).toBeInTheDocument();
    });
  });

  it('should stop propagation when button is clicked', () => {
    const mockParentClick = vi.fn();

    render(
      <div onClick={mockParentClick}>
        <MuteBtn userId={1} isMuted={false} />
      </div>
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockParentClick).not.toHaveBeenCalled();
  });

  it('should update state when isMuted prop changes', () => {
    const { rerender } = render(<MuteBtn userId={1} isMuted={false} />);

    expect(screen.getByTestId('mute-icon')).toBeInTheDocument();

    rerender(<MuteBtn userId={1} isMuted={true} />);

    expect(screen.getByTestId('unmute-icon')).toBeInTheDocument();
  });

  it('should have correct styling when not muted', () => {
    render(<MuteBtn userId={1} isMuted={false} />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('text-primary');
  });

  it('should have correct styling when muted', () => {
    render(<MuteBtn userId={1} isMuted={true} />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('text-block');
  });
});
