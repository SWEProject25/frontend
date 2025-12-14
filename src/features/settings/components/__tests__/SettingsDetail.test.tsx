import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SettingsDetail from '../SettingsDetail';
import { usePathname, useRouter } from 'next/navigation';
import type { SettingsOption } from '@/features/settings/constants/SETTINGs_ITEMS';

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
  useRouter: vi.fn(),
}));

// Mock components
vi.mock('@/components/ui/Breadcrumb', () => ({
  default: ({ title, subtitle, description, onBack, ...props }: any) => (
    <div {...props}>
      <button onClick={onBack} data-testid="breadcrumb-back">
        Back
      </button>
      <div data-testid="breadcrumb-title">{title}</div>
      <div data-testid="breadcrumb-subtitle">{subtitle}</div>
      <div data-testid="breadcrumb-description">{description}</div>
    </div>
  ),
}));

vi.mock('@/components/ui/ListItem', () => ({
  default: ({ children, href, isActive, ...props }: any) => (
    <div data-href={href} data-active={isActive} {...props}>
      {children}
    </div>
  ),
}));

vi.mock('@/components/ui/OptionItem', () => ({
  default: ({ label, description, icon, showArrow, ...props }: any) => (
    <div {...props}>
      <div data-testid="option-icon">{icon}</div>
      <div data-testid="option-label">{label}</div>
      <div data-testid="option-description">{description}</div>
      <div data-testid="option-arrow">{showArrow ? '>' : ''}</div>
    </div>
  ),
}));

vi.mock('@/components/ui/icons', () => ({
  UserIcon: ({ className }: any) => (
    <div className={className} data-testid="user-icon">
      U
    </div>
  ),
  KeyIcon: ({ className }: any) => (
    <div className={className} data-testid="key-icon">
      K
    </div>
  ),
  ChatIcon: ({ className }: any) => (
    <div className={className} data-testid="chat-icon">
      C
    </div>
  ),
  InstallIcon: ({ className }: any) => (
    <div className={className} data-testid="install-icon">
      I
    </div>
  ),
  MuteIcon: ({ className }: any) => (
    <div className={className} data-testid="mute-icon">
      M
    </div>
  ),
}));

const mockPush = vi.fn();

const mockSettingsOption: SettingsOption = {
  id: 'account',
  label: 'Your Account',
  description: 'Manage your account settings',
  icon: 'UserIcon',
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
    {
      id: 'download-archive',
      label: 'Download Archive',
      description: 'Download your data',
      path: '/settings/account/archive',
    },
  ],
};

