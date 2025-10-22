export interface BlockedUser {
  id: string;
  name: string;
  handle: string;
  verified: boolean;
  avatarUrl?: string;
  blockedDate: string;
}

export const BLOCKED_USERS: BlockedUser[] = [
  {
    id: '1',
    name: 'Spam Account',
    handle: '@spammer123',
    verified: false,
    blockedDate: '2024-10-15',
  },
  {
    id: '2',
    name: 'Toxic User',
    handle: '@toxicperson',
    verified: false,
    blockedDate: '2024-09-20',
  },
  {
    id: '3',
    name: 'Bot Account',
    handle: '@bot_user_456',
    verified: false,
    blockedDate: '2024-08-10',
  },
  {
    id: '4',
    name: 'Annoying Celebrity',
    handle: '@annoyingceleb',
    verified: true,
    blockedDate: '2024-07-05',
  },
  {
    id: '5',
    name: 'Troll Master',
    handle: '@trollmaster99',
    verified: false,
    blockedDate: '2024-06-12',
  },
];

export const MUTED_USERS: BlockedUser[] = [
  {
    id: '1',
    name: 'Noisy User',
    handle: '@talkative247',
    verified: false,
    blockedDate: '2024-09-25',
  },
  {
    id: '2',
    name: 'Over Poster',
    handle: '@posts_toomuch',
    verified: true,
    blockedDate: '2024-08-15',
  },
  {
    id: '3',
    name: 'News Spammer',
    handle: '@news_bot_24_7',
    verified: false,
    blockedDate: '2024-07-20',
  },
];
