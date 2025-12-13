import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { profileApi } from '../services/profileApi';
import {
  UpdateProfileDto,
  SearchProfilesParams,
  ProfileResponseDto,
  ProfileSearchResponseDto,
  ProfileFeedDtoResponse,
  ProfileMediaFeedDtoResponse,
} from '../types/api';
import { useProfileStore, useSelectedTab } from '../store/profileStore';
import { useAuthStore } from '@/features/authentication/store/authStore';
import { PROFILE_ENDPOINTS } from '../constants/api';
import {
  LIKES_TAB,
  MEDIA_TAB,
  MENTIONS_TAB,
  POSTS_TAB,
  REPLIES_TAB,
} from '../constants/tabs';
import { mockState } from '../mocks/mockState';
import { TimelineFeedDtoResponse } from '@/features/timeline/types/api';
import { useProfileContext } from '@/app/[username]/ProfileProvider';

// Query keys
export const PROFILE_QUERY_KEYS = {
  myProfile: ['profile', 'me'] as const,
  profileByUserId: (userId: number) => ['profile', 'user', userId] as const,
  profileByUsername: (username: string) =>
    ['profile', 'username', username] as const,
  searchProfiles: (params: SearchProfilesParams) =>
    ['profile', 'search', params] as const,
  profilePosts: (userId: number) => ['profile', 'posts', userId],
  profileReplies: (userId: number) => ['profile', 'replies', userId],
  profileLikes: (userId: number) => ['profile', 'likes', userId],
  profileMedia: (userId: number) => ['profile', 'media', userId],
  profileMentions: (userId: number) => ['profile', 'mentions', userId],
};

