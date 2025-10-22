import React, { useState } from 'react';
import XModal from '@/components/ui/hoc/XModal';
import { InputField } from '@/components/ui/input/InputField';
import Button from '@/components/ui/Button';
import { CloseIcon } from '@/components/ui/icons';
import UploadImage from '@/components/ui/UploadImage';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: {
    name: string;
    bio: string;
    profileImage?: string;
    bannerImage?: string;
  };
  onSave: (data: {
    name: string;
    bio: string;
    profileImage?: File;
    bannerImage?: File;
  }) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onSave,
}) => {
  const [name, setName] = useState(initialData.name);
  const [bio, setBio] = useState(initialData.bio);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | undefined>(
    initialData.profileImage
  );
  const [bannerPreview, setBannerPreview] = useState<string | undefined>(
    initialData.bannerImage
  );

  const handleSave = () => {
    onSave({
      name,
      bio,
      profileImage: profileImage || undefined,
      bannerImage: bannerImage || undefined,
    });
    onClose();
  };

  const handleProfileImageChange = (file: File | null) => {
    setProfileImage(file);
    if (file) {
      setProfilePreview(URL.createObjectURL(file));
    } else {
      setProfilePreview(initialData.profileImage);
    }
  };

  const handleBannerImageChange = (file: File | null) => {
    setBannerImage(file);
    if (file) {
      setBannerPreview(URL.createObjectURL(file));
    } else {
      setBannerPreview(initialData.bannerImage);
    }
  };

  const headerContent = (
    <div className="flex justify-between gap-2 px-4 pt-4">
      <Button
        variant="ghost"
        size="sm"
        shape="circle"
        onClick={onClose}
        aria-label="Close modal"
      >
        <CloseIcon className="w-5 h-5 text-text-active" />
      </Button>
      <Button variant="social" size="sm" shape="rounded" onClick={handleSave}>
        Save
      </Button>
    </div>
  );

  return (
    <XModal isOpen={isOpen} onClose={onClose} size="lg" header={headerContent}>
      <div className="flex flex-col w-full">
        {/* Cover Image Section */}
        <div className="relative w-full h-[200px]">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: bannerPreview ? `url(${bannerPreview})` : 'none',
              backgroundColor: '#333639',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <UploadImage
              onFileSelect={handleBannerImageChange}
              showClearButton={!!bannerPreview}
              onClear={() => handleBannerImageChange(null)}
            />
          </div>
        </div>

        {/* Avatar Section */}
        <div className="relative px-4 pb-4">
          <div className="absolute -top-16 left-4">
            <div
              className="w-[132px] h-[132px] rounded-full border-4 border-[#15202B] relative"
              style={{
                backgroundImage: profilePreview
                  ? `url(${profilePreview})`
                  : 'none',
                backgroundColor: '#333639',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <UploadImage onFileSelect={handleProfileImageChange} />
              </div>
            </div>
          </div>

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
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={160}
              showCharCount
            />
          </div>
        </div>
      </div>
    </XModal>
  );
};

export default EditProfileModal;
