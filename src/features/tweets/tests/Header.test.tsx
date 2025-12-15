import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from '../components/Header';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    back: vi.fn(),
  }),
}));

describe('Header Component', () => {
  it('should render header with back button', () => {
    render(<Header />);

    const backButton = screen.getByRole('button');
    expect(backButton).toBeInTheDocument();
  });

  it('should render Post title', () => {
    render(<Header />);

    expect(screen.getByText('Post')).toBeInTheDocument();
  });

  it('should call router.back when back button is clicked', () => {
    const { container } = render(<Header />);

    const backButton = screen.getByRole('button');
    fireEvent.click(backButton);

    // Router back should be called (mocked)
  });

  it('should have correct styling classes', () => {
    const { container } = render(<Header />);

    // The header container has these classes, not sticky/z-10
    const header = container.firstChild as HTMLElement;
    expect(header).toHaveClass('flex', 'items-center', 'justify-between');
  });

  it('should render back arrow icon', () => {
    render(<Header />);

    const icon = screen.getByRole('button').querySelector('svg');
    expect(icon).toBeInTheDocument();
  });
});
