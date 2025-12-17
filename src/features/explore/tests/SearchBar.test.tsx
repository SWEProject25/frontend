import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

const mockBack = vi.fn();

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    back: mockBack,
  }),
}));

// Mock Icon component
vi.mock('@/components/ui/home/Icon', () => ({
  default: ({ onClick }: { onClick?: () => void }) => (
    <button data-testid="back-icon" onClick={onClick}>
      Back
    </button>
  ),
}));

// Mock SearchProfile component
vi.mock('@/features/timeline/components/SearchProfile', () => ({
  default: () => <div data-testid="search-profile">Search Profile</div>,
}));

import SearchBar from '../components/SearchBar';

describe('SearchBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the SearchBar component', () => {
    render(<SearchBar />);
    expect(screen.getByTestId('back-icon')).toBeInTheDocument();
    expect(screen.getByTestId('search-profile')).toBeInTheDocument();
  });

  it('should render back button', () => {
    render(<SearchBar />);
    expect(screen.getByTestId('back-icon')).toBeInTheDocument();
  });

  it('should call router.back when back button is clicked', () => {
    render(<SearchBar />);
    const backButton = screen.getByTestId('back-icon');
    fireEvent.click(backButton);
    expect(mockBack).toHaveBeenCalled();
  });

  it('should render SearchProfile component', () => {
    render(<SearchBar />);
    expect(screen.getByTestId('search-profile')).toBeInTheDocument();
  });

  it('should have flex container layout', () => {
    const { container } = render(<SearchBar />);
    const flexContainer = container.querySelector('.flex.items-center');
    expect(flexContainer).toBeInTheDocument();
  });

  it('should have gap between elements', () => {
    const { container } = render(<SearchBar />);
    const flexContainer = container.querySelector('.gap-1');
    expect(flexContainer).toBeInTheDocument();
  });

  it('should have proper padding', () => {
    const { container } = render(<SearchBar />);
    const flexContainer = container.querySelector('.px-3');
    expect(flexContainer).toBeInTheDocument();
  });

  it('should render with full width', () => {
    const { container } = render(<SearchBar />);
    const flexContainer = container.querySelector('.w-full');
    expect(flexContainer).toBeInTheDocument();
  });
});
