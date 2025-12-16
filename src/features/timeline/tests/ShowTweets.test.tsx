import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ShowTweets from '../components/ShowTweets';

describe('ShowTweets Component', () => {
  it('should render the show tweets button', () => {
    render(<ShowTweets />);

    const button = screen.getByTestId('show-tweets-button');
    expect(button).toBeInTheDocument();
  });

  it('should display correct text', () => {
    render(<ShowTweets />);

    const button = screen.getByTestId('show-tweets-button');
    expect(button).toHaveTextContent('Show Hankers posts');
  });

  it('should have correct styling classes', () => {
    render(<ShowTweets />);

    const button = screen.getByTestId('show-tweets-button');
    expect(button).toHaveClass('flex');
    expect(button).toHaveClass('h-12');
    expect(button).toHaveClass('w-full');
    expect(button).toHaveClass('p-3');
    expect(button).toHaveClass('justify-center');
    expect(button).toHaveClass('text-primary');
    expect(button).toHaveClass('border-b-1');
    expect(button).toHaveClass('border-border');
  });

  it('should have hover styles', () => {
    render(<ShowTweets />);

    const button = screen.getByTestId('show-tweets-button');
    expect(button).toHaveClass('hover:cursor-pointer');
    expect(button).toHaveClass('hover:bg-border');
  });

  it('should render as a div element', () => {
    render(<ShowTweets />);

    const button = screen.getByTestId('show-tweets-button');
    expect(button.tagName).toBe('DIV');
  });
});
