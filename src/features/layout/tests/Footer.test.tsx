import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/test-utils';
import Footer from '../components/Footer';

describe('Footer', () => {
  it('should render footer content', () => {
    const { container } = render(<Footer />);

    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render copyright text', () => {
    render(<Footer />);

    expect(screen.getByText(/© 2025/i)).toBeInTheDocument();
  });

  it('should render Hankers Corp text', () => {
    render(<Footer />);

    expect(screen.getByText(/hankers corp/i)).toBeInTheDocument();
  });

  it('should have proper styling', () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector('footer');

    expect(footer).toBeInTheDocument();
  });

  it('should be a footer element', () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector('footer');

    expect(footer).toBeInTheDocument();
  });
});
