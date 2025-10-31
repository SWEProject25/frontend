import { UserProfile } from '../features/profile/types/api';

/**
 * Mock user profiles for testing and development
 */

// Mock current signed-in user (Ahmed Fathy)
export const mockCurrentUserProfile: UserProfile = {
  id: 1,
  userId: 1,
  name: 'Ahmed Fathy',
  birthDate: '1995-06-15T00:00:00.000Z',
  profileImageUrl: 'https://i.pravatar.cc/150?img=8',
  bannerImageUrl: 'https://picsum.photos/1500/500?random=10',
  bio: 'Full-stack developer | Building amazing web experiences | TypeScript enthusiast 🚀',
  location: 'Cairo, Egypt',
  website: 'https://ahmedfathy.dev',
  isDeactivated: false,
  createdAt: '2024-11-01T00:00:00.000Z',
  updatedAt: '2025-01-24T12:00:00.000Z',
  User: {
    id: 1,
    username: 'ahmedfathy',
    email: 'ahmed@example.com',
    role: 'USER',
    createdAt: '2024-11-01T00:00:00.000Z',
  },
};

export const mockUserProfile1: UserProfile = {
  id: 2,
  userId: 2,
  name: 'John Doe',
  birthDate: '1990-01-01T00:00:00.000Z',
  profileImageUrl: 'https://i.pravatar.cc/150?img=12',
  bannerImageUrl: 'https://picsum.photos/1500/500?random=1',
  bio: 'Software developer passionate about clean code and modern web technologies. Love building scalable applications.',
  location: 'San Francisco, CA',
  website: 'https://johndoe.com',
  isDeactivated: false,
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-15T10:30:00.000Z',
  User: {
    id: 2,
    username: 'john_doe',
    email: 'john@example.com',
    role: 'USER',
    createdAt: '2025-01-01T00:00:00.000Z',
  },
};

export const mockUserProfile2: UserProfile = {
  id: 2,
  userId: 2,
  name: 'Jane Smith',
  birthDate: '1992-05-15T00:00:00.000Z',
  profileImageUrl: 'https://i.pravatar.cc/150?img=5',
  bannerImageUrl: 'https://picsum.photos/1500/500?random=2',
  bio: 'UX Designer | Creative thinker | Coffee enthusiast ☕',
  location: 'New York, NY',
  website: 'https://janesmith.design',
  isDeactivated: false,
  createdAt: '2025-01-05T00:00:00.000Z',
  updatedAt: '2025-01-20T14:20:00.000Z',
  User: {
    id: 2,
    username: 'jane_smith',
    email: 'jane@example.com',
    role: 'USER',
    createdAt: '2025-01-05T00:00:00.000Z',
  },
};

export const mockUserProfile3: UserProfile = {
  id: 3,
  userId: 3,
  name: 'Mike Johnson',
  birthDate: '1988-11-20T00:00:00.000Z',
  profileImageUrl: 'https://i.pravatar.cc/150?img=33',
  bannerImageUrl: 'https://picsum.photos/1500/500?random=3',
  bio: 'Full-stack developer | Open source contributor | Tech blogger',
  location: 'Austin, TX',
  website: 'https://mikejohnson.dev',
  isDeactivated: false,
  createdAt: '2024-12-15T00:00:00.000Z',
  updatedAt: '2025-01-18T09:45:00.000Z',
  User: {
    id: 3,
    username: 'mike_johnson',
    email: 'mike@example.com',
    role: 'USER',
    createdAt: '2024-12-15T00:00:00.000Z',
  },
};

export const mockUserProfile4: UserProfile = {
  id: 4,
  userId: 4,
  name: 'Sarah Williams',
  birthDate: '1995-03-08T00:00:00.000Z',
  profileImageUrl: 'https://i.pravatar.cc/150?img=9',
  bannerImageUrl: 'https://picsum.photos/1500/500?random=4',
  bio: 'Product Manager | Agile practitioner | Building the future of tech',
  location: 'Seattle, WA',
  website: 'https://sarahwilliams.io',
  isDeactivated: false,
  createdAt: '2025-01-10T00:00:00.000Z',
  updatedAt: '2025-01-22T16:15:00.000Z',
  User: {
    id: 4,
    username: 'sarah_williams',
    email: 'sarah@example.com',
    role: 'USER',
    createdAt: '2025-01-10T00:00:00.000Z',
  },
};

export const mockUserProfile5: UserProfile = {
  id: 5,
  userId: 5,
  name: 'David Chen',
  birthDate: '1991-07-25T00:00:00.000Z',
  profileImageUrl: 'https://i.pravatar.cc/150?img=68',
  bannerImageUrl: 'https://picsum.photos/1500/500?random=5',
  bio: 'AI/ML Engineer | Deep Learning enthusiast | Research & Development',
  location: 'Boston, MA',
  website: 'https://davidchen.ai',
  isDeactivated: false,
  createdAt: '2024-12-20T00:00:00.000Z',
  updatedAt: '2025-01-19T11:30:00.000Z',
  User: {
    id: 5,
    username: 'david_chen',
    email: 'david@example.com',
    role: 'USER',
    createdAt: '2024-12-20T00:00:00.000Z',
  },
};

export const mockUserProfileDeactivated: UserProfile = {
  id: 6,
  userId: 6,
  name: 'Deleted User',
  birthDate: '1985-01-01T00:00:00.000Z',
  profileImageUrl: null,
  bannerImageUrl: null,
  bio: null,
  location: null,
  website: null,
  isDeactivated: true,
  createdAt: '2024-11-01T00:00:00.000Z',
  updatedAt: '2025-01-10T00:00:00.000Z',
  User: {
    id: 6,
    username: 'deleted_user',
    email: 'deleted@example.com',
    role: 'USER',
    createdAt: '2024-11-01T00:00:00.000Z',
  },
};

export const mockUserProfileMinimal: UserProfile = {
  id: 7,
  userId: 7,
  name: 'Alex Brown',
  birthDate: '1993-09-12T00:00:00.000Z',
  profileImageUrl: null,
  bannerImageUrl: null,
  bio: null,
  location: null,
  website: null,
  isDeactivated: false,
  createdAt: '2025-01-23T00:00:00.000Z',
  updatedAt: '2025-01-23T00:00:00.000Z',
  User: {
    id: 7,
    username: 'alex_brown',
    email: 'alex@example.com',
    role: 'USER',
    createdAt: '2025-01-23T00:00:00.000Z',
  },
};

export const mockUserProfiles: UserProfile[] = [
  mockCurrentUserProfile, // Ahmed Fathy (current signed-in user)
  mockUserProfile1,
  mockUserProfile2,
  mockUserProfile3,
  mockUserProfile4,
  mockUserProfile5,
  mockUserProfileMinimal,
];

// Helper function to get mock profile by ID
export const getMockProfileById = (id: number): UserProfile | undefined => {
  return mockUserProfiles.find((profile) => profile.id === id);
};

// Helper function to get mock profile by user ID
export const getMockProfileByUserId = (
  userId: number
): UserProfile | undefined => {
  return mockUserProfiles.find((profile) => profile.userId === userId);
};

// Helper function to get mock profile by username
export const getMockProfileByUsername = (
  username: string
): UserProfile | undefined => {
  return mockUserProfiles.find((profile) => profile.User.username === username);
};

// Helper function to search mock profiles
export const searchMockProfiles = (query: string): UserProfile[] => {
  const lowerQuery = query.toLowerCase();
  return mockUserProfiles.filter(
    (profile) =>
      profile.name.toLowerCase().includes(lowerQuery) ||
      profile.User.username.toLowerCase().includes(lowerQuery)
  );
};
