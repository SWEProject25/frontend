import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SettingsList from '../SettingsList';
import { usePathname } from 'next/navigation';
import type { SettingsOption } from '@/features/settings/constants/SETTINGs_ITEMS';

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}));

// Mock components
vi.mock('@/components/ui/Breadcrumb', () => ({
  default: ({ title, onBack, ...props }: any) => (
    <div {...props}>
      <button onClick={onBack} data-testid="breadcrumb-back">
        Back
      </button>
      <div data-testid="breadcrumb-title">{title}</div>
    </div>
  ),
}));

vi.mock('@/components/ui/ListItem', () => ({
  default: ({ children, href, isActive, ...props }: any) => (
    <div data-href={href} data-active={isActive?.toString()} {...props}>
      {children}
    </div>
  ),
}));

vi.mock('@/components/ui/OptionItem', () => ({
  default: ({ label, description, showArrow, ...props }: any) => (
    <div {...props}>
      <div data-testid="option-label">{label}</div>
      <div data-testid="option-description">{description}</div>
      {showArrow && <div data-testid="option-arrow">→</div>}
    </div>
  ),
}));

vi.mock('@/components/ui/input', () => ({
  SearchInput: ({ placeholder, value, onChange, ...props }: any) => (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      {...props}
    />
  ),
}));

const mockHistoryBack = vi.fn();

const mockOptions: SettingsOption[] = [
  {
    id: 'account',
    label: 'Your Account',
    description: 'Manage your account settings',
    icon: 'UserIcon',
    path: '/settings/account',
    subOptions: [
      {
        id: 'account-info',
        label: 'Account Information',
        description: 'View your account information',
        path: '/settings/account/info',
      },
      {
        id: 'change-password',
        label: 'Change Password',
        description: 'Update your password',
        path: '/settings/account/password',
      },
    ],
  },
  {
    id: 'security',
    label: 'Security',
    description: 'Security and privacy settings',
    icon: 'KeyIcon',
    path: '/settings/security',
    subOptions: [
      {
        id: 'security-overview',
        label: 'Security Overview',
        description: 'View security status',
        path: '/settings/security/overview',
      },
    ],
  },
  {
    id: 'notifications',
    label: 'Notifications',
    description: 'Manage notification preferences',
    icon: 'BellIcon',
    path: '/settings/notifications',
    subOptions: [],
  },
];