describe('SettingsDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useRouter).mockReturnValue({
      push: mockPush,
    } as any);
    vi.mocked(usePathname).mockReturnValue('/settings/account');
  });

  describe('Empty State', () => {
    it('should render empty state when no option is selected', () => {
      render(<SettingsDetail selectedOption={null} />);

      expect(screen.getByTestId('settings-detail-empty')).toBeInTheDocument();
      expect(
        screen.getByText('Select a setting to view options')
      ).toBeInTheDocument();
    });

    it('should not render breadcrumb or nav when no option selected', () => {
      render(<SettingsDetail selectedOption={null} />);

      expect(
        screen.queryByTestId('settings-detail-breadcrumb')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('settings-detail-nav')
      ).not.toBeInTheDocument();
    });
  });

  describe('With Selected Option', () => {
    it('should render breadcrumb with option details', () => {
      render(<SettingsDetail selectedOption={mockSettingsOption} />);

      expect(
        screen.getByTestId('settings-detail-breadcrumb')
      ).toBeInTheDocument();
      expect(screen.getByTestId('breadcrumb-title')).toHaveTextContent(
        'Your Account'
      );
      expect(screen.getByTestId('breadcrumb-subtitle')).toHaveTextContent(
        '@ahmedfathy0-0'
      );
      expect(screen.getByTestId('breadcrumb-description')).toHaveTextContent(
        'Manage your account settings'
      );
    });

    it('should render all sub-options', () => {
      render(<SettingsDetail selectedOption={mockSettingsOption} />);

      expect(screen.getByTestId('settings-detail-nav')).toBeInTheDocument();
      expect(
        screen.getByTestId('settings-detail-item-account-info')
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('settings-detail-item-change-password')
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('settings-detail-item-download-archive')
      ).toBeInTheDocument();
    });

    it('should render ListItems with correct hrefs', () => {
      render(<SettingsDetail selectedOption={mockSettingsOption} />);

      expect(
        screen.getByTestId('settings-detail-item-account-info')
      ).toHaveAttribute('data-href', '/settings/account/info');
      expect(
        screen.getByTestId('settings-detail-item-change-password')
      ).toHaveAttribute('data-href', '/settings/account/password');
      expect(
        screen.getByTestId('settings-detail-item-download-archive')
      ).toHaveAttribute('data-href', '/settings/account/archive');
    });

    it('should mark active item based on pathname', () => {
      vi.mocked(usePathname).mockReturnValue('/settings/account/info');

      render(<SettingsDetail selectedOption={mockSettingsOption} />);

      expect(
        screen.getByTestId('settings-detail-item-account-info')
      ).toHaveAttribute('data-active', 'true');
      expect(
        screen.getByTestId('settings-detail-item-change-password')
      ).toHaveAttribute('data-active', 'false');
    });

    it('should render OptionItems with correct props', () => {
      render(<SettingsDetail selectedOption={mockSettingsOption} />);

      const accountInfoOption = screen.getByTestId(
        'settings-detail-option-account-info'
      );
      expect(accountInfoOption).toBeInTheDocument();

      // All options should have arrows
      const arrows = screen.getAllByTestId('option-arrow');
      expect(arrows).toHaveLength(3);
      arrows.forEach((arrow) => {
        expect(arrow).toHaveTextContent('>');
      });
    });
  });

  describe('Icons', () => {
    it('should render correct icon for account-info', () => {
      render(<SettingsDetail selectedOption={mockSettingsOption} />);

      const accountInfoItem = screen.getByTestId(
        'settings-detail-item-account-info'
      );
      expect(
        accountInfoItem.querySelector('[data-testid="user-icon"]')
      ).toBeInTheDocument();
    });

    it('should render correct icon for change-password', () => {
      render(<SettingsDetail selectedOption={mockSettingsOption} />);

      const changePasswordItem = screen.getByTestId(
        'settings-detail-item-change-password'
      );
      expect(
        changePasswordItem.querySelector('[data-testid="key-icon"]')
      ).toBeInTheDocument();
    });

    it('should render correct icon for download-archive', () => {
      render(<SettingsDetail selectedOption={mockSettingsOption} />);

      const downloadArchiveItem = screen.getByTestId(
        'settings-detail-item-download-archive'
      );
      expect(
        downloadArchiveItem.querySelector('[data-testid="install-icon"]')
      ).toBeInTheDocument();
    });

    it('should render default icon for unknown sub-option', () => {
      const optionWithUnknownSubOption: SettingsOption = {
        ...mockSettingsOption,
        subOptions: [
          {
            id: 'unknown-option',
            label: 'Unknown',
            description: 'Unknown option',
            path: '/settings/unknown',
          },
        ],
      };

      render(<SettingsDetail selectedOption={optionWithUnknownSubOption} />);

      const unknownItem = screen.getByTestId(
        'settings-detail-item-unknown-option'
      );
      expect(
        unknownItem.querySelector('[data-testid="user-icon"]')
      ).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('should navigate to /settings when back is clicked', () => {
      render(<SettingsDetail selectedOption={mockSettingsOption} />);

      const backButton = screen.getByTestId('breadcrumb-back');
      fireEvent.click(backButton);

      expect(mockPush).toHaveBeenCalledWith('/settings');
    });
  });

  describe('Different Sub-Options', () => {
    it('should handle security-related sub-options', () => {
      const securityOption: SettingsOption = {
        id: 'security',
        label: 'Security',
        description: 'Security settings',
        icon: 'KeyIcon',
        subOptions: [
          {
            id: 'security-overview',
            label: 'Security Overview',
            description: 'View security',
            path: '/settings/security/overview',
          },
          {
            id: 'two-factor',
            label: 'Two-Factor Auth',
            description: 'Enable 2FA',
            path: '/settings/security/2fa',
          },
        ],
      };

      render(<SettingsDetail selectedOption={securityOption} />);

      expect(
        screen.getByTestId('settings-detail-item-security-overview')
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('settings-detail-item-two-factor')
      ).toBeInTheDocument();
    });

    it('should handle privacy-related sub-options', () => {
      const privacyOption: SettingsOption = {
        id: 'privacy',
        label: 'Privacy',
        description: 'Privacy settings',
        icon: 'MuteIcon',
        subOptions: [
          {
            id: 'mute-block',
            label: 'Mute and Block',
            description: 'Manage blocked users',
            path: '/settings/privacy/mute-block',
          },
          {
            id: 'direct-messages',
            label: 'Direct Messages',
            description: 'DM settings',
            path: '/settings/privacy/messages',
          },
        ],
      };

      render(<SettingsDetail selectedOption={privacyOption} />);

      const muteBlockItem = screen.getByTestId(
        'settings-detail-item-mute-block'
      );
      expect(
        muteBlockItem.querySelector('[data-testid="mute-icon"]')
      ).toBeInTheDocument();

      const messagesItem = screen.getByTestId(
        'settings-detail-item-direct-messages'
      );
      expect(
        messagesItem.querySelector('[data-testid="chat-icon"]')
      ).toBeInTheDocument();
    });
  });
});
