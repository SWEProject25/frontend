import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/test-utils';
import MenuItems from '../MenuItems';

describe('MenuItems', () => {
  it('should render all menu items', () => {
    render(<MenuItems />);

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Explore')).toBeInTheDocument();
    expect(screen.getByText('Notifications')).toBeInTheDocument();
    expect(screen.getByText('Messages')).toBeInTheDocument();
    expect(screen.getByText('Bookmarks')).toBeInTheDocument();
    expect(screen.getByText('Communities')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('More')).toBeInTheDocument();
  });

  it('should render correct number of menu items', () => {
    const { container } = render(<MenuItems />);
    const menuItemDivs = container.querySelectorAll('nav > div');

    expect(menuItemDivs).toHaveLength(8);
  });

  it('should render as a nav element', () => {
    const { container } = render(<MenuItems />);
    const nav = container.querySelector('nav');

    expect(nav).toBeInTheDocument();
    expect(nav).toHaveClass('flex', 'flex-col', 'mt-1', 'w-full');
  });

  it('should have hover effects on menu items', () => {
    const { container } = render(<MenuItems />);
    const menuItems = container.querySelectorAll('nav > div');

    menuItems.forEach((item) => {
      expect(item).toHaveClass(
        'hover:bg-gray-900',
        'cursor-pointer',
        'transition-colors'
      );
    });
  });

  it('should apply active state styling to Home item', () => {
    render(<MenuItems />);
    const homeLabel = screen.getByText('Home');

    expect(homeLabel).toHaveClass('font-bold');
  });

  it('should apply inactive state styling to non-active items', () => {
    render(<MenuItems />);
    const exploreLabel = screen.getByText('Explore');

    expect(exploreLabel).toHaveClass('font-normal');
    expect(exploreLabel).not.toHaveClass('font-bold');
  });

  it('should hide Bookmarks and Communities on small screens', () => {
    const { container } = render(<MenuItems />);
    const menuItems = container.querySelectorAll('nav > div');

    // Find Bookmarks (index 4) and Communities (index 5)
    const bookmarksItem = menuItems[4];
    const communitiesItem = menuItems[5];

    expect(bookmarksItem).toHaveClass('hidden', 'xl:flex');
    expect(communitiesItem).toHaveClass('hidden', 'xl:flex');
  });

  it('should show all other items on all screen sizes', () => {
    const { container } = render(<MenuItems />);
    const menuItems = container.querySelectorAll('nav > div');

    // Check Home (index 0) doesn't have hidden class
    const homeItem = menuItems[0];
    expect(homeItem.className).not.toContain('hidden xl:flex');
  });

  it('should have responsive text visibility classes', () => {
    render(<MenuItems />);
    const labels = screen.getAllByText(/Home|Explore|Notifications/);

    labels.forEach((label) => {
      expect(label).toHaveClass('hidden', 'xl:block');
    });
  });

  it('should render icons with correct styling', () => {
    const { container } = render(<MenuItems />);
    const icons = container.querySelectorAll('svg');

    icons.forEach((icon) => {
      expect(icon).toHaveClass('w-7', 'h-7', 'text-white', 'flex-shrink-0');
    });
  });

  it('should have rounded-full class on menu items', () => {
    const { container } = render(<MenuItems />);
    const menuItems = container.querySelectorAll('nav > div');

    menuItems.forEach((item) => {
      expect(item).toHaveClass('rounded-full');
    });
  });
});
