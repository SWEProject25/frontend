'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Button from '@/components/ui/Button';
import {
  compareDatesOrUndefined,
  isoStringToDatePickerValue,
  getBirthDateOrNull,
  datePickerValueToISOString,
} from '@/utils';
import { DatePickerValue } from '@/components/ui/DatePicker';
import EditProfileAvatar from '@/components/generic/components/EditProfileAvatar';
import EditProfileCover from '@/components/generic/components/EditProfileCover';
import EditProfileForm from '@/components/generic/components/EditProfileForm';
import { useMyProfile, useUpdateMyProfile } from '@/features/profile/hooks';

export default function ProfileInfoPage() {
  const router = useRouter();
  const { data: profileData, isLoading } = useMyProfile();
  const updateProfileMutation = useUpdateMyProfile();

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [website, setWebsite] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | undefined>(
    undefined
  );
  const [bannerPreview, setBannerPreview] = useState<string | undefined>(
    undefined
  );
  const [birth, setBirth] = useState<DatePickerValue>({});
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Initialize form with profile data
  useEffect(() => {
    if (profileData?.data) {
      const profile = profileData.data;
      setName(profile.name);
      setBio(profile.bio ?? '');
      setLocation(profile.location ?? '');
      setWebsite(profile.website ?? '');
      setProfilePreview(profile.profile_image_url ?? undefined);
      setBannerPreview(profile.banner_image_url ?? undefined);
      setBirth(isoStringToDatePickerValue(profile.birth_date) ?? {});
    }
  }, [profileData]);

  const handleBack = () => {
    router.back();
  };

  const handleSave = async () => {
    if (!profileData?.data) return;

    const profile = profileData.data;

    // Clear previous messages
    setSuccess('');
    setError('');

    const computeImagePayload = (
      file: File | null,
      preview: string | undefined,
      initial?: string | null
    ): File | null | undefined => {
      if (file) return file;
      if (preview === '') return null;
      if (preview === initial) return undefined;
      return undefined;
    };

    const fieldPayload = (value: string, initial?: string | null) => {
      const v = value?.trim();
      const init = initial?.trim() ?? '';
      if (v === init) return undefined;
      return value;
    };

    const birthDateValue = (() => {
      const selected = getBirthDateOrNull(birth);
      const initial = profile.birth_date;
      if (!selected) return selected; // undefined/null
      const composedIso = datePickerValueToISOString(selected);
      if (!composedIso) return undefined;
      return compareDatesOrUndefined(composedIso, initial);
    })();

    const updateData = {
      name: fieldPayload(name, profile.name),
      bio: fieldPayload(bio, profile.bio ?? undefined),
      location: fieldPayload(location, profile.location ?? undefined),
      website: fieldPayload(website, profile.website ?? undefined),
      birth_date: birthDateValue === null ? undefined : birthDateValue,
      profileImage: computeImagePayload(
        profileImage,
        profilePreview,
        profile.profile_image_url ?? undefined
      ),
      bannerImage: computeImagePayload(
        bannerImage,
        bannerPreview,
        profile.banner_image_url ?? undefined
      ),
    };

    try {
      await updateProfileMutation.mutateAsync(updateData);
      setSuccess('Profile updated successfully!');

      // Redirect back after 2 seconds
      setTimeout(() => {
        router.back();
      }, 2000);
    } catch (err) {
      console.error('Update profile error:', err);
      if (err instanceof Error) {
        setError(err.message || 'Failed to update profile');
      } else {
        setError('Failed to update profile. Please try again.');
      }
    }
  };

  const handleProfileImageChange = (file: File | null) => {
    setProfileImage(file);
    if (file) {
      setProfilePreview(URL.createObjectURL(file));
    } else {
      setProfilePreview(undefined);
    }
  };

  const handleBannerImageChange = (file: File | null) => {
    setBannerImage(file);
    if (file) {
      setBannerPreview(URL.createObjectURL(file));
    } else {
      setBannerPreview(undefined);
    }
  };

  if (isLoading) {
    return (
      <div className="border-r border-border min-h-screen">
        <Breadcrumb
          title="Profile information"
          onBack={handleBack}
          showArrow={true}
        />
        <div className="flex justify-center items-center h-64">
          <div className="text-text-secondary">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="border-r border-border min-h-screen">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <Breadcrumb
            title="Profile information"
            onBack={handleBack}
            showArrow={true}
          />
          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            loading={updateProfileMutation.isPending}
            disabled={updateProfileMutation.isPending}
          >
            Save
          </Button>
        </div>
      </div>

      <div className="flex flex-col w-full">
        <EditProfileCover
          coverImage={bannerPreview}
          onFileSelect={handleBannerImageChange}
          showClearButton={!!bannerPreview}
          onClear={() => handleBannerImageChange(null)}
        />
        <div className="relative pb-4">
          <EditProfileAvatar
            avatarImage={profilePreview}
            onFileSelect={handleProfileImageChange}
          />
          <EditProfileForm
            name={name}
            setName={setName}
            bio={bio}
            setBio={setBio}
            location={location}
            setLocation={setLocation}
            website={website}
            setWebsite={setWebsite}
            birth={birth}
            setBirth={(v) => setBirth(v ?? {})}
          />
        </div>

        {success && (
          <div className="mx-4 mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <p className="text-sm text-green-500">{success}</p>
          </div>
        )}

        {error && !success && (
          <div className="mx-4 mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
