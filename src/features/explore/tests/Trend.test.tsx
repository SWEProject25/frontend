import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

// Mock constants
vi.mock('../constants/tabs', () => ({
  TRENDING_TAB: 'general',
}));

import Trend from '../components/Trend';

describe('Trend', () => {
  const mockOnClick = vi.fn();
  const defaultProps = {
    data: {
      tag: '#trending',
      totalPosts: 1500,
    },
    indx: 1,
    category: 'general',
    onClick: mockOnClick,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the Trend component', () => {
    render(<Trend {...defaultProps} />);
    expect(screen.getByText('#trending')).toBeInTheDocument();
  });

  it('should display the trend tag', () => {
    render(<Trend {...defaultProps} />);
    expect(screen.getByText('#trending')).toBeInTheDocument();
  });

  it('should display the index', () => {
    render(<Trend {...defaultProps} />);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('should display post count', () => {
    render(<Trend {...defaultProps} />);
    expect(screen.getByText('1,500 posts')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    render(<Trend {...defaultProps} />);
    const trendElement = screen.getByText('#trending').closest('div');
    fireEvent.click(trendElement!);
    expect(mockOnClick).toHaveBeenCalled();
  });

  it('should not display category when TRENDING_TAB', () => {
    render(<Trend {...defaultProps} />);
    // When category is TRENDING_TAB, it should not show the category name
    expect(screen.queryByText(' · general · Trending')).not.toBeInTheDocument();
  });

  it('should display category when not TRENDING_TAB', () => {
    render(<Trend {...defaultProps} category="sports" />);
    // The text is split across elements, check for sports text
    expect(screen.getByText(/sports/)).toBeInTheDocument();
    expect(screen.getByText(/Trending/)).toBeInTheDocument();
  });

  it('should format numbers over 10,000 with K suffix', () => {
    render(
      <Trend {...defaultProps} data={{ tag: '#test', totalPosts: 50000 }} />
    );
    expect(screen.getByText('5.0K posts')).toBeInTheDocument();
  });

  it('should format numbers under 10,000 with commas', () => {
    render(
      <Trend {...defaultProps} data={{ tag: '#test', totalPosts: 5000 }} />
    );
    expect(screen.getByText('5,000 posts')).toBeInTheDocument();
  });

  it('should display different tags correctly', () => {
    render(
      <Trend {...defaultProps} data={{ tag: '#javascript', totalPosts: 100 }} />
    );
    expect(screen.getByText('#javascript')).toBeInTheDocument();
    expect(screen.getByText('100 posts')).toBeInTheDocument();
  });

  it('should have hover styling', () => {
    const { container } = render(<Trend {...defaultProps} />);
    const trendDiv = container.querySelector('.hover\\:bg-input-bg-hover\\/40');
    expect(trendDiv).toBeInTheDocument();
  });

  it('should have cursor pointer', () => {
    const { container } = render(<Trend {...defaultProps} />);
    const trendDiv = container.querySelector('.cursor-pointer');
    expect(trendDiv).toBeInTheDocument();
  });

  it('should render with news category', () => {
    render(<Trend {...defaultProps} category="news" />);
    expect(screen.getByText(/news/)).toBeInTheDocument();
  });

  it('should render with entertainment category', () => {
    render(<Trend {...defaultProps} category="entertainment" />);
    expect(screen.getByText(/entertainment/)).toBeInTheDocument();
  });

  it('should format large numbers correctly', () => {
    render(
      <Trend {...defaultProps} data={{ tag: '#viral', totalPosts: 150000 }} />
    );
    expect(screen.getByText('15.0K posts')).toBeInTheDocument();
  });

  it('should render multiple indexes correctly', () => {
    const { rerender } = render(<Trend {...defaultProps} indx={1} />);
    expect(screen.getByText('1')).toBeInTheDocument();

    rerender(<Trend {...defaultProps} indx={5} />);
    expect(screen.getByText('5')).toBeInTheDocument();

    rerender(<Trend {...defaultProps} indx={10} />);
    expect(screen.getByText('10')).toBeInTheDocument();
  });
});
