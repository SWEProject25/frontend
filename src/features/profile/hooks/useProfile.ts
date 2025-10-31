import {
  useUpdateMyProfile,
  useUploadProfileImage,
  useUploadBannerImage,
  useRemoveBannerImage,
  useRemoveProfileImage,
} from './profileQueries';

export const useProfile = () => {
  const updateMyProfile = useUpdateMyProfile();
  const uploadProfileImage = useUploadProfileImage();
  const uploadBannerImage = useUploadBannerImage();
  const removeProfileImage = useRemoveProfileImage();
  const removeBannerImage = useRemoveBannerImage();

  const handleSaveProfile = async (data: {
    name?: string;
    bio?: string;
    profileImage?: File | null;
    bannerImage?: File | null;
    location?: string | null;
    website?: string | null;
    birthDate?: string | null;
  }) => {
    try {
      const updateData: {
        [key: string]: unknown;
      } = {
        name: data.name,
        bio: data.bio,
        location: data.location,
        website: data.website,
        birth_date: data.birthDate,
      };

      // Remove undefined / null / empty string values so API receives only meaningful fields
      const cleanedUpdateData = Object.keys(updateData).reduce<{
        [key: string]: unknown;
      }>((acc, key) => {
        const val = updateData[key];
        if (val !== undefined && val !== null) {
          acc[key] = val;
        }
        return acc;
      }, {});

      if (data.profileImage) {
        uploadProfileImage.mutateAsync(data.profileImage);
      } else if (data.profileImage === null) {
        removeProfileImage.mutateAsync();
      }
      if (data.bannerImage) {
        uploadBannerImage.mutateAsync(data.bannerImage);
      } else if (data.bannerImage === null) {
        removeBannerImage.mutateAsync();
      }
      if (Object.keys(cleanedUpdateData).length > 0) {
        updateMyProfile.mutate(cleanedUpdateData);
      }
    } catch (error) {
      console.error('Failed to process profile update:', error);
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
