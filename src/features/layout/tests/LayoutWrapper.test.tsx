import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/test-utils';
import LayoutWrapper from '../components/LayoutWrapper';

vi.mock('../components/LeftSidebar', () => ({
  default: () => <div data-testid="left-sidebar">Left Sidebar</div>,
}));

vi.mock('../components/RightSidebar', () => ({
  default: () => <div data-testid="right-sidebar">Right Sidebar</div>,
}));

vi.mock('../components/MobileBottomBar', () => ({
  default: () => <div data-testid="mobile-bottom-bar">Mobile Bottom Bar</div>,
}));

vi.mock('../components/EmptySpace', () => ({
  default: () => <div data-testid="empty-space">Empty Space</div>,
}));

describe('LayoutWrapper', () => {
  it('should render children content', () => {
    render(
      <LayoutWrapper>
        <div>Test Content</div>
      </LayoutWrapper>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should render left sidebar', () => {
    render(
      <LayoutWrapper>
        <div>Content</div>
      </LayoutWrapper>
    );

    expect(screen.getByTestId('left-sidebar')).toBeInTheDocument();
  });

  it('should render right sidebar by default', () => {
    render(
      <LayoutWrapper>
        <div>Content</div>
      </LayoutWrapper>
    );

    expect(screen.getByTestId('right-sidebar')).toBeInTheDocument();
  });

  it('should hide right sidebar when showRightSidebar is false', () => {
    render(
      <LayoutWrapper showRightSidebar={false}>
        <div>Content</div>
      </LayoutWrapper>
    );

    expect(screen.queryByTestId('right-sidebar')).not.toBeInTheDocument();
  });

  it('should render mobile bottom bar', () => {
    render(
      <LayoutWrapper>
        <div>Content</div>
      </LayoutWrapper>
    );

    expect(screen.getByTestId('mobile-bottom-bar')).toBeInTheDocument();
  });

  it('should render empty spaces', () => {
    render(
      <LayoutWrapper>
        <div>Content</div>
      </LayoutWrapper>
    );

    const emptySpaces = screen.getAllByTestId('empty-space');
    expect(emptySpaces).toHaveLength(2);
  });

  it('should have correct container classes', () => {
    const { container } = render(
      <LayoutWrapper>
        <div>Content</div>
      </LayoutWrapper>
    );

    const mainContainer = container.firstChild;
    expect(mainContainer).toHaveClass(
      'min-h-screen',
      'bg-black',
      'flex',
      'justify-center'
    );
  });

  it('should apply max-width to main content when right sidebar is shown', () => {
    const { container } = render(
      <LayoutWrapper showRightSidebar={true}>
        <div>Content</div>
      </LayoutWrapper>
    );

    const main = container.querySelector('main');
    expect(main).toHaveClass('max-w-[600px]');
  });

  it('should apply larger max-width to main content when right sidebar is hidden', () => {
    const { container } = render(
      <LayoutWrapper showRightSidebar={false}>
        <div>Content</div>
      </LayoutWrapper>
    );

    const main = container.querySelector('main');
    expect(main).toHaveClass('max-w-[990px]');
  });

  it('should have borders on main content area', () => {
    const { container } = render(
      <LayoutWrapper>
        <div>Content</div>
      </LayoutWrapper>
    );

    const main = container.querySelector('main');
    expect(main).toHaveClass('border-x', 'border-gray-800');
  });

  it('should have responsive classes for left sidebar', () => {
    render(
      <LayoutWrapper>
        <div>Content</div>
      </LayoutWrapper>
    );

    const leftSidebarWrapper = screen.getByTestId('left-sidebar').parentElement;
    expect(leftSidebarWrapper).toHaveClass(
      'hidden',
      'sm:block',
      'w-[68px]',
      'sm:w-[88px]',
      'xl:w-[275px]',
      'flex-shrink-0'
    );
  });

  it('should have responsive classes for right sidebar', () => {
    render(
      <LayoutWrapper showRightSidebar={true}>
        <div>Content</div>
      </LayoutWrapper>
    );

    const rightSidebarWrapper =
      screen.getByTestId('right-sidebar').parentElement;
    expect(rightSidebarWrapper).toHaveClass(
      'hidden',
      'lg:block',
      'w-[350px]',
      'flex-shrink-0'
    );
  });

  it('should hide mobile bottom bar on larger screens', () => {
    render(
      <LayoutWrapper>
        <div>Content</div>
      </LayoutWrapper>
    );

    const mobileBarWrapper =
      screen.getByTestId('mobile-bottom-bar').parentElement;
    expect(mobileBarWrapper).toHaveClass('sm:hidden');
  });
});
