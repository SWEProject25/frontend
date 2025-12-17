import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Cover from '../Cover';

describe('Cover Component', () => {
  it('should render with default styles when no cover image is provided', () => {
    const { container } = render(<Cover />);

    const coverDiv = container.firstChild as HTMLElement;
    expect(coverDiv).toBeInTheDocument();
    expect(coverDiv.style.backgroundImage).toBe('none');
    expect(coverDiv.style.backgroundColor).toBe('rgb(51, 54, 57)');
  });

  it('should render with cover image when provided', () => {
    const imageUrl = 'https://example.com/cover.jpg';
    const { container } = render(<Cover coverImage={imageUrl} />);

    const coverDiv = container.firstChild as HTMLElement;
    expect(coverDiv.style.backgroundImage).toBe(`url("${imageUrl}")`);
    expect(coverDiv.style.backgroundSize).toBe('cover');
    expect(coverDiv.style.backgroundPosition).toBe('center center');
  });

  it('should render children', () => {
    render(
      <Cover>
        <div data-testid="child-element">Child Content</div>
      </Cover>
    );

    expect(screen.getByTestId('child-element')).toBeInTheDocument();
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(<Cover className="custom-class" />);

    const coverDiv = container.firstChild as HTMLElement;
    expect(coverDiv).toHaveClass('custom-class');
  });

  it('should have default height classes', () => {
    const { container } = render(<Cover />);

    const coverDiv = container.firstChild as HTMLElement;
    expect(coverDiv).toHaveClass('h-[120px]', 'sm:h-[200px]');
  });

  it('should have default padding classes', () => {
    const { container } = render(<Cover />);

    const coverDiv = container.firstChild as HTMLElement;
    expect(coverDiv).toHaveClass('p-4', 'sm:p-8');
  });

  it('should have full width', () => {
    const { container } = render(<Cover />);

    const coverDiv = container.firstChild as HTMLElement;
    expect(coverDiv).toHaveClass('w-full');
  });

  it('should be a relative positioned flex container', () => {
    const { container } = render(<Cover />);

    const coverDiv = container.firstChild as HTMLElement;
    expect(coverDiv).toHaveClass('relative', 'flex', 'flex-row');
  });
});
