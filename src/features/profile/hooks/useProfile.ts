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
    // console.log('🔧 useProfile received data:', data);

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
        // console.log('📤 Uploading profile image');
        await uploadProfileImage.mutateAsync(data.profileImage);
      } else if (data.profileImage === null) {
        // console.log('🗑️ Removing profile image');
        await removeProfileImage.mutateAsync();
      }
      if (data.bannerImage) {
        // console.log('📤 Uploading banner image');
        await uploadBannerImage.mutateAsync(data.bannerImage);
      } else if (data.bannerImage === null) {
        // console.log('🗑️ Removing banner image - THIS SHOULD BE CALLED!');
        await removeBannerImage.mutateAsync();
      }
      if (Object.keys(cleanedUpdateData).length > 0) {
        await updateMyProfile.mutateAsync(cleanedUpdateData);
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
