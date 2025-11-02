import React, { useEffect, useState } from 'react';
import XModal from '@/components/ui/hoc/XModal';
import {
  compareDatesOrUndefined,
  isoStringToDatePickerValue,
  getBirthDateOrNull,
  datePickerValueToISOString,
} from '@/utils';
import { DatePickerValue } from '@/components/ui/DatePicker';
import EditProfileHeader from './components/EditProfileHeader';
import EditProfileAvatar from './components/EditProfileAvatar';
import EditProfileCover from './components/EditProfileCover';
import EditProfileForm from './components/EditProfileForm';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: {
    name: string;
    bio: string;
    profileImage?: string;
    bannerImage?: string;
    location?: string;
    website?: string;
    birthDate?: string; // ISO string
  };
  onSave: (data: {
    name?: string;
    bio?: string;
    profileImage?: File | null;
    bannerImage?: File | null;
    location?: string | null;
    website?: string | null;
    birthDate?: string | null;
  }) => void;
  isUpdating?: boolean;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onSave,
  isUpdating = false,
}) => {
  const [name, setName] = useState(initialData.name);
  const [bio, setBio] = useState(initialData.bio);
  const [location, setLocation] = useState(initialData.location ?? '');
  const [website, setWebsite] = useState(initialData.website ?? '');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | undefined>(
    initialData.profileImage
  );
  const [bannerPreview, setBannerPreview] = useState<string | undefined>(
    initialData.bannerImage
  );
  const [birth, setBirth] = useState<DatePickerValue | undefined>(() => {
    return isoStringToDatePickerValue(initialData.birthDate);
  });

  const handleSave = () => {
    const computeImagePayload = (
      file: File | null,
      preview: string | undefined,
      initial?: string
    ): File | null | undefined => {
      if (file) return file;
      if (preview === '') return null;
      if (preview === initial) return undefined;
      return undefined;
    };

    const fieldPayload = (value: string, initial?: string | undefined) => {
      const v = value?.trim();
      const init = initial?.trim() ?? '';
      if (v === init) return undefined;
      return value;
    };

    onSave({
      name: fieldPayload(name, initialData.name),
      bio: fieldPayload(bio, initialData.bio),
      location: fieldPayload(location, initialData.location),
      website: fieldPayload(website, initialData.website),
      birthDate: (() => {
        const selected = getBirthDateOrNull(birth);
        const initial = initialData.birthDate;
        if (!selected) return selected; // undefined/null
        const composedIso = datePickerValueToISOString(selected);
        if (!composedIso) return undefined;
        return compareDatesOrUndefined(composedIso, initial);
      })(),
      profileImage: computeImagePayload(
        profileImage,
        profilePreview,
        initialData.profileImage
      ),
      bannerImage: computeImagePayload(
        bannerImage,
        bannerPreview,
        initialData.bannerImage
      ),
    });
    onCloseModal();
  };

  const handleProfileImageChange = (file: File | null) => {
    setProfileImage(file);
    if (file) {
      setProfilePreview(URL.createObjectURL(file));
    } else {
      setProfilePreview('');
    }
  };

  const handleBannerImageChange = (file: File | null) => {
    setBannerImage(file);
    if (file) {
      setBannerPreview(URL.createObjectURL(file));
    } else {
      setBannerPreview('');
    }
  };

  const resetToInitial = () => {
    setName(initialData.name);
    setBio(initialData.bio);
    setLocation(initialData.location ?? '');
    setWebsite(initialData.website ?? '');
    setProfileImage(null);
    setBannerImage(null);
    setProfilePreview(initialData.profileImage);
    setBannerPreview(initialData.bannerImage);
    setBirth(isoStringToDatePickerValue(initialData.birthDate));
  };

  const onCloseModal = () => {
    resetToInitial();
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      setName(initialData.name);
      setBio(initialData.bio);
      setLocation(initialData.location ?? '');
      setWebsite(initialData.website ?? '');
      setProfileImage(null);
      setBannerImage(null);
      setProfilePreview(initialData.profileImage);
      setBannerPreview(initialData.bannerImage);
      setBirth(isoStringToDatePickerValue(initialData.birthDate));
    }
  }, [isOpen, initialData]);

  return (
    <XModal
      isOpen={isOpen}
      onClose={onCloseModal}
      size="xl"
      customLayout={false}
      overlayColor="bg-modal-overlay"
    >
      <EditProfileHeader
        onClose={onCloseModal}
        onSave={handleSave}
        isUpdating={isUpdating}
      />
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
            setBirth={setBirth}
          />
        </div>
      </div>
    </XModal>
  );
};

export default EditProfileModal;
