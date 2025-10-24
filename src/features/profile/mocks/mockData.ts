import { UserProfile } from '../types/api';

/**
 * Mock user profiles for testing and development
 */

export const mockUserProfile1: UserProfile = {
  id: 1,
  user_id: 1,
  name: 'John Doe',
  birth_date: '1990-01-01T00:00:00.000Z',
  profile_image_url: 'https://i.pravatar.cc/150?img=12',
  banner_image_url: 'https://picsum.photos/1500/500?random=1',
  bio: 'Software developer passionate about clean code and modern web technologies. Love building scalable applications.',
  location: 'San Francisco, CA',
  website: 'https://johndoe.com',
  is_deactivated: false,
  created_at: '2025-01-01T00:00:00.000Z',
  updated_at: '2025-01-15T10:30:00.000Z',
  User: {
    id: 1,
    username: 'john_doe',
    email: 'john@example.com',
    role: 'USER',
    created_at: '2025-01-01T00:00:00.000Z',
  },
};

export const mockUserProfile2: UserProfile = {
  id: 2,
  user_id: 2,
  name: 'Jane Smith',
  birth_date: '1992-05-15T00:00:00.000Z',
  profile_image_url: 'https://i.pravatar.cc/150?img=5',
  banner_image_url: 'https://picsum.photos/1500/500?random=2',
  bio: 'UX Designer | Creative thinker | Coffee enthusiast ☕',
  location: 'New York, NY',
  website: 'https://janesmith.design',
  is_deactivated: false,
  created_at: '2025-01-05T00:00:00.000Z',
  updated_at: '2025-01-20T14:20:00.000Z',
  User: {
    id: 2,
    username: 'jane_smith',
    email: 'jane@example.com',
    role: 'USER',
    created_at: '2025-01-05T00:00:00.000Z',
  },
};

export const mockUserProfile3: UserProfile = {
  id: 3,
  user_id: 3,
  name: 'Mike Johnson',
  birth_date: '1988-11-20T00:00:00.000Z',
  profile_image_url: 'https://i.pravatar.cc/150?img=33',
  banner_image_url: 'https://picsum.photos/1500/500?random=3',
  bio: 'Full-stack developer | Open source contributor | Tech blogger',
  location: 'Austin, TX',
  website: 'https://mikejohnson.dev',
  is_deactivated: false,
  created_at: '2024-12-15T00:00:00.000Z',
  updated_at: '2025-01-18T09:45:00.000Z',
  User: {
    id: 3,
    username: 'mike_johnson',
    email: 'mike@example.com',
    role: 'USER',
    created_at: '2024-12-15T00:00:00.000Z',
  },
};

export const mockUserProfile4: UserProfile = {
  id: 4,
  user_id: 4,
  name: 'Sarah Williams',
  birth_date: '1995-03-08T00:00:00.000Z',
  profile_image_url: 'https://i.pravatar.cc/150?img=9',
  banner_image_url: 'https://picsum.photos/1500/500?random=4',
  bio: 'Product Manager | Agile practitioner | Building the future of tech',
  location: 'Seattle, WA',
  website: 'https://sarahwilliams.io',
  is_deactivated: false,
  created_at: '2025-01-10T00:00:00.000Z',
  updated_at: '2025-01-22T16:15:00.000Z',
  User: {
    id: 4,
    username: 'sarah_williams',
    email: 'sarah@example.com',
    role: 'USER',
    created_at: '2025-01-10T00:00:00.000Z',
  },
};

export const mockUserProfile5: UserProfile = {
  id: 5,
  user_id: 5,
  name: 'David Chen',
  birth_date: '1991-07-25T00:00:00.000Z',
  profile_image_url: 'https://i.pravatar.cc/150?img=68',
  banner_image_url: 'https://picsum.photos/1500/500?random=5',
  bio: 'AI/ML Engineer | Deep Learning enthusiast | Research & Development',
  location: 'Boston, MA',
  website: 'https://davidchen.ai',
  is_deactivated: false,
  created_at: '2024-12-20T00:00:00.000Z',
  updated_at: '2025-01-19T11:30:00.000Z',
  User: {
    id: 5,
    username: 'david_chen',
    email: 'david@example.com',
    role: 'USER',
    created_at: '2024-12-20T00:00:00.000Z',
  },
};

export const mockUserProfileDeactivated: UserProfile = {
  id: 6,
  user_id: 6,
  name: 'Deleted User',
  birth_date: '1985-01-01T00:00:00.000Z',
  profile_image_url: null,
  banner_image_url: null,
  bio: null,
  location: null,
  website: null,
  is_deactivated: true,
  created_at: '2024-11-01T00:00:00.000Z',
  updated_at: '2025-01-10T00:00:00.000Z',
  User: {
    id: 6,
    username: 'deleted_user',
    email: 'deleted@example.com',
    role: 'USER',
    created_at: '2024-11-01T00:00:00.000Z',
  },
};

export const mockUserProfileMinimal: UserProfile = {
  id: 7,
  user_id: 7,
  name: 'Alex Brown',
  birth_date: '1993-09-12T00:00:00.000Z',
  profile_image_url: null,
  banner_image_url: null,
  bio: null,
  location: null,
  website: null,
  is_deactivated: false,
  created_at: '2025-01-23T00:00:00.000Z',
  updated_at: '2025-01-23T00:00:00.000Z',
  User: {
    id: 7,
    username: 'alex_brown',
    email: 'alex@example.com',
    role: 'USER',
    created_at: '2025-01-23T00:00:00.000Z',
  },
};

export const mockUserProfiles: UserProfile[] = [
  mockUserProfile1,
  mockUserProfile2,
  mockUserProfile3,
  mockUserProfile4,
  mockUserProfile5,
  mockUserProfileMinimal,
];

// Mock current user (typically used for "me" endpoint)
export const mockCurrentUserProfile = mockUserProfile1;

// Helper function to get mock profile by ID
export const getMockProfileById = (id: number): UserProfile | undefined => {
  return mockUserProfiles.find((profile) => profile.id === id);
};

// Helper function to get mock profile by user ID
export const getMockProfileByUserId = (
  userId: number
): UserProfile | undefined => {
  return mockUserProfiles.find((profile) => profile.user_id === userId);
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
