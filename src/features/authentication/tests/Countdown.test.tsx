import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@/test/test-utils';
import { Countdown } from '../components/Countdown';

describe('Countdown', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render initial countdown time', () => {
    render(<Countdown initialSeconds={60} />);

    expect(screen.getByText('01:00')).toBeInTheDocument();
  });

  it('should format seconds correctly with different values', () => {
    const { unmount: unmount1 } = render(<Countdown initialSeconds={125} />);
    expect(screen.getByText('02:05')).toBeInTheDocument();
    unmount1();

    const { unmount: unmount2 } = render(<Countdown initialSeconds={9} />);
    expect(screen.getByText('00:09')).toBeInTheDocument();
    unmount2();

    render(<Countdown initialSeconds={3599} />);
    expect(screen.getByText('59:59')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(
      <Countdown initialSeconds={60} className="custom-countdown" />
    );

    const countdown = container.querySelector('.custom-countdown');
    expect(countdown).toBeInTheDocument();
  });

  it('should pad minutes and seconds with zeros', () => {
    render(<Countdown initialSeconds={5} />);
    expect(screen.getByText('00:05')).toBeInTheDocument();
  });

  it('should display correct format for different durations', () => {
    // Test large duration
    const { unmount: unmount1 } = render(<Countdown initialSeconds={3661} />);
    expect(screen.getByText('61:01')).toBeInTheDocument();
    unmount1();

    // Test 10 minutes
    const { unmount: unmount2 } = render(<Countdown initialSeconds={600} />);
    expect(screen.getByText('10:00')).toBeInTheDocument();
    unmount2();

    // Test under 1 minute
    render(<Countdown initialSeconds={59} />);
    expect(screen.getByText('00:59')).toBeInTheDocument();
  });

  it('should clean up timer on unmount', () => {
    const { unmount } = render(<Countdown initialSeconds={60} />);

    // Spy on clearTimeout
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });
});