// Hook: Get current user's profile
export const useMyProfile = () => {
  const { setLoading, setError } = useProfileStore();

  return useQuery<ProfileResponseDto, Error>({
    queryKey: PROFILE_QUERY_KEYS.myProfile,
    queryFn: async () => {
      setLoading(true);
      try {
        const response = await profileApi.getMyProfile();
        setError(null);
        return response;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to fetch profile';
        setError(errorMessage);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

// Hook: Update current user's profile
export const useUpdateMyProfile = () => {
  const queryClient = useQueryClient();
  const { setCurrentProfile, setLoading, setError } = useProfileStore();

  return useMutation<ProfileResponseDto, Error, UpdateProfileDto>({
    mutationFn: async (profileData: UpdateProfileDto) => {
      setLoading(true);
      try {
        const response = await profileApi.updateMyProfile(profileData);
        setCurrentProfile(response.data);
        setError(null);
        return response;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to update profile';
        setError(errorMessage);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: (data) => {
      const profileImageUrl = data.data.profile_image_url;

      // Update auth store user with new profile image if it changed
      if (profileImageUrl !== undefined) {
        const currentUser = useAuthStore.getState().user;
        if (currentUser) {
          useAuthStore.getState().setUser({
            ...currentUser,
            profile: {
              ...currentUser.profile,
              profileImageUrl: profileImageUrl,
            },
          });
        }

        // Update auth store cache in React Query
        queryClient.setQueryData(['auth', 'user'], (oldUser: any) => {
          if (!oldUser) return oldUser;
          return {
            ...oldUser,
            profile: {
              ...oldUser.profile,
              profileImageUrl: profileImageUrl,
            },
          };
        });
      }

      // Invalidate profile queries to refetch
      queryClient.invalidateQueries({
        queryKey: ['profile'],
      });
    },
  });
};

// Hook: Upload profile image (multipart)
export const useUploadProfileImage = () => {
  const queryClient = useQueryClient();
  const { setLoading, setError } = useProfileStore();

  return useMutation<ProfileResponseDto, Error, File>({
    mutationFn: async (file: File) => {
      setLoading(true);
      try {
        const response = await profileApi.uploadProfileImage(file);
        setError(null);
        return response;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to upload image';
        setError(errorMessage);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: (data) => {
      const profileImageUrl = data.data.profile_image_url;

      // Update auth store user with new profile image
      const currentUser = useAuthStore.getState().user;
      if (currentUser) {
        useAuthStore.getState().setUser({
          ...currentUser,
          profile: {
            ...currentUser.profile,
            profileImageUrl: profileImageUrl,
          },
        });
      }

      // Update auth store cache in React Query
      queryClient.setQueryData(['auth', 'user'], (oldUser: any) => {
        if (!oldUser) return oldUser;
        return {
          ...oldUser,
          profile: {
            ...oldUser.profile,
            profileImageUrl: profileImageUrl,
          },
        };
      });

      // Invalidate profile queries to refetch
      queryClient.invalidateQueries({
        queryKey: ['profile'],
      });
    },
  });
};

// Hook: Upload banner image (multipart)
export const useUploadBannerImage = () => {
  const queryClient = useQueryClient();
  const { setLoading, setError } = useProfileStore();

  return useMutation<ProfileResponseDto, Error, File>({
    mutationFn: async (file: File) => {
      setLoading(true);
      try {
        const response = await profileApi.uploadBannerImage(file);
        setError(null);
        return response;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to upload image';
        setError(errorMessage);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: () => {
      // Invalidate profile queries to refetch
      queryClient.invalidateQueries({
        queryKey: ['profile'],
      });
    },
  });
};

// Hook: Remove profile image
export const useRemoveProfileImage = () => {
  const queryClient = useQueryClient();
  const { setLoading, setError } = useProfileStore();

  return useMutation<ProfileResponseDto, Error, void>({
    mutationFn: async () => {
      setLoading(true);
      try {
        const response = await profileApi.removeProfileImage();
        setError(null);
        return response;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to remove image';
        setError(errorMessage);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: () => {
      // Update auth store user with null profile image
      const currentUser = useAuthStore.getState().user;
      if (currentUser) {
        useAuthStore.getState().setUser({
          ...currentUser,
          profile: {
            ...currentUser.profile,
            profileImageUrl: null,
          },
        });
      }

      // Update auth store cache in React Query
      queryClient.setQueryData(['auth', 'user'], (oldUser: any) => {
        if (!oldUser) return oldUser;
        return {
          ...oldUser,
          profile: {
            ...oldUser.profile,
            profileImageUrl: null,
          },
        };
      });

      // Invalidate profile queries to refetch
      queryClient.invalidateQueries({
        queryKey: ['profile'],
      });
    },
  });
};

// Hook: Remove banner image
export const useRemoveBannerImage = () => {
  const queryClient = useQueryClient();
  const { setLoading, setError } = useProfileStore();

  return useMutation<ProfileResponseDto, Error, void>({
    mutationFn: async () => {
      setLoading(true);
      try {
        const response = await profileApi.removeBannerImage();
        setError(null);
        return response;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to remove image';
        setError(errorMessage);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['profile'],
      });
    },
  });
};

// Hook: Get profile by user ID
export const useProfileByUserId = (userId: number, enabled: boolean = true) => {
  const { setLoading, setError } = useProfileStore();

  return useQuery<ProfileResponseDto, Error>({
    queryKey: PROFILE_QUERY_KEYS.profileByUserId(userId),
    queryFn: async () => {
      setLoading(true);
      try {
        const response = await profileApi.getProfileByUserId(userId);
        setError(null);
        return response;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to fetch profile';
        setError(errorMessage);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    enabled: enabled && userId > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

// Hook: Get profile by username
export const useProfileByUsername = (
  username: string,
  enabled: boolean = true
) => {
  const { setLoading, setError } = useProfileStore();

  return useQuery<ProfileResponseDto, Error>({
    queryKey: PROFILE_QUERY_KEYS.profileByUsername(username),
    queryFn: async () => {
      setLoading(true);
      try {
        const response = await profileApi.getProfileByUsername(username);
        setError(null);
        return response;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to fetch profile';
        setError(errorMessage);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    enabled: enabled && username.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

// Hook: Search profiles
export const useSearchProfiles = (
  params: SearchProfilesParams,
  enabled: boolean = true
) => {
  const { setLoading, setError } = useProfileStore();

  return useQuery<ProfileSearchResponseDto, Error>({
    queryKey: PROFILE_QUERY_KEYS.searchProfiles(params),
    queryFn: async () => {
      setLoading(true);
      try {
        const response = await profileApi.searchProfiles(params);
        setError(null);
        return response;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to search profiles';
        setError(errorMessage);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    enabled: enabled && params.query.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 1,
  });
};

export const useProfileFeed = () => {
  const selectedTab = useSelectedTab();
  const { profile } = useProfileContext();

  const myProfile = useAuthStore((state) => state.user);
  const user = profile?.User.id === myProfile?.id ? 'me' : profile?.User.id;
  console.log(profile?.User.id);
  mockState.user = profile;
  const profilePosts = useProfilePosts();
  const profileMentionPosts = useProfileMention();
  const profileLikesPosts = useProfilelikes();
  const profileRepliesPosts = useProfileReplies();
  // let queryKey,
  //   queryEndPoint:
  //     | ReturnType<typeof PROFILE_ENDPOINTS.PROFILE_POSTS>
  //     | ReturnType<typeof PROFILE_ENDPOINTS.PROFILE_REPLIES>
  //     | ReturnType<typeof PROFILE_ENDPOINTS.PROFILE_LIKES>
  //     | ReturnType<typeof PROFILE_ENDPOINTS.PROFILE_MEDIA>;
  if (profile?.User.id && user) {
    switch (selectedTab) {
      case POSTS_TAB:
        return profilePosts;

      case REPLIES_TAB:
        return profileRepliesPosts;
      case LIKES_TAB:
        return profileLikesPosts;
      case MENTIONS_TAB:
        return profileMentionPosts;
      default:
        return profilePosts;
    }
    // if (selectedTab === POSTS_TAB) {
    //   queryKey = PROFILE_QUERY_KEYS.profilePosts(profile.User.id);
    //   queryEndPoint = PROFILE_ENDPOINTS.PROFILE_POSTS(user);
    // } else if (selectedTab === REPLIES_TAB) {
    //   queryKey = PROFILE_QUERY_KEYS.profileReplies(profile.User.id);
    //   queryEndPoint = PROFILE_ENDPOINTS.PROFILE_REPLIES(user);
    // } else if (selectedTab === LIKES_TAB) {
    //   queryKey = PROFILE_QUERY_KEYS.profileLikes(profile.User.id);
    //   queryEndPoint = PROFILE_ENDPOINTS.PROFILE_LIKES(user);
    // } else if (selectedTab === LIKES_TAB) {
    // } else {
    //   queryKey = PROFILE_QUERY_KEYS.profileMedia(profile.User.id);
    //   queryEndPoint = PROFILE_ENDPOINTS.PROFILE_MEDIA(user);
    // }
  } else {
    throw new Error('Profile called without userId');
  }
  // return useInfiniteQuery<
  //   ProfileFeedDtoResponse,
  //   Error,
  //   InfiniteData<ProfileFeedDtoResponse, number>,
  //   | ReturnType<typeof PROFILE_QUERY_KEYS.profilePosts>
  //   | ReturnType<typeof PROFILE_QUERY_KEYS.profileReplies>
  //   | ReturnType<typeof PROFILE_QUERY_KEYS.profileLikes>,
  //   number
  // >({
  //   queryKey: queryKey,
  //   queryFn: ({ pageParam }) =>
  //     profileApi.getProfileFeed(pageParam, queryEndPoint),
  //   initialPageParam: 1,
  //   getNextPageParam: (lastPage, pages) =>
  //     lastPage.data.length ? pages.length + 1 : undefined,
  // });
};

const useProfilePosts = () => {
  const selectedTab = useSelectedTab();
  const { profile } = useProfileContext();
  const myProfile = useAuthStore((state) => state.user);
  const user = profile?.User.id === myProfile?.id ? 'me' : profile?.User.id;
  if (!(profile?.User.id && user))
    throw new Error('Profile called without userId');
  const valid = selectedTab === POSTS_TAB;
  return useInfiniteQuery<
    TimelineFeedDtoResponse,
    Error,
    InfiniteData<TimelineFeedDtoResponse, number>,
    ReturnType<typeof PROFILE_QUERY_KEYS.profilePosts>,
    number
  >({
    // enabled: valid,
    queryKey: PROFILE_QUERY_KEYS.profilePosts(profile.User.id),
    queryFn: ({ pageParam }) =>
      profileApi.getProfilePostsFeed(pageParam, user, profile),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) =>
      lastPage.data.posts.length ? pages.length + 1 : undefined,
    // staleTime: 0,
  });
};

const useProfileMention = () => {
  const selectedTab = useSelectedTab();
  const { profile } = useProfileContext();
  const user = profile?.User.id;
  if (!user) throw new Error('Profile called without userId');
  const valid = selectedTab === MENTIONS_TAB;
  return useInfiniteQuery<
    TimelineFeedDtoResponse,
    Error,
    InfiniteData<TimelineFeedDtoResponse, number>,
    ReturnType<typeof PROFILE_QUERY_KEYS.profileMentions>,
    number
  >({
    // enabled: valid,
    queryKey: PROFILE_QUERY_KEYS.profileMentions(user),
    queryFn: ({ pageParam }) =>
      profileApi.getProfileMentionsFeed(pageParam, user),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) =>
      lastPage.data.posts.length ? pages.length + 1 : undefined,
    // staleTime: 0,
  });
};

const useProfilelikes = () => {
  const selectedTab = useSelectedTab();
  const myProfile = useAuthStore((state) => state.user);
  const user = myProfile?.id;
  if (!user) throw new Error('Profile called without userId');
  const valid = selectedTab === LIKES_TAB;
  return useInfiniteQuery<
    TimelineFeedDtoResponse,
    Error,
    InfiniteData<TimelineFeedDtoResponse, number>,
    ReturnType<typeof PROFILE_QUERY_KEYS.profileLikes>,
    number
  >({
    // enabled: valid,
    queryKey: PROFILE_QUERY_KEYS.profileLikes(user),
    queryFn: ({ pageParam }) => profileApi.getProfileLikesFeed(pageParam, user),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) =>
      lastPage.data.posts.length ? pages.length + 1 : undefined,
    // staleTime: 0,
  });
};

export const useProfileMedia = () => {
  const selectedTab = useSelectedTab();
  const { profile } = useProfileContext();

  const myProfile = useAuthStore((state) => state.user);
  const user = profile?.User.id === myProfile?.id ? 'me' : profile?.User.id;
  if (!(profile?.User.id && user))
    throw new Error('Profile called without userId');
  const valid = selectedTab === MEDIA_TAB;
  return useInfiniteQuery<
    ProfileMediaFeedDtoResponse,
    Error,
    InfiniteData<ProfileMediaFeedDtoResponse, number>,
    ReturnType<typeof PROFILE_QUERY_KEYS.profileMedia>,
    number
  >({
    // enabled: valid,
    queryKey: PROFILE_QUERY_KEYS.profileMedia(profile.User.id),
    queryFn: ({ pageParam }) => profileApi.getProfileMediaFeed(pageParam, user),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) =>
      lastPage.data.length ? pages.length + 1 : undefined,
    // staleTime: 0,
  });
};

const useProfileReplies = () => {
  const selectedTab = useSelectedTab();
  const { profile } = useProfileContext();
  const myProfile = useAuthStore((state) => state.user);
  const user = profile?.User.id === myProfile?.id ? 'me' : profile?.User.id;
  if (!(profile?.User.id && user))
    throw new Error('Profile called without userId');
  const valid = selectedTab === REPLIES_TAB;
  return useInfiniteQuery<
    TimelineFeedDtoResponse,
    Error,
    InfiniteData<TimelineFeedDtoResponse, number>,
    ReturnType<typeof PROFILE_QUERY_KEYS.profileReplies>,
    number
  >({
    // enabled: valid,
    queryKey: PROFILE_QUERY_KEYS.profileReplies(profile.User.id),
    queryFn: ({ pageParam }) =>
      profileApi.getProfileRepliesFeed(pageParam, user),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) =>
      lastPage.data.posts.length ? pages.length + 1 : undefined,
    // staleTime: 0,
  });
};
