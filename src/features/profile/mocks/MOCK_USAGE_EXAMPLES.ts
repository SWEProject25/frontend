/**
 * Mock Profile Service Usage Examples
 * Complete examples showing how to use mock services
 */

// ============================================
// Example 1: Basic Mock Profile Component
// ============================================
/*
'use client';
import { useMockMyProfile } from '@/features/profile/mocks';

export default function MockProfileComponent() {
  const { data, isLoading, error, refetch } = useMockMyProfile();

  if (isLoading) return <div>Loading profile...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="p-4">
      <img src={data?.data.profile_image_url || '/default-avatar.png'} alt="Profile" />
      <h1>{data?.data.name}</h1>
      <p>@{data?.data.User.username}</p>
      <p>{data?.data.bio}</p>
      <button onClick={() => refetch()}>Refresh</button>
    </div>
  );
}
*/

// ============================================
// Example 2: Update Profile with Mock API
// ============================================
/*
'use client';
import { useState } from 'react';
import { useMockMyProfile, useMockUpdateMyProfile } from '@/features/profile/mocks';

export default function EditMockProfileComponent() {
  const { data: profile } = useMockMyProfile();
  const updateProfile = useMockUpdateMyProfile();
  const [bio, setBio] = useState('');

  const handleUpdate = async () => {
    try {
      await updateProfile.mutateAsync({ bio });
      alert('Profile updated successfully!');
    } catch (error) {
      alert(`Failed to update: ${error.message}`);
    }
  };

  return (
    <div className="p-4">
      <h2>Edit Profile (Mock)</h2>
      <textarea
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        placeholder={profile?.data.bio || 'Enter your bio...'}
        className="w-full p-2 border rounded"
      />
      <button 
        onClick={handleUpdate}
        disabled={updateProfile.isPending}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
      >
        {updateProfile.isPending ? 'Updating...' : 'Update Profile'}
      </button>
    </div>
  );
}
*/

// ============================================
// Example 3: View Another User's Profile (Mock)
// ============================================
/*
'use client';
import { useMockProfileByUsername } from '@/features/profile/mocks';

export default function UserProfilePage({ username }: { username: string }) {
  const { data, isLoading, error } = useMockProfileByUsername(username);

  if (isLoading) return <div>Loading user profile...</div>;
  if (error) return <div>User not found</div>;

  return (
    <div className="p-4">
      <div className="relative">
        {data?.data.banner_image_url && (
          <img 
            src={data.data.banner_image_url} 
            alt="Banner" 
            className="w-full h-48 object-cover"
          />
        )}
        <img 
          src={data?.data.profile_image_url || '/default-avatar.png'} 
          alt="Profile"
          className="w-24 h-24 rounded-full border-4 border-white -mt-12 ml-4"
        />
      </div>
      <div className="mt-4">
        <h1 className="text-2xl font-bold">{data?.data.name}</h1>
        <p className="text-gray-600">@{data?.data.User.username}</p>
        <p className="mt-2">{data?.data.bio}</p>
        {data?.data.location && (
          <p className="text-gray-600 mt-2">📍 {data.data.location}</p>
        )}
        {data?.data.website && (
          <a href={data.data.website} className="text-blue-500 mt-2">
            🔗 {data.data.website}
          </a>
        )}
      </div>
    </div>
  );
}
*/

// ============================================
// Example 4: Search Users with Mock API
// ============================================
/*
'use client';
import { useState } from 'react';
import { useMockSearchProfiles } from '@/features/profile/mocks';

export default function SearchUsersComponent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const limit = 5;

  const { data, isLoading, error } = useMockSearchProfiles(
    { query: searchQuery, page, limit },
    searchQuery.length > 0
  );

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Search Users (Mock)</h2>
      
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setPage(1); // Reset to first page on new search
        }}
        placeholder="Search users by name or username..."
        className="w-full p-2 border rounded mb-4"
      />

      {isLoading && <div>Searching...</div>}
      {error && <div className="text-red-500">Error: {error.message}</div>}

      {data && (
        <>
          <div className="space-y-4">
            {data.data.map((profile) => (
              <div key={profile.id} className="flex items-center gap-4 p-3 border rounded">
                <img 
                  src={profile.profile_image_url || '/default-avatar.png'} 
                  alt={profile.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="font-semibold">{profile.name}</h3>
                  <p className="text-gray-600">@{profile.User.username}</p>
                  {profile.bio && (
                    <p className="text-sm text-gray-700 mt-1">{profile.bio}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {data.metadata.totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-6">
              <button 
                onClick={() => setPage(p => p - 1)} 
                disabled={page === 1}
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
              >
                Previous
              </button>
              <span>
                Page {page} of {data.metadata.totalPages} 
                ({data.metadata.total} total results)
              </span>
              <button 
                onClick={() => setPage(p => p + 1)}
                disabled={page === data.metadata.totalPages}
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
*/

