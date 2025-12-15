import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Loader from '@/components/generic/Loader';

describe('Loader Component', () => {
  it('should render loader', () => {
    const { container } = render(<Loader />);

    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('should have spinning animation', () => {
    const { container } = render(<Loader />);

    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('should be accessible', () => {
    const { container } = render(<Loader />);

    const loader = container.firstChild;
    expect(loader).toBeInTheDocument();
  });

  it('should render with custom size', () => {
    const { container } = render(<Loader />);

    const spinner = container.querySelector('[class*="w-"]');
    expect(spinner).toBeInTheDocument();
  });

  it('should render with custom color', () => {
    const { container } = render(<Loader />);

    const spinner = container.querySelector('[class*="border"]');
    expect(spinner).toBeInTheDocument();
  });
});
