import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import SettingsLayout from '../SettingsLayout';
import { usePathname } from 'next/navigation';

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}));

// Mock constants
vi.mock('@/features/settings/constants/SETTINGs_ITEMS', () => ({
  SETTINGS_ITEMS: [
    {
      id: 'account',
      label: 'Your Account',
      description: 'Account settings',
      icon: 'UserIcon',
      subOptions: [
        {
          id: 'account-info',
          label: 'Account Information',
          path: '/settings/account/info',
        },
      ],
    },
    {
      id: 'security',
      label: 'Security',
      description: 'Security settings',
      icon: 'KeyIcon',
      subOptions: [
        {
          id: 'security-overview',
          label: 'Security Overview',
          path: '/settings/security/overview',
        },
      ],
    },
  ],
}));

// Mock components
vi.mock('../SettingsList', () => ({
  default: ({ options }: any) => (
    <div data-testid="settings-list">
      {options.map((option: any) => (
        <div key={option.id} data-testid={`list-option-${option.id}`}>
          {option.label}
        </div>
      ))}
    </div>
  ),
}));

vi.mock('../SettingsDetail', () => ({
  default: ({ selectedOption }: any) => (
    <div data-testid="settings-detail">
      {selectedOption ? (
        <div data-testid="detail-option-id">{selectedOption.id}</div>
      ) : (
        <div>No option selected</div>
      )}
    </div>
  ),
}));