// ============================================
// Example 5: Using Mock Data Directly in Tests
// ============================================
/*
import { 
  mockCurrentUserProfile, 
  mockUserProfiles,
  getMockProfileByUsername,
  searchMockProfiles 
} from '@/features/profile/mocks';

describe('Profile Component Tests', () => {
  it('should display user name', () => {
    const profile = mockCurrentUserProfile;
    expect(profile.name).toBe('John Doe');
  });

  it('should find user by username', () => {
    const profile = getMockProfileByUsername('jane_smith');
    expect(profile?.name).toBe('Jane Smith');
  });

  it('should search profiles', () => {
    const results = searchMockProfiles('john');
    expect(results.length).toBeGreaterThan(0);
  });

  it('should have multiple mock profiles', () => {
    expect(mockUserProfiles.length).toBeGreaterThan(0);
  });
});
*/

// ============================================
// Example 6: All Mock Profiles List
// ============================================
/*
'use client';
import { useMockAllProfiles } from '@/features/profile/mocks';

export default function AllUsersComponent() {
  const { data, isLoading, error } = useMockAllProfiles();

  if (isLoading) return <div>Loading all users...</div>;
  if (error) return <div>Error loading users</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">
        All Mock Users ({data?.metadata.total})
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.data.map((profile) => (
          <div key={profile.id} className="border rounded p-4">
            <img 
              src={profile.profile_image_url || '/default-avatar.png'} 
              alt={profile.name}
              className="w-16 h-16 rounded-full mx-auto"
            />
            <h3 className="text-center font-semibold mt-2">{profile.name}</h3>
            <p className="text-center text-gray-600">@{profile.User.username}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
*/

// ============================================
// Example 7: Error Handling with Mock API
// ============================================
/*
'use client';
import { mockProfileApiWithErrors } from '@/features/profile/mocks';
import { useState } from 'react';

export default function ErrorTestingComponent() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const testUnauthorized = async () => {
    setLoading(true);
    setError(null);
    try {
      await mockProfileApiWithErrors.getMyProfileUnauthorized();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const testNotFound = async () => {
    setLoading(true);
    setError(null);
    try {
      await mockProfileApiWithErrors.getProfileNotFound();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const testValidationError = async () => {
    setLoading(true);
    setError(null);
    try {
      await mockProfileApiWithErrors.updateProfileValidationError();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Test Error Scenarios</h2>
      
      <div className="space-x-2 mb-4">
        <button 
          onClick={testUnauthorized}
          disabled={loading}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Test 401 Unauthorized
        </button>
        <button 
          onClick={testNotFound}
          disabled={loading}
          className="px-4 py-2 bg-orange-500 text-white rounded"
        >
          Test 404 Not Found
        </button>
        <button 
          onClick={testValidationError}
          disabled={loading}
          className="px-4 py-2 bg-yellow-500 text-white rounded"
        >
          Test 400 Validation
        </button>
      </div>

      {loading && <div>Testing...</div>}
      {error && (
        <div className="p-4 bg-red-100 border border-red-400 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
}
*/

// ============================================
// Example 8: Switching Between Mock and Real API
// ============================================
/*
// hooks/useProfile.ts
import { useMockMyProfile } from '@/features/profile/mocks';
import { useMyProfile as useRealProfile } from '@/features/profile/hooks';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true';

export const useMyProfile = USE_MOCK ? useMockMyProfile : useRealProfile;

// Now in your components:
import { useMyProfile } from '@/hooks/useProfile';

export default function ProfileComponent() {
  const { data, isLoading } = useMyProfile(); // Works with both mock and real!
  
  return <div>{data?.data.name}</div>;
}
*/

export {};
