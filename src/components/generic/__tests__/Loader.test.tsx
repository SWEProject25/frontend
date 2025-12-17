import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Loader from '../Loader';

describe('Loader Component', () => {
  it('should render loader', () => {
    render(<Loader />);

    const loader = screen.getByTestId('loader');
    expect(loader).toBeInTheDocument();
  });

  it('should have spinner element', () => {
    const { container } = render(<Loader />);

    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('should have correct spinner classes', () => {
    const { container } = render(<Loader />);

    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toHaveClass(
      'w-6',
      'h-6',
      'border-2',
      'border-primary',
      'border-t-transparent',
      'rounded-full'
    );
  });

  it('should be centered with flex layout', () => {
    render(<Loader />);

    const loader = screen.getByTestId('loader');
    expect(loader).toHaveClass('flex', 'items-center', 'gap-2');
  });
});
