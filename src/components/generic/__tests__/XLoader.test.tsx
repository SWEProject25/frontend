import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import XLoader from '../XLoader';

vi.mock('@/components/ui/icons', () => ({
  XLogo: ({ className }: { className?: string }) => (
    <div data-testid="x-logo" className={className}>
      X Logo
    </div>
  ),
}));

describe('XLoader Component', () => {
  it('should render XLoader', () => {
    const { container } = render(<XLoader />);

    expect(container.firstChild).toBeInTheDocument();
  });

  it('should have fixed positioning covering full screen', () => {
    const { container } = render(<XLoader />);

    const loaderDiv = container.firstChild as HTMLElement;
    expect(loaderDiv).toHaveClass('fixed', 'inset-0');
  });

  it('should have centered flex layout', () => {
    const { container } = render(<XLoader />);

    const loaderDiv = container.firstChild as HTMLElement;
    expect(loaderDiv).toHaveClass(
      'flex',
      'items-center',
      'justify-center',
      'bg-black'
    );
  });

  it('should render XLogo with pulse animation', () => {
    const { container, getByTestId } = render(<XLoader />);

    const pulseDiv = container.querySelector('.animate-pulse');
    expect(pulseDiv).toBeInTheDocument();

    const logo = getByTestId('x-logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveClass('w-16', 'h-16', 'text-white');
  });
});
