import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useProfile } from '../useProfile';
import * as profileQueries from '../profileQueries';

// Mock the profile queries
vi.mock('../profileQueries', () => ({
  useUpdateMyProfile: vi.fn(),
  useUploadProfileImage: vi.fn(),
  useUploadBannerImage: vi.fn(),
  useRemoveProfileImage: vi.fn(),
  useRemoveBannerImage: vi.fn(),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = 'QueryClientProviderWrapper';
  return Wrapper;
};

describe('useProfile', () => {
  const mockUpdateMyProfile = {
    mutateAsync: vi.fn(),
    isPending: false,
    isError: false,
    isSuccess: false,
    error: null,
  };

  const mockUploadProfileImage = {
    mutateAsync: vi.fn(),
  };

  const mockUploadBannerImage = {
    mutateAsync: vi.fn(),
  };

  const mockRemoveProfileImage = {
    mutateAsync: vi.fn(),
  };

  const mockRemoveBannerImage = {
    mutateAsync: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(profileQueries.useUpdateMyProfile).mockReturnValue(
      mockUpdateMyProfile as any
    );
    vi.mocked(profileQueries.useUploadProfileImage).mockReturnValue(
      mockUploadProfileImage as any
    );
    vi.mocked(profileQueries.useUploadBannerImage).mockReturnValue(
      mockUploadBannerImage as any
    );
    vi.mocked(profileQueries.useRemoveProfileImage).mockReturnValue(
      mockRemoveProfileImage as any
    );
    vi.mocked(profileQueries.useRemoveBannerImage).mockReturnValue(
      mockRemoveBannerImage as any
    );

    mockUpdateMyProfile.mutateAsync.mockResolvedValue({});
    mockUploadProfileImage.mutateAsync.mockResolvedValue({});
    mockUploadBannerImage.mutateAsync.mockResolvedValue({});
    mockRemoveProfileImage.mutateAsync.mockResolvedValue({});
    mockRemoveBannerImage.mutateAsync.mockResolvedValue({});
  });

  describe('Hook Initialization', () => {
    it('should return handleSaveProfile function', () => {
      const { result } = renderHook(() => useProfile(), {
        wrapper: createWrapper(),
      });

      expect(result.current.handleSaveProfile).toBeDefined();
      expect(typeof result.current.handleSaveProfile).toBe('function');
    });

    it('should return isUpdating status', () => {
      const { result } = renderHook(() => useProfile(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isUpdating).toBe(false);
    });

    it('should return isError status', () => {
      const { result } = renderHook(() => useProfile(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isError).toBe(false);
    });

    it('should return isSuccess status', () => {
      const { result } = renderHook(() => useProfile(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isSuccess).toBe(false);
    });
  });

  describe('Profile Update', () => {
    it('should update profile with text fields only', async () => {
      const { result } = renderHook(() => useProfile(), {
        wrapper: createWrapper(),
      });

      const updateData = {
        name: 'John Doe',
        bio: 'Developer',
        location: 'New York',
        website: 'https://example.com',
        birthDate: '1990-01-01T00:00:00.000Z',
      };

      await result.current.handleSaveProfile(updateData);

      await waitFor(() => {
        expect(mockUpdateMyProfile.mutateAsync).toHaveBeenCalledWith({
          name: 'John Doe',
          bio: 'Developer',
          location: 'New York',
          website: 'https://example.com',
          birth_date: '1990-01-01T00:00:00.000Z',
        });
      });
    });

    it('should filter out undefined values', async () => {
      const { result } = renderHook(() => useProfile(), {
        wrapper: createWrapper(),
      });

      const updateData = {
        name: 'John Doe',
        bio: undefined,
        location: undefined,
        website: undefined,
        birthDate: undefined,
      };

      await result.current.handleSaveProfile(updateData);

      await waitFor(() => {
        expect(mockUpdateMyProfile.mutateAsync).toHaveBeenCalledWith({
          name: 'John Doe',
        });
      });
    });

    it('should not call updateMyProfile if all fields are undefined', async () => {
      const { result } = renderHook(() => useProfile(), {
        wrapper: createWrapper(),
      });

      const updateData = {
        name: undefined,
        bio: undefined,
        location: undefined,
        website: undefined,
        birthDate: undefined,
      };

      await result.current.handleSaveProfile(updateData);

      expect(mockUpdateMyProfile.mutateAsync).not.toHaveBeenCalled();
    });
  });

  describe('Profile Image Upload', () => {
    it('should upload profile image when File is provided', async () => {
      const { result } = renderHook(() => useProfile(), {
        wrapper: createWrapper(),
      });

      const mockFile = new File([''], 'profile.jpg', { type: 'image/jpeg' });

      await result.current.handleSaveProfile({
        profileImage: mockFile,
      });

      await waitFor(() => {
        expect(mockUploadProfileImage.mutateAsync).toHaveBeenCalledWith(
          mockFile
        );
      });
    });

    it('should remove profile image when null is provided', async () => {
      const { result } = renderHook(() => useProfile(), {
        wrapper: createWrapper(),
      });

      await result.current.handleSaveProfile({
        profileImage: null,
      });

      await waitFor(() => {
        expect(mockRemoveProfileImage.mutateAsync).toHaveBeenCalled();
      });
    });

    it('should not modify profile image when undefined', async () => {
      const { result } = renderHook(() => useProfile(), {
        wrapper: createWrapper(),
      });

      await result.current.handleSaveProfile({
        profileImage: undefined,
      });

      expect(mockUploadProfileImage.mutateAsync).not.toHaveBeenCalled();
      expect(mockRemoveProfileImage.mutateAsync).not.toHaveBeenCalled();
    });
  });

  describe('Banner Image Upload', () => {
    it('should upload banner image when File is provided', async () => {
      const { result } = renderHook(() => useProfile(), {
        wrapper: createWrapper(),
      });

      const mockFile = new File([''], 'banner.jpg', { type: 'image/jpeg' });

      await result.current.handleSaveProfile({
        bannerImage: mockFile,
      });

      await waitFor(() => {
        expect(mockUploadBannerImage.mutateAsync).toHaveBeenCalledWith(
          mockFile
        );
      });
    });

    it('should remove banner image when null is provided', async () => {
      const { result } = renderHook(() => useProfile(), {
        wrapper: createWrapper(),
      });

      await result.current.handleSaveProfile({
        bannerImage: null,
      });

      await waitFor(() => {
        expect(mockRemoveBannerImage.mutateAsync).toHaveBeenCalled();
      });
    });

    it('should not modify banner image when undefined', async () => {
      const { result } = renderHook(() => useProfile(), {
        wrapper: createWrapper(),
      });

      await result.current.handleSaveProfile({
        bannerImage: undefined,
      });

      expect(mockUploadBannerImage.mutateAsync).not.toHaveBeenCalled();
      expect(mockRemoveBannerImage.mutateAsync).not.toHaveBeenCalled();
    });
  });

  describe('Combined Updates', () => {
    it('should handle profile update with both text fields and images', async () => {
      const { result } = renderHook(() => useProfile(), {
        wrapper: createWrapper(),
      });

      const mockProfileImage = new File([''], 'profile.jpg', {
        type: 'image/jpeg',
      });
      const mockBannerImage = new File([''], 'banner.jpg', {
        type: 'image/jpeg',
      });

      await result.current.handleSaveProfile({
        name: 'Jane Smith',
        bio: 'Designer',
        profileImage: mockProfileImage,
        bannerImage: mockBannerImage,
      });

      await waitFor(() => {
        expect(mockUploadProfileImage.mutateAsync).toHaveBeenCalledWith(
          mockProfileImage
        );
        expect(mockUploadBannerImage.mutateAsync).toHaveBeenCalledWith(
          mockBannerImage
        );
        expect(mockUpdateMyProfile.mutateAsync).toHaveBeenCalledWith({
          name: 'Jane Smith',
          bio: 'Designer',
        });
      });
    });

    it('should execute operations in correct order: profile image, banner image, then text fields', async () => {
      const { result } = renderHook(() => useProfile(), {
        wrapper: createWrapper(),
      });

      const callOrder: string[] = [];

      mockUploadProfileImage.mutateAsync.mockImplementation(async () => {
        callOrder.push('profileImage');
      });
      mockUploadBannerImage.mutateAsync.mockImplementation(async () => {
        callOrder.push('bannerImage');
      });
      mockUpdateMyProfile.mutateAsync.mockImplementation(async () => {
        callOrder.push('updateProfile');
      });

      const mockProfileImage = new File([''], 'profile.jpg');
      const mockBannerImage = new File([''], 'banner.jpg');

      await result.current.handleSaveProfile({
        name: 'Test User',
        profileImage: mockProfileImage,
        bannerImage: mockBannerImage,
      });

      await waitFor(() => {
        expect(callOrder).toEqual([
          'profileImage',
          'bannerImage',
          'updateProfile',
        ]);
      });
    });

    it('should handle image removal and text update together', async () => {
      const { result } = renderHook(() => useProfile(), {
        wrapper: createWrapper(),
      });

      await result.current.handleSaveProfile({
        name: 'Updated Name',
        profileImage: null,
        bannerImage: null,
      });

      await waitFor(() => {
        expect(mockRemoveProfileImage.mutateAsync).toHaveBeenCalled();
        expect(mockRemoveBannerImage.mutateAsync).toHaveBeenCalled();
        expect(mockUpdateMyProfile.mutateAsync).toHaveBeenCalledWith({
          name: 'Updated Name',
        });
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle profile update error', async () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      const error = new Error('Update failed');
      mockUpdateMyProfile.mutateAsync.mockRejectedValue(error);

      const { result } = renderHook(() => useProfile(), {
        wrapper: createWrapper(),
      });

      await result.current.handleSaveProfile({
        name: 'Test',
      });

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          'Failed to process profile update:',
          error
        );
      });

      consoleSpy.mockRestore();
    });

    it('should handle profile image upload error', async () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      const error = new Error('Upload failed');
      mockUploadProfileImage.mutateAsync.mockRejectedValue(error);

      const { result } = renderHook(() => useProfile(), {
        wrapper: createWrapper(),
      });

      const mockFile = new File([''], 'profile.jpg');

      await result.current.handleSaveProfile({
        profileImage: mockFile,
      });

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          'Failed to process profile update:',
          error
        );
      });

      consoleSpy.mockRestore();
    });

    it('should handle banner image removal error', async () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      const error = new Error('Remove failed');
      mockRemoveBannerImage.mutateAsync.mockRejectedValue(error);

      const { result } = renderHook(() => useProfile(), {
        wrapper: createWrapper(),
      });

      await result.current.handleSaveProfile({
        bannerImage: null,
      });

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          'Failed to process profile update:',
          error
        );
      });

      consoleSpy.mockRestore();
    });
  });

  describe('Loading States', () => {
    it('should reflect pending state from updateMyProfile', () => {
      mockUpdateMyProfile.isPending = true;

      const { result } = renderHook(() => useProfile(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isUpdating).toBe(true);
    });

    it('should reflect error state from updateMyProfile', () => {
      mockUpdateMyProfile.isError = true;

      const { result } = renderHook(() => useProfile(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isError).toBe(true);
    });

    it('should reflect success state from updateMyProfile', () => {
      mockUpdateMyProfile.isSuccess = true;

      const { result } = renderHook(() => useProfile(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isSuccess).toBe(true);
    });
  });
});
