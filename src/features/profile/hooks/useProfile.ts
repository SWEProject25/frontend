import { useUpdateMyProfile } from './profileQueries';
import type { ProfileResponseDto } from '../types/api';
import { convertFileToDataURL } from '@/utils';

export const useProfile = () => {
  const updateMyProfile = useUpdateMyProfile();

  const handleSaveProfile = async (data: {
    name: string;
    bio: string;
    profileImage?: File;
    bannerImage?: File;
  }) => {
    try {
      const profileImageUrl = data.profileImage
        ? await convertFileToDataURL(data.profileImage)
        : undefined;

      const bannerImageUrl = data.bannerImage
        ? await convertFileToDataURL(data.bannerImage)
        : undefined;

      const updateData: {
        name?: string;
        bio?: string;
        profile_image_url?: string;
        banner_image_url?: string;
      } = {
        name: data.name,
        bio: data.bio,
      };

      if (profileImageUrl) {
        updateData.profile_image_url = profileImageUrl;
      }
      if (bannerImageUrl) {
        updateData.banner_image_url = bannerImageUrl;
      }

      updateMyProfile.mutate(updateData, {
        onSuccess: (response: ProfileResponseDto) => {
          console.log('Profile updated successfully:', response);
          // TODO: Show success toast notification
        },
        onError: (error: Error) => {
          console.error('Failed to update profile:', error);
          // TODO: Show error toast notification
        },
      });
    } catch (error) {
      console.error('Failed to process profile update:', error);
      // TODO: Show error toast notification
    }
  };

  return {
    handleSaveProfile,
    isUpdating: updateMyProfile.isPending,
    isError: updateMyProfile.isError,
    isSuccess: updateMyProfile.isSuccess,
    error: updateMyProfile.error,
  };
};
