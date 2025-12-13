import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { ReactNode } from 'react';
import {
  useMyProfile,
  useUpdateMyProfile,
  useUploadProfileImage,
  useUploadBannerImage,
  useRemoveProfileImage,
  useRemoveBannerImage,
  useProfileByUserId,
  useProfileByUsername,
  useSearchProfiles,
  useProfileMedia,
  useProfileFeed,
  PROFILE_QUERY_KEYS,
} from '../profileQueries';
import { profileApi } from '../../services/profileApi';
import { useAuthStore } from '@/features/authentication/store/authStore';

// Mock dependencies
const mockSetLoading = vi.fn();
const mockSetError = vi.fn();
const mockSetCurrentProfile = vi.fn();

vi.mock('../../services/profileApi');
vi.mock('@/features/authentication/store/authStore');
vi.mock('../../store/profileStore', () => ({
  useProfileStore: vi.fn(() => ({
    setLoading: mockSetLoading,
    setError: mockSetError,
    setCurrentProfile: mockSetCurrentProfile,
    currentProfile: null,
    isLoading: false,
    error: null,
  })),
  useSelectedTab: vi.fn(() => 'media'),
}));
vi.mock('@/app/[username]/ProfileProvider', () => ({
  useProfileContext: vi.fn(() => ({
    profile: {
      User: { id: 1, username: 'testuser' },
      user_id: 1,
      name: 'Test User',
    },
  })),
}));

const mockProfileResponse = {
  status: 'success',
  message: 'Profile fetched successfully',
  data: {
    id: 1,
    user_id: 1,
    name: 'Test User',
    bio: 'Test bio',
    profile_image_url: 'https://example.com/avatar.jpg',
    banner_image_url: 'https://example.com/banner.jpg',
    location: 'Test Location',
    website: 'https://test.com',
    birth_date: '1990-01-01',
    created_at: '2020-01-01',
    updated_at: '2023-01-01',
    followers_count: 100,
    following_count: 50,
    is_followed_by_me: false,
    is_following_me: false,
    is_deactivated: false,
    is_muted_by_me: false,
    is_blocked_by_me: false,
    is_been_blocked: false,
    User: {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      role: 'user',
      created_at: '2020-01-01',
    },
  },
};

const mockSearchResponse = {
  status: 'success',
  message: 'Profiles found',
  data: [mockProfileResponse.data],
  metadata: {
    total: 1,
    page: 1,
    limit: 10,
    totalPages: 1,
  },
};

const mockMediaResponse = {
  status: 'success',
  message: 'Media fetched successfully',
  data: [
    {
      id: 1,
      post_id: 1,
      user_id: 1,
      type: 'image',
      media_url: 'https://example.com/image1.jpg',
      created_at: '2023-01-01',
    },
  ],
};

const mockTimelineResponse = {
  status: 'success',
  message: 'Timeline fetched successfully',
  data: {
    posts: [
      {
        id: 1,
        isRepost: false,
        isQuote: false,
        userId: 1,
        username: 'testuser',
        displayName: 'Test User',
        verified: false,
        name: 'Test User',
        profileImage: 'https://example.com/avatar.jpg',
        avatar: 'https://example.com/avatar.jpg',
        postId: 1,
        content: 'Test post',
        text: 'Test post',
        createdAt: '2023-01-01',
        timestamp: '2023-01-01',
        date: '2023-01-01',
        likesCount: 0,
        repostsCount: 0,
        retweetsCount: 0,
        repliesCount: 0,
        commentsCount: 0,
        viewsCount: 0,
        bookmarksCount: 0,
        quotesCount: 0,
        media: [],
        mentions: [],
        isLikedByMe: false,
        isRepostedByMe: false,
        isBookmarkedByMe: false,
        isFollowedByMe: false,
        quotePostId: null,
        repostPostId: null,
      },
    ],
  },
};

