import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/test-utils';
import MobileBottomBar from '../components/MobileBottomBar';

describe('MobileBottomBar', () => {
  it('should render mobile navigation bar', () => {
    const { container } = render(<MobileBottomBar />);
    const nav = container.querySelector('nav');

    expect(nav).toBeInTheDocument();
    expect(nav).toHaveClass(
      'fixed',
      'bottom-0',
      'left-0',
      'right-0',
      'bg-black',
      'border-t',
      'border-gray-800',
      'z-50'
    );
  });

  it('should render all 4 navigation links', () => {
    render(<MobileBottomBar />);

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(4);
  });

  it('should render correct navigation links with hrefs', () => {
    render(<MobileBottomBar />);

    expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute(
      'href',
      '/home'
    );
    expect(screen.getByRole('link', { name: /explore/i })).toHaveAttribute(
      'href',
      '/explore'
    );
    expect(
      screen.getByRole('link', { name: /notifications/i })
    ).toHaveAttribute('href', '/notifications');
    expect(screen.getByRole('link', { name: /messages/i })).toHaveAttribute(
      'href',
      '/messages'
    );
  });

  it('should have correct height', () => {
    const { container } = render(<MobileBottomBar />);
    const innerContainer = container.querySelector('nav > div');

    expect(innerContainer).toHaveClass('h-[53px]');
  });

  it('should have flex layout for navigation items', () => {
    const { container } = render(<MobileBottomBar />);
    const innerContainer = container.querySelector('nav > div');

    expect(innerContainer).toHaveClass(
      'flex',
      'justify-around',
      'items-center'
    );
  });

  it('should apply hover effects to links', () => {
    render(<MobileBottomBar />);
    const links = screen.getAllByRole('link');

    links.forEach((link) => {
      expect(link).toHaveClass('hover:bg-gray-900', 'transition-colors');
    });
  });

  it('should render icons with correct styling', () => {
    const { container } = render(<MobileBottomBar />);
    const icons = container.querySelectorAll('svg');

    icons.forEach((icon) => {
      expect(icon).toHaveClass('w-6', 'h-6');
    });
  });

  it('should highlight active link (Home)', () => {
    const { container } = render(<MobileBottomBar />);
    const icons = container.querySelectorAll('svg');
    const homeIcon = icons[0]; // First icon is Home

    expect(homeIcon).toHaveClass('text-white');
  });

  it('should show inactive styling for non-active links', () => {
    const { container } = render(<MobileBottomBar />);
    const icons = container.querySelectorAll('svg');

    // Icons 1, 2, 3 should be inactive (Explore, Notifications, Messages)
    expect(icons[1]).toHaveClass('text-gray-400');
    expect(icons[2]).toHaveClass('text-gray-400');
    expect(icons[3]).toHaveClass('text-gray-400');
  });

  it('should have flex-1 class on links for equal spacing', () => {
    render(<MobileBottomBar />);
    const links = screen.getAllByRole('link');

    links.forEach((link) => {
      expect(link).toHaveClass('flex-1');
    });
  });
});
