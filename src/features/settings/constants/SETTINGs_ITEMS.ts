export interface SettingsSubOption {
  id: string;
  label: string;
  description?: string;
  path: string;
  subOptions?: SettingsSubOption[];
}

export interface SettingsOption {
  id: string;
  label: string;
  description?: string;
  path?: string;
  icon?: string;
  subOptions: SettingsSubOption[];
}

export const SETTINGS_ITEMS: SettingsOption[] = [
  {
    id: 'account',
    label: 'Your account',
    description: 'Manage your account information',
    path: '/settings/account',
    subOptions: [
      {
        id: 'account-info',
        label: 'Account Information',
        description:
          'See your account information like your phone number and email address.',
        path: '/settings/account/accountinfo',
        subOptions: [
          {
            id: 'profile-info',
            label: 'Profile information',
            description: 'Name, bio, location, and more',
            path: '/settings/account/accountinfo/profileinfo',
          },
          {
            id: 'username',
            label: 'Username',
            description: 'Change your username',
            path: '/settings/account/accountinfo/username',
          },
          {
            id: 'email',
            label: 'Email',
            description: 'Update your email address',
            path: '/settings/account/accountinfo/email',
          },
        ],
      },
    ],
  },
  {
    id: 'security_and_account_access',
    label: 'Security and account access',
    description: 'Manage your account security',
    path: '/settings/security_and_account_access',
    subOptions: [
      {
        id: 'change-password',
        label: 'Change your password',
        description: 'Change your password at any time.',
        path: '/settings/security_and_account_access/password',
      },
    ],
  },
  {
    id: 'privacy_and_safety',
    label: 'Privacy and safety',
    description: 'Manage what information you see and share',
    path: '/settings/privacy_and_safety',
    subOptions: [
      {
        id: 'mute-block',
        label: 'Mute and block',
        description:
          'Manage the accounts, words, and notifications that you want to hide.',
        path: '/settings/privacy_and_safety/mute_and_block',
        subOptions: [
          {
            id: 'blocked-accounts',
            label: 'Blocked accounts',
            description: 'View and manage blocked accounts',
            path: '/settings/privacy_and_safety/mute_and_block/blocked_accounts',
          },
          {
            id: 'muted-accounts',
            label: 'Muted accounts',
            description: 'View and manage muted accounts',
            path: '/settings/privacy_and_safety/mute_and_block/muted_accounts',
          },
        ],
      },
    ],
  },
];