describe('profileQueries', () => {
  let queryClient: QueryClient;

  const createWrapper = () => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          throwOnError: true,
        },
        mutations: {
          retry: false,
        },
      },
    });

    const Wrapper = ({ children }: { children: ReactNode }) =>
      React.createElement(
        QueryClientProvider,
        { client: queryClient },
        children
      );
    Wrapper.displayName = 'QueryClientWrapper';
    return Wrapper;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockSetLoading.mockClear();
    mockSetError.mockClear();
    mockSetCurrentProfile.mockClear();
    vi.mocked(useAuthStore).mockImplementation((selector: any) => {
      const state = {
        user: {
          id: 1,
          profile: { profileImageUrl: 'https://example.com/avatar.jpg' },
        },
        setUser: vi.fn(),
      };
      return selector ? selector(state) : state;
    });
  });

  describe('useMyProfile', () => {
    it('should fetch current user profile successfully', async () => {
      vi.mocked(profileApi.getMyProfile).mockResolvedValue(mockProfileResponse);

      const { result } = renderHook(() => useMyProfile(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockProfileResponse);
      expect(profileApi.getMyProfile).toHaveBeenCalled();
    });

    it('should handle error when fetching profile fails', async () => {
      const error = new Error('Failed to fetch profile');
      vi.mocked(profileApi.getMyProfile).mockRejectedValue(error);

      renderHook(() => useMyProfile(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(mockSetError).toHaveBeenCalled());

      expect(mockSetError).toHaveBeenCalledWith('Failed to fetch profile');
    });
  });

  describe('useUpdateMyProfile', () => {
    it('should call update API when mutate is called', async () => {
      vi.mocked(profileApi.updateMyProfile).mockResolvedValue(
        mockProfileResponse
      );

      const { result } = renderHook(() => useUpdateMyProfile(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ name: 'Updated Name' });

      await waitFor(() =>
        expect(profileApi.updateMyProfile).toHaveBeenCalled()
      );

      expect(profileApi.updateMyProfile).toHaveBeenCalledWith({
        name: 'Updated Name',
      });
    });

    it('should handle update error', async () => {
      const error = new Error('Failed to update profile');
      vi.mocked(profileApi.updateMyProfile).mockRejectedValue(error);

      const { result } = renderHook(() => useUpdateMyProfile(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ name: 'Updated Name' });

      await waitFor(() => expect(mockSetError).toHaveBeenCalled());

      expect(mockSetError).toHaveBeenCalledWith('Failed to update profile');
    });
  });

  describe('useUploadProfileImage', () => {
    it('should call upload API when mutate is called', async () => {
      vi.mocked(profileApi.uploadProfileImage).mockResolvedValue(
        mockProfileResponse
      );

      const { result } = renderHook(() => useUploadProfileImage(), {
        wrapper: createWrapper(),
      });

      const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
      result.current.mutate(file);

      await waitFor(() =>
        expect(profileApi.uploadProfileImage).toHaveBeenCalled()
      );

      expect(profileApi.uploadProfileImage).toHaveBeenCalledWith(file);
    });

    it('should handle upload error', async () => {
      const error = new Error('Failed to upload image');
      vi.mocked(profileApi.uploadProfileImage).mockRejectedValue(error);

      const { result } = renderHook(() => useUploadProfileImage(), {
        wrapper: createWrapper(),
      });

      const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
      result.current.mutate(file);

      await waitFor(() => expect(mockSetError).toHaveBeenCalled());

      expect(mockSetError).toHaveBeenCalledWith('Failed to upload image');
    });
  });

  describe('useUploadBannerImage', () => {
    it('should upload banner image successfully', async () => {
      vi.mocked(profileApi.uploadBannerImage).mockResolvedValue(
        mockProfileResponse
      );

      const { result } = renderHook(() => useUploadBannerImage(), {
        wrapper: createWrapper(),
      });

      const file = new File([''], 'banner.jpg', { type: 'image/jpeg' });
      result.current.mutate(file);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(profileApi.uploadBannerImage).toHaveBeenCalledWith(file);
    });

    it('should invalidate queries after successful upload', async () => {
      vi.mocked(profileApi.uploadBannerImage).mockResolvedValue(
        mockProfileResponse
      );

      const wrapper = createWrapper();
      const { result } = renderHook(() => useUploadBannerImage(), { wrapper });

      const file = new File([''], 'banner.jpg', { type: 'image/jpeg' });
      result.current.mutate(file);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
    });

    it('should handle upload error', async () => {
      const error = new Error('Failed to upload image');
      vi.mocked(profileApi.uploadBannerImage).mockRejectedValue(error);

      const { result } = renderHook(() => useUploadBannerImage(), {
        wrapper: createWrapper(),
      });

      const file = new File([''], 'banner.jpg', { type: 'image/jpeg' });
      result.current.mutate(file);

      await waitFor(() => expect(mockSetError).toHaveBeenCalled());

      expect(mockSetError).toHaveBeenCalledWith('Failed to upload image');
    });
  });

  describe('useRemoveProfileImage', () => {
    it('should call remove API when mutate is called', async () => {
      vi.mocked(profileApi.removeProfileImage).mockResolvedValue(
        mockProfileResponse
      );

      const { result } = renderHook(() => useRemoveProfileImage(), {
        wrapper: createWrapper(),
      });

      result.current.mutate();

      await waitFor(() =>
        expect(profileApi.removeProfileImage).toHaveBeenCalled()
      );
    });

    it('should update auth store with null profile image on success', async () => {
      const mockSetUser = vi.fn();
      vi.mocked(profileApi.removeProfileImage).mockResolvedValue(
        mockProfileResponse
      );

      const getStateMock = vi.fn(() => ({
        user: {
          id: 1,
          profile: { profileImageUrl: 'https://example.com/old-avatar.jpg' },
        },
        setUser: mockSetUser,
      }));

      (useAuthStore as any).getState = getStateMock;

      const wrapper = createWrapper();

      // Pre-populate query cache with auth user data
      queryClient.setQueryData(['auth', 'user'], {
        id: 1,
        profile: { profileImageUrl: 'https://example.com/old-avatar.jpg' },
      });

      const { result } = renderHook(() => useRemoveProfileImage(), { wrapper });

      result.current.mutate();

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(profileApi.removeProfileImage).toHaveBeenCalled();
      expect(mockSetUser).toHaveBeenCalledWith({
        id: 1,
        profile: { profileImageUrl: null },
      });

      // Verify query cache was updated
      const updatedUserData = queryClient.getQueryData(['auth', 'user']);
      expect(updatedUserData).toEqual({
        id: 1,
        profile: { profileImageUrl: null },
      });
    });

    it('should handle remove error', async () => {
      const error = new Error('Failed to remove image');
      vi.mocked(profileApi.removeProfileImage).mockRejectedValue(error);

      const { result } = renderHook(() => useRemoveProfileImage(), {
        wrapper: createWrapper(),
      });

      result.current.mutate();

      await waitFor(() => expect(mockSetError).toHaveBeenCalled());

      expect(mockSetError).toHaveBeenCalledWith('Failed to remove image');
    });
  });

  describe('useRemoveBannerImage', () => {
    it('should remove banner image successfully', async () => {
      vi.mocked(profileApi.removeBannerImage).mockResolvedValue(
        mockProfileResponse
      );

      const { result } = renderHook(() => useRemoveBannerImage(), {
        wrapper: createWrapper(),
      });

      result.current.mutate();

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(profileApi.removeBannerImage).toHaveBeenCalled();
    });

    it('should handle remove error', async () => {
      const error = new Error('Failed to remove image');
      vi.mocked(profileApi.removeBannerImage).mockRejectedValue(error);

      const { result } = renderHook(() => useRemoveBannerImage(), {
        wrapper: createWrapper(),
      });

      result.current.mutate();

      await waitFor(() => expect(mockSetError).toHaveBeenCalled());

      expect(mockSetError).toHaveBeenCalledWith('Failed to remove image');
    });
  });

  describe('useProfileByUserId', () => {
    it('should fetch profile by user ID successfully', async () => {
      vi.mocked(profileApi.getProfileByUserId).mockResolvedValue(
        mockProfileResponse
      );

      const { result } = renderHook(() => useProfileByUserId(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockProfileResponse);
      expect(profileApi.getProfileByUserId).toHaveBeenCalledWith(1);
    });

    it('should not fetch when enabled is false', async () => {
      vi.mocked(profileApi.getProfileByUserId).mockResolvedValue(
        mockProfileResponse
      );

      const { result } = renderHook(() => useProfileByUserId(1, false), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isFetching).toBe(false));

      expect(profileApi.getProfileByUserId).not.toHaveBeenCalled();
    });

    it('should not fetch when userId is 0 or negative', async () => {
      renderHook(() => useProfileByUserId(0), {
        wrapper: createWrapper(),
      });

      await waitFor(() =>
        expect(profileApi.getProfileByUserId).not.toHaveBeenCalled()
      );
    });

    it('should handle fetch error', async () => {
      const error = new Error('Failed to fetch profile');
      vi.mocked(profileApi.getProfileByUserId).mockRejectedValue(error);

      renderHook(() => useProfileByUserId(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(mockSetError).toHaveBeenCalled());

      expect(mockSetError).toHaveBeenCalledWith('Failed to fetch profile');
    });
  });

  describe('useProfileByUsername', () => {
    it('should fetch profile by username successfully', async () => {
      vi.mocked(profileApi.getProfileByUsername).mockResolvedValue(
        mockProfileResponse
      );

      const { result } = renderHook(() => useProfileByUsername('testuser'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockProfileResponse);
      expect(profileApi.getProfileByUsername).toHaveBeenCalledWith('testuser');
    });

    it('should not fetch when enabled is false', async () => {
      const { result } = renderHook(
        () => useProfileByUsername('testuser', false),
        {
          wrapper: createWrapper(),
        }
      );

      await waitFor(() => expect(result.current.isFetching).toBe(false));

      expect(profileApi.getProfileByUsername).not.toHaveBeenCalled();
    });

    it('should not fetch when username is empty', async () => {
      const { result } = renderHook(() => useProfileByUsername(''), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isFetching).toBe(false));

      expect(profileApi.getProfileByUsername).not.toHaveBeenCalled();
    });

    it('should handle fetch error', async () => {
      const error = new Error('Failed to fetch profile');
      vi.mocked(profileApi.getProfileByUsername).mockRejectedValue(error);

      renderHook(() => useProfileByUsername('testuser'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(mockSetError).toHaveBeenCalled());

      expect(mockSetError).toHaveBeenCalledWith('Failed to fetch profile');
    });
  });

  describe('useSearchProfiles', () => {
    it('should search profiles successfully', async () => {
      vi.mocked(profileApi.searchProfiles).mockResolvedValue(
        mockSearchResponse
      );

      const { result } = renderHook(
        () => useSearchProfiles({ query: 'test', page: 1, limit: 10 }),
        {
          wrapper: createWrapper(),
        }
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockSearchResponse);
      expect(profileApi.searchProfiles).toHaveBeenCalledWith({
        query: 'test',
        page: 1,
        limit: 10,
      });
    });

    it('should not search when enabled is false', async () => {
      const { result } = renderHook(
        () => useSearchProfiles({ query: 'test', page: 1, limit: 10 }, false),
        {
          wrapper: createWrapper(),
        }
      );

      await waitFor(() => expect(result.current.isFetching).toBe(false));

      expect(profileApi.searchProfiles).not.toHaveBeenCalled();
    });

    it('should not search when query is empty', async () => {
      const { result } = renderHook(
        () => useSearchProfiles({ query: '', page: 1, limit: 10 }),
        {
          wrapper: createWrapper(),
        }
      );

      await waitFor(() => expect(result.current.isFetching).toBe(false));

      expect(profileApi.searchProfiles).not.toHaveBeenCalled();
    });

    it('should handle search error', async () => {
      const error = new Error('Failed to search profiles');
      vi.mocked(profileApi.searchProfiles).mockRejectedValue(error);

      renderHook(
        () => useSearchProfiles({ query: 'test', page: 1, limit: 10 }),
        {
          wrapper: createWrapper(),
        }
      );

      await waitFor(() => expect(mockSetError).toHaveBeenCalled());

      expect(mockSetError).toHaveBeenCalledWith('Failed to search profiles');
    });
  });

  describe('useProfileMedia', () => {
    it('should fetch profile media successfully', async () => {
      vi.mocked(profileApi.getProfileMediaFeed).mockResolvedValue(
        mockMediaResponse
      );

      const { result } = renderHook(() => useProfileMedia(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toBeDefined();
      expect(profileApi.getProfileMediaFeed).toHaveBeenCalled();
    });

    it('should handle getNextPageParam correctly when there is more data', async () => {
      vi.mocked(profileApi.getProfileMediaFeed).mockResolvedValue(
        mockMediaResponse
      );

      const { result } = renderHook(() => useProfileMedia(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // With only 1 item returned and no explicit indication of more pages,
      // hasNextPage should be true (it starts as true for infinite queries)
      expect(result.current.hasNextPage).toBe(true);
    });
  });

  describe('useProfileFeed', () => {
    it('should call posts API when tab is POSTS_TAB', async () => {
      const { useSelectedTab } = await import('../../store/profileStore');
      vi.mocked(useSelectedTab).mockReturnValue('posts');
      vi.mocked(profileApi.getProfilePostsFeed).mockResolvedValue(
        mockTimelineResponse
      );
      vi.mocked(profileApi.getProfileMentionsFeed).mockResolvedValue(
        mockTimelineResponse
      );
      vi.mocked(profileApi.getProfileLikesFeed).mockResolvedValue(
        mockTimelineResponse
      );
      vi.mocked(profileApi.getProfileRepliesFeed).mockResolvedValue(
        mockTimelineResponse
      );

      renderHook(() => useProfileFeed(), {
        wrapper: createWrapper(),
      });

      await waitFor(() =>
        expect(profileApi.getProfilePostsFeed).toHaveBeenCalled()
      );
    });
    it('should call replies API when tab is REPLIES_TAB', async () => {
      const { useSelectedTab } = await import('../../store/profileStore');
      vi.mocked(useSelectedTab).mockReturnValue('replies');
      vi.mocked(profileApi.getProfileRepliesFeed).mockResolvedValue(
        mockTimelineResponse
      );
      vi.mocked(profileApi.getProfileMentionsFeed).mockResolvedValue(
        mockTimelineResponse
      );
      vi.mocked(profileApi.getProfileLikesFeed).mockResolvedValue(
        mockTimelineResponse
      );
      vi.mocked(profileApi.getProfilePostsFeed).mockResolvedValue(
        mockTimelineResponse
      );

      renderHook(() => useProfileFeed(), {
        wrapper: createWrapper(),
      });

      await waitFor(() =>
        expect(profileApi.getProfileRepliesFeed).toHaveBeenCalled()
      );
    });
    it('should call likes API when tab is LIKES_TAB', async () => {
      const { useSelectedTab } = await import('../../store/profileStore');
      vi.mocked(useSelectedTab).mockReturnValue('likes');
      vi.mocked(useAuthStore).mockImplementation((selector: any) => {
        const state = {
          user: {
            id: 1,
            profile: { profileImageUrl: 'https://example.com/avatar.jpg' },
          },
          setUser: vi.fn(),
        };
        return selector ? selector(state) : state;
      });
      vi.mocked(profileApi.getProfileLikesFeed).mockResolvedValue(
        mockTimelineResponse
      );
      vi.mocked(profileApi.getProfileMentionsFeed).mockResolvedValue(
        mockTimelineResponse
      );
      vi.mocked(profileApi.getProfilePostsFeed).mockResolvedValue(
        mockTimelineResponse
      );
      vi.mocked(profileApi.getProfileRepliesFeed).mockResolvedValue(
        mockTimelineResponse
      );

      renderHook(() => useProfileFeed(), {
        wrapper: createWrapper(),
      });

      await waitFor(() =>
        expect(profileApi.getProfileLikesFeed).toHaveBeenCalled()
      );
    });
    it('should call mentions API when tab is MENTIONS_TAB', async () => {
      const { useSelectedTab } = await import('../../store/profileStore');
      vi.mocked(useSelectedTab).mockReturnValue('mentions');
      vi.mocked(profileApi.getProfileMentionsFeed).mockResolvedValue(
        mockTimelineResponse
      );
      vi.mocked(profileApi.getProfileLikesFeed).mockResolvedValue(
        mockTimelineResponse
      );
      vi.mocked(profileApi.getProfilePostsFeed).mockResolvedValue(
        mockTimelineResponse
      );
      vi.mocked(profileApi.getProfileRepliesFeed).mockResolvedValue(
        mockTimelineResponse
      );

      renderHook(() => useProfileFeed(), {
        wrapper: createWrapper(),
      });

      await waitFor(() =>
        expect(profileApi.getProfileMentionsFeed).toHaveBeenCalled()
      );
    });
    it('should call posts API by default for unknown tab', async () => {
      const { useSelectedTab } = await import('../../store/profileStore');
      vi.mocked(useSelectedTab).mockReturnValue('unknown' as any);
      vi.mocked(profileApi.getProfilePostsFeed).mockResolvedValue(
        mockTimelineResponse
      );
      vi.mocked(profileApi.getProfileMentionsFeed).mockResolvedValue(
        mockTimelineResponse
      );
      vi.mocked(profileApi.getProfileLikesFeed).mockResolvedValue(
        mockTimelineResponse
      );
      vi.mocked(profileApi.getProfileRepliesFeed).mockResolvedValue(
        mockTimelineResponse
      );

      renderHook(() => useProfileFeed(), {
        wrapper: createWrapper(),
      });

      await waitFor(() =>
        expect(profileApi.getProfilePostsFeed).toHaveBeenCalled()
      );
    });
    it('should throw error when profile User.id is missing', async () => {
      const { useProfileContext } =
        await import('@/app/[username]/ProfileProvider');
      vi.mocked(useProfileContext).mockReturnValue({
        profile: null as any,
        isLoading: false,
        error: null,
        username: '',
      });

      expect(() => {
        renderHook(() => useProfileFeed(), {
          wrapper: createWrapper(),
        });
      }).toThrow('Profile called without userId');
    });
  });

  describe('PROFILE_QUERY_KEYS', () => {
    it('should generate correct query keys', () => {
      expect(PROFILE_QUERY_KEYS.myProfile).toEqual(['profile', 'me']);
      expect(PROFILE_QUERY_KEYS.profileByUserId(123)).toEqual([
        'profile',
        'user',
        123,
      ]);
      expect(PROFILE_QUERY_KEYS.profileByUsername('testuser')).toEqual([
        'profile',
        'username',
        'testuser',
      ]);
      expect(
        PROFILE_QUERY_KEYS.searchProfiles({
          query: 'test',
          page: 1,
          limit: 10,
        })
      ).toEqual(['profile', 'search', { query: 'test', page: 1, limit: 10 }]);
      expect(PROFILE_QUERY_KEYS.profilePosts(1)).toEqual([
        'profile',
        'posts',
        1,
      ]);
      expect(PROFILE_QUERY_KEYS.profileReplies(1)).toEqual([
        'profile',
        'replies',
        1,
      ]);
      expect(PROFILE_QUERY_KEYS.profileLikes(1)).toEqual([
        'profile',
        'likes',
        1,
      ]);
      expect(PROFILE_QUERY_KEYS.profileMedia(1)).toEqual([
        'profile',
        'media',
        1,
      ]);
      expect(PROFILE_QUERY_KEYS.profileMentions(1)).toEqual([
        'profile',
        'mentions',
        1,
      ]);
    });
  });
});
