export interface SettingsSubOption {
  id: string;
  label: string;
  description?: string;
  path: string;
}

export interface SettingsOption {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  subOptions: SettingsSubOption[];
}

export const SETTINGS_ITEMS: SettingsOption[] = [
  {
    id: 'account',
    label: 'Your account',
    description: 'Manage your account information',
    subOptions: [
      {
        id: 'account-info',
        label: 'Account Information',
        description:
          'See your account information like your phone number and email address.',
        path: '/settings/account',
      },
      {
        id: 'change-password',
        label: 'Change your password',
        description: 'Change your password at any time.',
        path: '/settings/account/password',
      },
      {
        id: 'download-archive',
        label: 'Download an archive of your data',
        description:
          'Get insights into the type of information stored for your account.',
        path: '/settings/account/download',
      },
    ],
  },
  {
    id: 'security',
    label: 'Security and account access',
    description: 'Manage your account security',
    subOptions: [
      {
        id: 'security-overview',
        label: 'Security',
        description: 'Manage your account security settings.',
        path: '/settings/security_and_account_access',
      },
      {
        id: 'two-factor',
        label: 'Two-factor authentication',
        description: 'Manage two-factor authentication options.',
        path: '/settings/security_and_account_access/two_factor',
      },
      {
        id: 'connected-apps',
        label: 'Apps and sessions',
        description: 'See information about when you logged into your account.',
        path: '/settings/security_and_account_access/sessions',
      },
    ],
  },
  {
    id: 'privacy',
    label: 'Privacy and safety',
    description: 'Manage what information you see and share',
    subOptions: [
      {
        id: 'audience',
        label: 'Audience and tagging',
        description:
          'Manage what information you allow other people on X to see.',
        path: '/settings/privacy_and_safety',
      },
      {
        id: 'content-preferences',
        label: 'Content you see',
        description: 'Decide what you see on X based on your preferences.',
        path: '/settings/privacy_and_safety/content',
      },
      {
        id: 'mute-block',
        label: 'Mute and block',
        description:
          'Manage the accounts, words, and notifications that you want to hide.',
        path: '/settings/privacy_and_safety/mute_and_block',
      },
      {
        id: 'direct-messages',
        label: 'Direct messages',
        description: 'Manage who can message you directly.',
        path: '/settings/privacy_and_safety/direct_messages',
      },
    ],
  },
  {
    id: 'notifications',
    label: 'Notifications',
    description: 'Select the kinds of notifications you get',
    subOptions: [
      {
        id: 'filters',
        label: 'Filters',
        description: 'Choose the notifications you want to see.',
        path: '/settings/notifications',
      },
      {
        id: 'preferences',
        label: 'Preferences',
        description: 'Select your preferences by notification type.',
        path: '/settings/notifications/preferences',
      },
      {
        id: 'push-notifications',
        label: 'Push notifications',
        description: 'Manage push notifications on web and mobile.',
        path: '/settings/notifications/push',
      },
    ],
  },
];
