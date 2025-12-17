import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Avatar from '../Avatar';

describe('Avatar Component', () => {
  it('should render avatar with image', () => {
    render(
      <Avatar avatarImage="https://example.com/avatar.jpg" name="Test User" />
    );

    const image = screen.getByAltText('Test User');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src');
  });

  it('should render initial when no image is provided', () => {
    render(<Avatar avatarImage={null} name="Test User" />);

    expect(screen.getByText('T')).toBeInTheDocument();
  });

  it('should not render initial when name is not provided', () => {
    const { container } = render(<Avatar avatarImage={null} />);

    expect(container.querySelector('span')).not.toBeInTheDocument();
  });

  it('should apply correct size classes for xs size', () => {
    const { container } = render(
      <Avatar avatarImage={null} name="Test" size="xs" />
    );

    const avatarDiv = container.firstChild as HTMLElement;
    expect(avatarDiv).toHaveClass('w-[38px]', 'h-[38px]');
  });

  it('should apply correct size classes for lg size', () => {
    const { container } = render(
      <Avatar avatarImage={null} name="Test" size="lg" />
    );

    const avatarDiv = container.firstChild as HTMLElement;
    expect(avatarDiv).toHaveClass('w-[100px]', 'h-[100px]');
  });

  it('should apply absolute positioning by default', () => {
    const { container } = render(<Avatar avatarImage={null} name="Test" />);

    const avatarDiv = container.firstChild as HTMLElement;
    expect(avatarDiv).toHaveClass('absolute');
  });

  it('should apply relative positioning when specified', () => {
    const { container } = render(
      <Avatar avatarImage={null} name="Test" position="relative" />
    );

    const avatarDiv = container.firstChild as HTMLElement;
    expect(avatarDiv).toHaveClass('relative');
  });

  it('should apply custom className', () => {
    const { container } = render(
      <Avatar
        avatarImage={null}
        name="Test"
        className="custom-border border-8"
      />
    );

    const avatarDiv = container.firstChild as HTMLElement;
    expect(avatarDiv).toHaveClass('custom-border', 'border-8');
  });

  it('should render children', () => {
    render(
      <Avatar avatarImage={null} name="Test">
        <div data-testid="child-element">Child Content</div>
      </Avatar>
    );

    expect(screen.getByTestId('child-element')).toBeInTheDocument();
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });

  it('should apply default border classes when className does not include border', () => {
    const { container } = render(
      <Avatar avatarImage={null} name="Test" className="custom-class" />
    );

    const avatarDiv = container.firstChild as HTMLElement;
    expect(avatarDiv.className).toContain('border-2');
    expect(avatarDiv.className).toContain('sm:border-4');
  });

  it('should use provided border class when className includes border', () => {
    const { container } = render(
      <Avatar avatarImage={null} name="Test" className="border-8" />
    );

    const avatarDiv = container.firstChild as HTMLElement;
    expect(avatarDiv).toHaveClass('border-8');
    expect(avatarDiv.className).not.toContain('border-2');
  });

  it('should apply custom position style when customPosition is true', () => {
    const { container } = render(
      <Avatar
        avatarImage={null}
        name="Test"
        position="absolute"
        customPosition={true}
      />
    );

    const avatarDiv = container.firstChild as HTMLElement;
    expect(avatarDiv.style.left).toBe('');
    expect(avatarDiv.style.top).toBe('');
  });

  it('should apply default position style when position is absolute and customPosition is false', () => {
    const { container } = render(
      <Avatar
        avatarImage={null}
        name="Test"
        position="absolute"
        customPosition={false}
      />
    );

    const avatarDiv = container.firstChild as HTMLElement;
    expect(avatarDiv.style.left).toBe('12px');
    expect(avatarDiv.style.top).toBe('80px');
    expect(avatarDiv.style.zIndex).toBe('1');
  });
});
