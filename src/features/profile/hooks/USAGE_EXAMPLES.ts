/**
 * Profile Hooks Usage Examples
 *
 * This file demonstrates how to use the profile hooks in your components
 */

// ============================================
// Example 1: Get Current User's Profile
// ============================================
/*
import { useMyProfile } from '@/features/profile/hooks';

function MyProfileComponent() {
  const { data, isLoading, error, refetch } = useMyProfile();

  if (isLoading) return <div>Loading profile...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>{data?.data.name}</h1>
      <p>{data?.data.bio}</p>
      <button onClick={() => refetch()}>Refresh Profile</button>
    </div>
  );
}
*/

// ============================================
// Example 2: Update Current User's Profile
// ============================================
/*
import { useUpdateMyProfile } from '@/features/profile/hooks';

function EditProfileComponent() {
  const updateProfile = useUpdateMyProfile();

  const handleUpdate = async () => {
    try {
      await updateProfile.mutateAsync({
        name: 'John Doe',
        bio: 'Software Developer',
        location: 'San Francisco, CA',
      });
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile');
    }
  };

  return (
    <button 
      onClick={handleUpdate}
      disabled={updateProfile.isPending}
    >
      {updateProfile.isPending ? 'Updating...' : 'Update Profile'}
    </button>
  );
}
*/

// ============================================
// Example 3: Get Profile by Username
// ============================================
/*
import { useProfileByUsername } from '@/features/profile/hooks';

function UserProfilePage({ username }: { username: string }) {
  const { data, isLoading, error } = useProfileByUsername(username);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>User not found</div>;

  return (
    <div>
      <h1>{data?.data.name}</h1>
      <p>@{data?.data.User.username}</p>
      <p>{data?.data.bio}</p>
    </div>
  );
}
*/

// ============================================
// Example 4: Get Profile by User ID
// ============================================
/*
import { useProfileByUserId } from '@/features/profile/hooks';

function UserCardComponent({ userId }: { userId: number }) {
  const { data, isLoading } = useProfileByUserId(userId);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <img src={data?.data.profile_image_url || '/default-avatar.png'} />
      <h3>{data?.data.name}</h3>
      <p>@{data?.data.User.username}</p>
    </div>
  );
}
*/

// ============================================
// Example 5: Search Profiles
// ============================================
/*
import { useState } from 'react';
import { useSearchProfiles } from '@/features/profile/hooks';

function SearchComponent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useSearchProfiles(
    {
      query: searchQuery,
      page,
      limit: 10,
    },
    searchQuery.length > 0 // Only enable when there's a query
  );

  return (
    <div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search users..."
      />

      {isLoading && <div>Searching...</div>}
      {error && <div>Error: {error.message}</div>}

      {data?.data.map((profile) => (
        <div key={profile.id}>
          <h3>{profile.name}</h3>
          <p>@{profile.User.username}</p>
        </div>
      ))}

      {data && (
        <div>
          <button 
            onClick={() => setPage(p => p - 1)} 
            disabled={page === 1}
          >
            Previous
          </button>
          <span>Page {page} of {data.metadata.totalPages}</span>
          <button 
            onClick={() => setPage(p => p + 1)}
            disabled={page === data.metadata.totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
*/

// ============================================
// Example 6: Using Zustand Store Directly
// ============================================
/*
import { useProfileStore } from '@/features/profile/store/profileStore';

function ProfileStatusComponent() {
  const { currentProfile, isLoading, error } = useProfileStore();

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {currentProfile && <p>Welcome, {currentProfile.name}!</p>}
    </div>
  );
}
*/

// ============================================
// Example 7: Combining Multiple Hooks
// ============================================
/*
import { useMyProfile, useUpdateMyProfile } from '@/features/profile/hooks';

function ProfilePageComponent() {
  const { data: profile, isLoading } = useMyProfile();
  const updateProfile = useUpdateMyProfile();

  const handleUpdateBio = async (newBio: string) => {
    try {
      await updateProfile.mutateAsync({ bio: newBio });
      // Profile will automatically be refetched
    } catch (error) {
      console.error('Failed to update bio:', error);
    }
  };

  if (isLoading) return <div>Loading profile...</div>;

  return (
    <div>
      <h1>{profile?.data.name}</h1>
      <p>{profile?.data.bio}</p>
      <button onClick={() => handleUpdateBio('New bio text')}>
        Update Bio
      </button>
    </div>
  );
}
*/

export {};
