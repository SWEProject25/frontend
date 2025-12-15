import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import TweetFooter from '../components/TweetFooter';

describe('TweetFooter Component', () => {
  it('should render children correctly', () => {
    render(
      <TweetFooter>
        <span data-testid="child-element">Child Content</span>
      </TweetFooter>
    );

    const child = screen.getByTestId('child-element');
    expect(child).toBeInTheDocument();
    expect(child).toHaveTextContent('Child Content');
  });

  it('should render the footer container', () => {
    render(
      <TweetFooter>
        <span>Content</span>
      </TweetFooter>
    );

    const footer = screen.getByTestId('tweet-footer');
    expect(footer).toBeInTheDocument();
  });

  it('should have correct styling classes', () => {
    render(
      <TweetFooter>
        <span>Content</span>
      </TweetFooter>
    );

    const footer = screen.getByTestId('tweet-footer');
    expect(footer).toHaveClass('w-full');
    expect(footer).toHaveClass('h-13');
    expect(footer).toHaveClass('flex');
    expect(footer).toHaveClass('flex-1');
    expect(footer).toHaveClass('items-center');
    expect(footer).toHaveClass('justify-between');
    expect(footer).toHaveClass('pb-2');
    expect(footer).toHaveClass('border-t');
    expect(footer).toHaveClass('border-border');
  });

  it('should render multiple children', () => {
    render(
      <TweetFooter>
        <span data-testid="child-1">First</span>
        <span data-testid="child-2">Second</span>
        <span data-testid="child-3">Third</span>
      </TweetFooter>
    );

    expect(screen.getByTestId('child-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-2')).toBeInTheDocument();
    expect(screen.getByTestId('child-3')).toBeInTheDocument();
  });

  it('should render complex nested children', () => {
    render(
      <TweetFooter>
        <div data-testid="nested-parent">
          <span data-testid="nested-child">Nested Content</span>
        </div>
      </TweetFooter>
    );

    const parent = screen.getByTestId('nested-parent');
    const child = screen.getByTestId('nested-child');
    expect(parent).toBeInTheDocument();
    expect(child).toBeInTheDocument();
    expect(parent).toContainElement(child);
  });

  it('should render empty children without errors', () => {
    render(<TweetFooter>{null}</TweetFooter>);

    const footer = screen.getByTestId('tweet-footer');
    expect(footer).toBeInTheDocument();
  });

  it('should render text content as children', () => {
    render(<TweetFooter>Text content only</TweetFooter>);

    const footer = screen.getByTestId('tweet-footer');
    expect(footer).toHaveTextContent('Text content only');
  });

  it('should render as a div element', () => {
    render(
      <TweetFooter>
        <span>Content</span>
      </TweetFooter>
    );

    const footer = screen.getByTestId('tweet-footer');
    expect(footer.tagName).toBe('DIV');
  });
});
