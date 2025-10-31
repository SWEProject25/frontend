import React, { useEffect, useState } from 'react';
import XModal from '@/components/ui/hoc/XModal';
import { InputField } from '@/components/ui/input/InputField';
import Button from '@/components/ui/Button';
import { CloseIcon } from '@/components/ui/icons';
import UploadImage from '@/components/ui/UploadImage';
import Cover from './Cover';
import Avatar from './Avatar';

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
    birthDate?: string;
  };
  onSave: (data: {
    name: string;
    bio: string;
    profileImage?: File | null;
    bannerImage?: File | null;
    location?: string;
    website?: string;
    birthDate?: string;
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

    onSave({
      name,
      bio,
      location,
      website,
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

  // Reset local state to initial values
  const resetToInitial = () => {
    setName(initialData.name);
    setBio(initialData.bio);
    setLocation(initialData.location ?? '');
    setWebsite(initialData.website ?? '');
    setProfileImage(null);
    setBannerImage(null);
    setProfilePreview(initialData.profileImage);
    setBannerPreview(initialData.bannerImage);
  };

  const onCloseModal = () => {
    resetToInitial();
    onClose();
  };

  // Sync state when modal opens or initialData changes
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
    }
  }, [isOpen, initialData]);

  return (
    <XModal
      isOpen={isOpen}
      onClose={onCloseModal}
      size="xl"
      customLayout={false}
      overlayColor="bg-modal-overlay"
      preventScroll={false}
    >
      <div className="sticky top-0 z-40 backdrop-blur-sm bg-black/80">
        <div className="flex justify-between gap-2 px-1 py-2">
          <Button
            variant="ghost"
            size="sm"
            shape="circle"
            onClick={onCloseModal}
            aria-label="Close modal"
            disabled={isUpdating}
          >
            <CloseIcon className="w-5 h-5 text-text-active" />
          </Button>
          <Button
            variant="social"
            size="sm"
            shape="rounded"
            onClick={handleSave}
            disabled={isUpdating}
          >
            {isUpdating ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>
      <div className="flex flex-col w-full">
        <Cover coverImage={bannerPreview} className="mt-4">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <UploadImage
              onFileSelect={handleBannerImageChange}
              showClearButton={!!bannerPreview}
              onClear={() => handleBannerImageChange(null)}
            />
          </div>
        </Cover>

        <div className="relative pb-4">
          <Avatar
            avatarImage={profilePreview}
            className="-top-[66px] left-3"
            position="absolute"
            customPosition={true}
          >
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <UploadImage onFileSelect={handleProfileImageChange} />
            </div>
          </Avatar>

          {/* Form Fields */}
          <div className="mt-20 space-y-6">
            <InputField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={50}
              showCharCount
            />
            <InputField
              label="Bio"
              type="textarea"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={160}
              showCharCount
            />
            <InputField
              label="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              maxLength={30}
              showCharCount
            />
            <InputField
              label="Website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              maxLength={100}
              showCharCount
            />
          </div>
        </div>
      </div>
    </XModal>
  );
};

export default EditProfileModal;
