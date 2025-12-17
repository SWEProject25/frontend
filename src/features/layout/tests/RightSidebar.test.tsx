import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/test-utils';
import RightSidebar from '../components/RightSidebar';

vi.mock('@/features/timeline/components/SearchProfile', () => ({
  __esModule: true,
  default: () => <div data-testid="search-profile">Search Profile</div>,
}));

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  })),
  usePathname: vi.fn(() => '/'),
}));

vi.mock('../components/WhatIsHappening', () => ({
  default: () => <div data-testid="what-is-happening">What Is Happening</div>,
}));

vi.mock('../components/WhoToFollow', () => ({
  default: () => <div data-testid="who-to-follow">Who To Follow</div>,
}));

vi.mock('../components/Footer', () => ({
  default: () => <div data-testid="footer">Footer</div>,
}));

describe('RightSidebar', () => {
  it('should render search profile when hasSearch is true', () => {
    render(<RightSidebar hasSearch={true} />);

    expect(screen.getByTestId('search-profile')).toBeInTheDocument();
  });

  it('should not render search profile when hasSearch is false', () => {
    render(<RightSidebar hasSearch={false} />);

    expect(screen.queryByTestId('search-profile')).not.toBeInTheDocument();
  });

  it('should render what is happening section when not hidden', () => {
    render(<RightSidebar hideWhatIsHappening={false} />);

    expect(screen.getByTestId('what-is-happening')).toBeInTheDocument();
  });

  it('should not render what is happening when hidden', () => {
    render(<RightSidebar hideWhatIsHappening={true} />);

    expect(screen.queryByTestId('what-is-happening')).not.toBeInTheDocument();
  });

  it('should render who to follow section', () => {
    render(<RightSidebar />);

    expect(screen.getByTestId('who-to-follow')).toBeInTheDocument();
  });

  it('should render footer', () => {
    render(<RightSidebar />);

    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('should render as aside element', () => {
    const { container } = render(<RightSidebar />);
    const aside = container.querySelector('aside');

    expect(aside).toBeInTheDocument();
  });

  it('should have proper styling', () => {
    const { container } = render(<RightSidebar />);
    const aside = container.querySelector('aside');

    expect(aside).toHaveClass('flex-col');
  });
});
// // Mock child components
// vi.mock('../SearchBar', () => ({
//   default: () => <div data-testid="search-bar">Search Bar</div>,
// }));

// vi.mock('../WhatIsHappening', () => ({
//   default: () => <div data-testid="what-is-happening">What Is Happening</div>,
// }));

// vi.mock('../WhoToFollow', () => ({
//   default: () => <div data-testid="who-to-follow">Who To Follow</div>,
// }));

// vi.mock('../Footer', () => ({
//   default: () => <div data-testid="footer">Footer</div>,
// }));

// describe('RightSidebar', () => {
//   it('should render all child components', () => {
//     render(<RightSidebar />);

//     expect(screen.getByTestId('search-bar')).toBeInTheDocument();
//     expect(screen.getByTestId('what-is-happening')).toBeInTheDocument();
//     expect(screen.getByTestId('who-to-follow')).toBeInTheDocument();
//     expect(screen.getByTestId('footer')).toBeInTheDocument();
//   });

//   it('should render as an aside element', () => {
//     const { container } = render(<RightSidebar />);
//     const aside = container.querySelector('aside');

//     expect(aside).toBeInTheDocument();
//   });

//   it('should have correct layout classes', () => {
//     const { container } = render(<RightSidebar />);
//     const aside = container.querySelector('aside');

//     expect(aside).toHaveClass(
//       'sticky',
//       'right-0',
//       'top-0',
//       'w-full',
//       'h-screen',
//       'flex-col'
//     );
//   });

//   it('should be hidden on small screens and visible on large screens', () => {
//     const { container } = render(<RightSidebar />);
//     const aside = container.querySelector('aside');

//     expect(aside).toHaveClass('hidden', 'lg:flex');
//   });

//   it('should have proper spacing and styling', () => {
//     const { container } = render(<RightSidebar />);
//     const aside = container.querySelector('aside');

//     expect(aside).toHaveClass('gap-4', 'px-4', 'pt-1', 'bg-black');
//   });

//   it('should have overflow-y-auto for scrolling', () => {
//     const { container } = render(<RightSidebar />);
//     const aside = container.querySelector('aside');

//     expect(aside).toHaveClass('overflow-y-auto');
//   });

//   it('should render components in correct order', () => {
//     const { container } = render(<RightSidebar />);
//     const aside = container.querySelector('aside');
//     const children = Array.from(aside?.children || []);

//     expect(children[0]).toHaveAttribute('data-testid', 'search-bar');
//     expect(children[1]).toHaveAttribute('data-testid', 'what-is-happening');
//     expect(children[2]).toHaveAttribute('data-testid', 'who-to-follow');
//     expect(children[3]).toHaveAttribute('data-testid', 'footer');
//   });
// });