describe('SettingsList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(usePathname).mockReturnValue('/settings');
    Object.defineProperty(window, 'history', {
      value: { back: mockHistoryBack },
      writable: true,
    });
  });

  describe('Initial Render', () => {
    it('should render the component', () => {
      render(<SettingsList options={mockOptions} />);

      expect(screen.getByTestId('settings-list')).toBeInTheDocument();
      expect(screen.getByTestId('settings-breadcrumb')).toBeInTheDocument();
      expect(
        screen.getByTestId('settings-search-container')
      ).toBeInTheDocument();
      expect(screen.getByTestId('settings-nav')).toBeInTheDocument();
    });

    it('should render breadcrumb with correct title', () => {
      render(<SettingsList options={mockOptions} />);

      expect(screen.getByTestId('breadcrumb-title')).toHaveTextContent(
        'Settings'
      );
    });

    it('should render search input', () => {
      render(<SettingsList options={mockOptions} />);

      const searchInput = screen.getByTestId('settings-search-input');
      expect(searchInput).toBeInTheDocument();
      expect(searchInput).toHaveAttribute('placeholder', 'Search Settings');
    });
  });

  describe('Top-Level Options Display', () => {
    it('should display all top-level options when no search query', () => {
      render(<SettingsList options={mockOptions} />);

      expect(
        screen.getByTestId('settings-list-item-account')
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('settings-list-item-security')
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('settings-list-item-notifications')
      ).toBeInTheDocument();
    });

    it('should render options with correct labels and descriptions', () => {
      render(<SettingsList options={mockOptions} />);

      const labels = screen.getAllByTestId('option-label');
      expect(labels[0]).toHaveTextContent('Your Account');
      expect(labels[1]).toHaveTextContent('Security');
      expect(labels[2]).toHaveTextContent('Notifications');

      const descriptions = screen.getAllByTestId('option-description');
      expect(descriptions[0]).toHaveTextContent('Manage your account settings');
      expect(descriptions[1]).toHaveTextContent(
        'Security and privacy settings'
      );
      expect(descriptions[2]).toHaveTextContent(
        'Manage notification preferences'
      );
    });

    it('should render ListItems with correct hrefs', () => {
      render(<SettingsList options={mockOptions} />);

      expect(screen.getByTestId('settings-list-item-account')).toHaveAttribute(
        'data-href',
        '/settings/account'
      );
      expect(screen.getByTestId('settings-list-item-security')).toHaveAttribute(
        'data-href',
        '/settings/security'
      );
    });

    it('should show arrows for all options', () => {
      render(<SettingsList options={mockOptions} />);

      const arrows = screen.getAllByTestId('option-arrow');
      expect(arrows).toHaveLength(mockOptions.length);
    });
  });

  describe('Active State', () => {
    it('should mark active item based on pathname', () => {
      vi.mocked(usePathname).mockReturnValue('/settings/account');

      render(<SettingsList options={mockOptions} />);

      expect(screen.getByTestId('settings-list-item-account')).toHaveAttribute(
        'data-active',
        'true'
      );
      expect(screen.getByTestId('settings-list-item-security')).toHaveAttribute(
        'data-active',
        'false'
      );
    });

    it('should handle no active path', () => {
      vi.mocked(usePathname).mockReturnValue(null as any);

      render(<SettingsList options={mockOptions} />);

      expect(screen.getByTestId('settings-list-item-account')).toHaveAttribute(
        'data-active',
        'false'
      );
      expect(screen.getByTestId('settings-list-item-security')).toHaveAttribute(
        'data-active',
        'false'
      );
    });
  });

  describe('Search Functionality', () => {
    it('should filter options by label', () => {
      render(<SettingsList options={mockOptions} />);

      const searchInput = screen.getByTestId('settings-search-input');
      fireEvent.change(searchInput, { target: { value: 'security' } });

      expect(
        screen.queryByTestId('settings-list-item-account')
      ).not.toBeInTheDocument();
      expect(
        screen.getByTestId('settings-list-item-security')
      ).toBeInTheDocument();
      expect(
        screen.queryByTestId('settings-list-item-notifications')
      ).not.toBeInTheDocument();
    });

    it('should filter options by description', () => {
      render(<SettingsList options={mockOptions} />);

      const searchInput = screen.getByTestId('settings-search-input');
      fireEvent.change(searchInput, {
        target: { value: 'notification preferences' },
      });

      expect(
        screen.queryByTestId('settings-list-item-account')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('settings-list-item-security')
      ).not.toBeInTheDocument();
      expect(
        screen.getByTestId('settings-list-item-notifications')
      ).toBeInTheDocument();
    });

    it('should search in nested sub-options', () => {
      render(<SettingsList options={mockOptions} />);

      const searchInput = screen.getByTestId('settings-search-input');
      fireEvent.change(searchInput, { target: { value: 'change password' } });

      expect(
        screen.getByTestId('settings-list-item-change-password')
      ).toBeInTheDocument();
      expect(
        screen.queryByTestId('settings-list-item-account')
      ).not.toBeInTheDocument();
    });

    it('should show breadcrumb in description for nested results', () => {
      render(<SettingsList options={mockOptions} />);

      const searchInput = screen.getByTestId('settings-search-input');
      fireEvent.change(searchInput, {
        target: { value: 'account information' },
      });

      const descriptions = screen.getAllByTestId('option-description');
      expect(descriptions[0]).toHaveTextContent('Your Account');
    });

    it('should be case-insensitive', () => {
      render(<SettingsList options={mockOptions} />);

      const searchInput = screen.getByTestId('settings-search-input');
      fireEvent.change(searchInput, { target: { value: 'SECURITY' } });

      expect(
        screen.getByTestId('settings-list-item-security')
      ).toBeInTheDocument();
    });

    it('should show "No settings found" when no results', () => {
      render(<SettingsList options={mockOptions} />);

      const searchInput = screen.getByTestId('settings-search-input');
      fireEvent.change(searchInput, { target: { value: 'nonexistent' } });

      expect(screen.getByTestId('settings-no-results')).toBeInTheDocument();
      expect(
        screen.getByText(/No settings found matching "nonexistent"/)
      ).toBeInTheDocument();
    });

    it('should show all options when search is cleared', () => {
      render(<SettingsList options={mockOptions} />);

      const searchInput = screen.getByTestId('settings-search-input');

      // Search
      fireEvent.change(searchInput, { target: { value: 'security' } });
      expect(
        screen.queryByTestId('settings-list-item-account')
      ).not.toBeInTheDocument();

      // Clear search
      fireEvent.change(searchInput, { target: { value: '' } });
      expect(
        screen.getByTestId('settings-list-item-account')
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('settings-list-item-security')
      ).toBeInTheDocument();
    });

    it('should handle whitespace-only search query', () => {
      render(<SettingsList options={mockOptions} />);

      const searchInput = screen.getByTestId('settings-search-input');
      fireEvent.change(searchInput, { target: { value: '   ' } });

      // Should show all top-level options
      expect(
        screen.getByTestId('settings-list-item-account')
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('settings-list-item-security')
      ).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('should call window.history.back when back button is clicked', () => {
      render(<SettingsList options={mockOptions} />);

      const backButton = screen.getByTestId('breadcrumb-back');
      fireEvent.click(backButton);

      expect(mockHistoryBack).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty options array', () => {
      render(<SettingsList options={[]} />);

      expect(screen.getByTestId('settings-list')).toBeInTheDocument();
      expect(
        screen.queryByTestId('settings-list-item-account')
      ).not.toBeInTheDocument();
    });

    it('should handle options without subOptions', () => {
      const optionsWithoutSubOptions: SettingsOption[] = [
        {
          id: 'simple',
          label: 'Simple Option',
          description: 'A simple option',
          icon: 'Icon',
          path: '/settings/simple',
          subOptions: [],
        },
      ];

      render(<SettingsList options={optionsWithoutSubOptions} />);

      expect(
        screen.getByTestId('settings-list-item-simple')
      ).toBeInTheDocument();
    });

    it('should handle options without path', () => {
      const optionsWithoutPath: SettingsOption[] = [
        {
          id: 'no-path',
          label: 'No Path Option',
          description: 'Option without path',
          icon: 'Icon',
          subOptions: [],
        },
      ];

      render(<SettingsList options={optionsWithoutPath} />);

      expect(screen.getByTestId('settings-list-item-no-path')).toHaveAttribute(
        'data-href',
        '#'
      );
    });
  });

  describe('Search Query Display', () => {
    it('should update search input value', () => {
      render(<SettingsList options={mockOptions} />);

      const searchInput = screen.getByTestId(
        'settings-search-input'
      ) as HTMLInputElement;
      fireEvent.change(searchInput, { target: { value: 'test query' } });

      expect(searchInput.value).toBe('test query');
    });
  });
});
