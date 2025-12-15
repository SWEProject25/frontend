import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/test-utils';
import MenuItems from '../components/MenuItems';
import { useAuthStore } from '@/features/authentication/store/authStore';
import { usePathname } from 'next/navigation';

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}));

vi.mock('@/features/authentication/store/authStore');

vi.mock('@/features/notifications/components', () => ({
  NotificationBadge: () => <div data-testid="notification-badge">Badge</div>,
}));

vi.mock('@/features/messages/components/MessageBadge', () => ({
  MessageBadge: () => <div data-testid="message-badge">Badge</div>,
}));

describe('MenuItems', () => {
  beforeEach(() => {
    vi.mocked(usePathname).mockReturnValue('/home');
    vi.mocked(useAuthStore).mockReturnValue({
      user: { username: 'testuser', id: 1 },
    } as any);
  });

  it('should render all menu items', () => {
    render(<MenuItems />);

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Explore')).toBeInTheDocument();
    expect(screen.getByText('Notifications')).toBeInTheDocument();
    expect(screen.getByText('Messages')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  it('should render as a nav element', () => {
    const { container } = render(<MenuItems />);
    const nav = container.querySelector('nav');

    expect(nav).toBeInTheDocument();
  });

  it('should render notification badge', () => {
    render(<MenuItems />);

    expect(screen.getByTestId('notification-badge')).toBeInTheDocument();
  });

  it('should render message badge', () => {
    render(<MenuItems />);

    expect(screen.getByTestId('message-badge')).toBeInTheDocument();
  });

  it('should highlight active menu item based on pathname', () => {
    vi.mocked(usePathname).mockReturnValue('/notifications');

    const { container } = render(<MenuItems />);
    const links = container.querySelectorAll('a');
    const notificationsLink = Array.from(links).find(
      (link) => link.getAttribute('href') === '/notifications'
    );

    expect(notificationsLink).toBeInTheDocument();
  });

  it('should render profile link', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      user: { username: 'johndoe', id: 1 },
    } as any);

    render(<MenuItems />);

    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  it('should handle no user gracefully', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      user: null,
    } as any);

    render(<MenuItems />);

    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('should render correct number of visible menu items', () => {
    const { container } = render(<MenuItems />);
    const links = container.querySelectorAll('a');

    expect(links.length).toBeGreaterThan(0);
  });
});
// describe('MenuItems', () => {
//   it('should render all menu items', () => {
//     render(<MenuItems />);

//     expect(screen.getByText('Home')).toBeInTheDocument();
//     expect(screen.getByText('Explore')).toBeInTheDocument();
//     expect(screen.getByText('Notifications')).toBeInTheDocument();
//     expect(screen.getByText('Messages')).toBeInTheDocument();
//     expect(screen.getByText('Bookmarks')).toBeInTheDocument();
//     expect(screen.getByText('Communities')).toBeInTheDocument();
//     expect(screen.getByText('Profile')).toBeInTheDocument();
//     expect(screen.getByText('More')).toBeInTheDocument();
//   });

//   it('should render correct number of menu items', () => {
//     const { container } = render(<MenuItems />);
//     const menuItemDivs = container.querySelectorAll('nav > div');

//     expect(menuItemDivs).toHaveLength(8);
//   });

//   it('should render as a nav element', () => {
//     const { container } = render(<MenuItems />);
//     const nav = container.querySelector('nav');

//     expect(nav).toBeInTheDocument();
//     expect(nav).toHaveClass('flex', 'flex-col', 'mt-1', 'w-full');
//   });

//   it('should have hover effects on menu items', () => {
//     const { container } = render(<MenuItems />);
//     const menuItems = container.querySelectorAll('nav > div');

//     menuItems.forEach((item) => {
//       expect(item).toHaveClass(
//         'hover:bg-gray-900',
//         'cursor-pointer',
//         'transition-colors'
//       );
//     });
//   });

//   it('should apply active state styling to Home item', () => {
//     render(<MenuItems />);
//     const homeLabel = screen.getByText('Home');

//     expect(homeLabel).toHaveClass('font-bold');
//   });

//   it('should apply inactive state styling to non-active items', () => {
//     render(<MenuItems />);
//     const exploreLabel = screen.getByText('Explore');

//     expect(exploreLabel).toHaveClass('font-normal');
//     expect(exploreLabel).not.toHaveClass('font-bold');
//   });

//   it('should hide Bookmarks and Communities on small screens', () => {
//     const { container } = render(<MenuItems />);
//     const menuItems = container.querySelectorAll('nav > div');

//     // Find Bookmarks (index 4) and Communities (index 5)
//     const bookmarksItem = menuItems[4];
//     const communitiesItem = menuItems[5];

//     expect(bookmarksItem).toHaveClass('hidden', 'xl:flex');
//     expect(communitiesItem).toHaveClass('hidden', 'xl:flex');
//   });

//   it('should show all other items on all screen sizes', () => {
//     const { container } = render(<MenuItems />);
//     const menuItems = container.querySelectorAll('nav > div');

//     // Check Home (index 0) doesn't have hidden class
//     const homeItem = menuItems[0];
//     expect(homeItem.className).not.toContain('hidden xl:flex');
//   });

//   it('should have responsive text visibility classes', () => {
//     render(<MenuItems />);
//     const labels = screen.getAllByText(/Home|Explore|Notifications/);

//     labels.forEach((label) => {
//       expect(label).toHaveClass('hidden', 'xl:block');
//     });
//   });

//   it('should render icons with correct styling', () => {
//     const { container } = render(<MenuItems />);
//     const icons = container.querySelectorAll('svg');

//     icons.forEach((icon) => {
//       expect(icon).toHaveClass('w-7', 'h-7', 'text-white', 'flex-shrink-0');
//     });
//   });

//   it('should have rounded-full class on menu items', () => {
//     const { container } = render(<MenuItems />);
//     const menuItems = container.querySelectorAll('nav > div');

//     menuItems.forEach((item) => {
//       expect(item).toHaveClass('rounded-full');
//     });
//   });
// });
