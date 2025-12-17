import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/test-utils';
import LeftSidebar from '../components/LeftSidebar';

vi.mock('../components/MenuItems', () => ({
  default: () => <div data-testid="menu-items">Menu Items</div>,
}));

vi.mock('../components/ProfileSection', () => ({
  default: () => <div data-testid="profile-section">Profile Section</div>,
}));

vi.mock('../components/PostButton', () => ({
  default: () => <button data-testid="post-button">Post</button>,
}));

vi.mock('../components/Logo', () => ({
  default: () => <div data-testid="logo">Logo</div>,
}));

describe('LeftSidebar', () => {
  it('should render logo', () => {
    render(<LeftSidebar />);

    expect(screen.getByTestId('sidebar-logo')).toBeInTheDocument();
  });

  it('should render menu items', () => {
    render(<LeftSidebar />);

    expect(screen.getByTestId('menu-items')).toBeInTheDocument();
  });

  it('should render post button', () => {
    render(<LeftSidebar />);

    expect(screen.getByTestId('post-button')).toBeInTheDocument();
  });

  it('should render profile section', () => {
    render(<LeftSidebar />);

    expect(screen.getByTestId('profile-section')).toBeInTheDocument();
  });

  it('should render as aside element', () => {
    const { container } = render(<LeftSidebar />);
    const aside = container.querySelector('aside');

    expect(aside).toBeInTheDocument();
  });

  it('should have proper layout structure', () => {
    const { container } = render(<LeftSidebar />);
    const aside = container.querySelector('aside');

    expect(aside).toHaveClass('flex', 'flex-col');
  });
});

// // Mock child components
// vi.mock('../MenuItems', () => ({
//   default: () => <div data-testid="menu-items">Menu Items</div>,
// }));

// vi.mock('../ProfileSection', () => ({
//   default: () => <div data-testid="profile-section">Profile Section</div>,
// }));

// vi.mock('../PostButton', () => ({
//   default: () => <button data-testid="post-button">Post</button>,
// }));

// vi.mock('@/components/ui/icons', () => ({
//   XLogo: ({ className }: { className: string }) => (
//     <svg data-testid="x-logo" className={className}>
//       X Logo
//     </svg>
//   ),
// }));

// describe('LeftSidebar', () => {
//   it('should render the sidebar with all components', () => {
//     render(<LeftSidebar />);

//     expect(screen.getByTestId('x-logo')).toBeInTheDocument();
//     expect(screen.getByTestId('menu-items')).toBeInTheDocument();
//     expect(screen.getByTestId('post-button')).toBeInTheDocument();
//     expect(screen.getByTestId('profile-section')).toBeInTheDocument();
//   });

//   it('should render as an aside element with correct classes', () => {
//     const { container } = render(<LeftSidebar />);
//     const aside = container.querySelector('aside');

//     expect(aside).toBeInTheDocument();
//     expect(aside).toHaveClass('sticky', 'left-0', 'top-0', 'h-screen');
//     expect(aside).toHaveClass('bg-black', 'border-r', 'border-gray-800');
//   });

//   it('should have responsive layout classes', () => {
//     const { container } = render(<LeftSidebar />);
//     const aside = container.querySelector('aside');

//     expect(aside).toHaveClass('items-center', 'xl:items-start');
//     expect(aside).toHaveClass('sm:px-2', 'xl:px-4');
//   });

//   it('should render X logo with hover effect', () => {
//     render(<LeftSidebar />);
//     const logoWrapper = screen.getByTestId('x-logo').parentElement;

//     expect(logoWrapper).toHaveClass(
//       'hover:bg-gray-900',
//       'cursor-pointer',
//       'transition-colors'
//     );
//   });

//   it('should have overflow-y-auto for scrolling', () => {
//     const { container } = render(<LeftSidebar />);
//     const aside = container.querySelector('aside');

//     expect(aside).toHaveClass('overflow-y-auto');
//   });

//   it('should position profile section at the bottom', () => {
//     render(<LeftSidebar />);
//     const profileWrapper = screen.getByTestId('profile-section').parentElement;

//     expect(profileWrapper).toHaveClass('mt-auto', 'mb-4', 'w-full');
//   });
// });
