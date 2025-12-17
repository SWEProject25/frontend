import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/test-utils';
import Description from '../Description';

describe('Description', () => {
  it('should render bio text when bio is provided', () => {
    const bio = 'Software Developer | Tech Enthusiast';
    render(<Description bio={bio} />);

    const bioElement = screen.getByTestId('profile-bio');
    expect(bioElement).toBeInTheDocument();
    expect(bioElement).toHaveTextContent(bio);
  });

  it('should not render anything when bio is null', () => {
    const { container } = render(<Description bio={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('should not render anything when bio is empty string', () => {
    const { container } = render(<Description bio="" />);
    expect(container.firstChild).toBeNull();
  });

  it('should have correct styling', () => {
    const bio = 'Creative designer and developer';
    render(<Description bio={bio} />);

    const bioElement = screen.getByTestId('profile-bio');
    expect(bioElement).toHaveClass(
      'font-inter',
      'text-sm',
      'sm:text-base',
      'text-color-text-active'
    );
  });

  it('should render multiline bio correctly', () => {
    const bio = 'Line 1\nLine 2\nLine 3';
    render(<Description bio={bio} />);

    const bioElement = screen.getByTestId('profile-bio');
    expect(bioElement).toBeInTheDocument();
    expect(bioElement.textContent).toContain('Line 1');
    expect(bioElement.textContent).toContain('Line 2');
    expect(bioElement.textContent).toContain('Line 3');
  });

  it('should handle long bio text', () => {
    const longBio =
      'This is a very long bio that contains a lot of information about the user, their interests, their work, and their hobbies. It might span multiple lines on the screen.';
    render(<Description bio={longBio} />);

    const bioElement = screen.getByTestId('profile-bio');
    expect(bioElement).toHaveTextContent(longBio);
  });

  it('should render bio with special characters', () => {
    const bio = 'Developer @TechCorp | #ReactJS #TypeScript 🚀';
    render(<Description bio={bio} />);

    const bioElement = screen.getByTestId('profile-bio');
    expect(bioElement).toHaveTextContent(bio);
  });
});
