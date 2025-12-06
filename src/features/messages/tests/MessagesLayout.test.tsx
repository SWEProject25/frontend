import { describe, it, expect, vi } from 'vitest';
import { render } from '@/test/test-utils';
import MessagesLayout from '@/app/messages/layout';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/messages'),
}));

// Mock LayoutWrapper component
vi.mock('@/features/layout/components/LayoutWrapper', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="layout-wrapper">{children}</div>
  ),
}));

describe('MessagesLayout', () => {
  it('should render children content', () => {
    const { container } = render(
      <MessagesLayout>
        <div>Test Content</div>
      </MessagesLayout>
    );
    expect(container.textContent).toContain('Test Content');
  });

  it('should apply layout structure', () => {
    const { container } = render(
      <MessagesLayout>
        <div>Child</div>
      </MessagesLayout>
    );
    expect(container.firstChild).toBeTruthy();
  });
});