describe('SettingsLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Main Settings Page', () => {
    it('should show SettingsList on main settings page', () => {
      vi.mocked(usePathname).mockReturnValue('/settings');

      render(<SettingsLayout />);

      expect(screen.getByTestId('settings-layout')).toBeInTheDocument();
      expect(screen.getByTestId('settings-sidebar')).toBeInTheDocument();
      expect(screen.getByTestId('settings-list')).toBeInTheDocument();
    });

    it('should show sidebar as block on main page', () => {
      vi.mocked(usePathname).mockReturnValue('/settings');

      render(<SettingsLayout />);

      const sidebar = screen.getByTestId('settings-sidebar');
      expect(sidebar).toHaveClass('block');
    });

    it('should hide content on main page (for lg screens)', () => {
      vi.mocked(usePathname).mockReturnValue('/settings');

      render(<SettingsLayout />);

      const content = screen.getByTestId('settings-content');
      expect(content).toHaveClass('hidden');
      expect(content).toHaveClass('lg:block');
    });
  });

  describe('Category Page (e.g., /settings/account)', () => {
    it('should show SettingsDetail when on category page', () => {
      vi.mocked(usePathname).mockReturnValue('/settings/account');

      render(<SettingsLayout />);

      expect(screen.getByTestId('settings-detail')).toBeInTheDocument();
      expect(screen.getByTestId('detail-option-id')).toHaveTextContent(
        'account'
      );
    });

    it('should hide sidebar on mobile for category page', () => {
      vi.mocked(usePathname).mockReturnValue('/settings/account');

      render(<SettingsLayout />);

      const sidebar = screen.getByTestId('settings-sidebar');
      expect(sidebar).toHaveClass('hidden');
      expect(sidebar).toHaveClass('lg:block');
    });

    it('should show content as block for category page', () => {
      vi.mocked(usePathname).mockReturnValue('/settings/account');

      render(<SettingsLayout />);

      const content = screen.getByTestId('settings-content');
      expect(content).toHaveClass('block');
    });
  });

  describe('Sub-Page (e.g., /settings/account/info)', () => {
    it('should render children when on sub-page', () => {
      vi.mocked(usePathname).mockReturnValue('/settings/account/info');

      render(
        <SettingsLayout>
          <div data-testid="custom-content">Custom Content</div>
        </SettingsLayout>
      );

      expect(screen.getByTestId('custom-content')).toBeInTheDocument();
      expect(screen.getByText('Custom Content')).toBeInTheDocument();
    });

    it('should not render SettingsDetail on sub-page', () => {
      vi.mocked(usePathname).mockReturnValue('/settings/account/info');

      render(
        <SettingsLayout>
          <div data-testid="custom-content">Custom Content</div>
        </SettingsLayout>
      );

      expect(screen.queryByText('No option selected')).not.toBeInTheDocument();
    });

    it('should hide sidebar on mobile for sub-page', () => {
      vi.mocked(usePathname).mockReturnValue('/settings/account/info');

      render(<SettingsLayout />);

      const sidebar = screen.getByTestId('settings-sidebar');
      expect(sidebar).toHaveClass('hidden');
      expect(sidebar).toHaveClass('lg:block');
    });
  });

  describe('Different Categories', () => {
    it('should show correct selected option for security category', () => {
      vi.mocked(usePathname).mockReturnValue('/settings/security');

      render(<SettingsLayout />);

      expect(screen.getByTestId('detail-option-id')).toHaveTextContent(
        'security'
      );
    });

    it('should show correct selected option for security sub-page', () => {
      vi.mocked(usePathname).mockReturnValue('/settings/security/overview');

      render(
        <SettingsLayout>
          <div data-testid="security-content">Security Content</div>
        </SettingsLayout>
      );

      expect(screen.getByTestId('security-content')).toBeInTheDocument();
    });
  });

  describe('Path Matching', () => {
    it('should correctly identify main category page vs sub-page', () => {
      vi.mocked(usePathname).mockReturnValue('/settings/account');

      const { rerender } = render(<SettingsLayout />);

      // Category page should show SettingsDetail
      expect(screen.getByTestId('settings-detail')).toBeInTheDocument();

      // Change to sub-page
      vi.mocked(usePathname).mockReturnValue('/settings/account/info');

      rerender(
        <SettingsLayout>
          <div data-testid="sub-page-content">Sub Page</div>
        </SettingsLayout>
      );

      // Sub-page should show children
      expect(screen.getByTestId('sub-page-content')).toBeInTheDocument();
    });

    it('should handle unknown paths gracefully', () => {
      vi.mocked(usePathname).mockReturnValue('/settings/unknown');

      render(<SettingsLayout />);

      // Should not crash, content area should be present
      expect(screen.getByTestId('settings-layout')).toBeInTheDocument();
      expect(screen.getByTestId('settings-content')).toBeInTheDocument();
    });
  });

  describe('Responsive Behavior', () => {
    it('should have correct responsive classes for sidebar', () => {
      vi.mocked(usePathname).mockReturnValue('/settings');

      render(<SettingsLayout />);

      const sidebar = screen.getByTestId('settings-sidebar');
      expect(sidebar).toHaveClass('lg:w-4/9');
    });

    it('should have correct responsive classes for content', () => {
      vi.mocked(usePathname).mockReturnValue('/settings');

      render(<SettingsLayout />);

      const content = screen.getByTestId('settings-content');
      expect(content).toHaveClass('lg:w-5/9');
    });

    it('should apply flex classes to layout', () => {
      vi.mocked(usePathname).mockReturnValue('/settings');

      render(<SettingsLayout />);

      const layout = screen.getByTestId('settings-layout');
      expect(layout).toHaveClass('flex');
      expect(layout).toHaveClass('flex-col');
      expect(layout).toHaveClass('lg:flex-row');
    });
  });

  describe('Props Handling', () => {
    it('should render children when provided', () => {
      vi.mocked(usePathname).mockReturnValue('/settings/account/info');

      render(
        <SettingsLayout>
          <div data-testid="test-children">Test Children</div>
        </SettingsLayout>
      );

      expect(screen.getByTestId('test-children')).toBeInTheDocument();
    });

    it('should handle no children gracefully', () => {
      vi.mocked(usePathname).mockReturnValue('/settings/account/info');

      render(<SettingsLayout />);

      expect(screen.getByTestId('settings-layout')).toBeInTheDocument();
      expect(screen.getByTestId('settings-content')).toBeInTheDocument();
    });
  });
});
