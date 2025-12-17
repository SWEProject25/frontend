import { describe, it, expect } from 'vitest';
import { render } from '@/test/test-utils';
import Logo from '../components/Logo';

describe('Logo', () => {
  it('should render logo SVG', () => {
    const { container } = render(<Logo />);
    const svg = container.querySelector('svg');

    expect(svg).toBeInTheDocument();
  });

  it('should render with proper styling', () => {
    const { container } = render(<Logo />);
    const div = container.querySelector('div');

    expect(div).toHaveClass(
      'hover:bg-gray-900',
      'rounded-full',
      'cursor-pointer'
    );
  });

  it('should render SVG with correct viewBox', () => {
    const { container } = render(<Logo />);
    const svg = container.querySelector('svg');

    expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
  });

  it('should render SVG with white stroke', () => {
    const { container } = render(<Logo />);
    const svg = container.querySelector('svg');

    expect(svg).toHaveAttribute('stroke', 'white');
  });

  it('should have path element', () => {
    const { container } = render(<Logo />);
    const path = container.querySelector('path');

    expect(path).toBeInTheDocument();
  });
});
