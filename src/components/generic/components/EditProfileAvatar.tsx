import React from 'react';
import Avatar from '../Avatar';
import UploadImage from '@/components/ui/UploadImage';

interface EditProfileAvatarProps {
  avatarImage?: string;
  onFileSelect: (file: File | null) => void;
}

const EditProfileAvatar: React.FC<EditProfileAvatarProps> = ({
  avatarImage,
  onFileSelect,
}) => (
  <Avatar
    avatarImage={avatarImage ?? null}
    className="-top-[66px] left-3 border-2"
    position="absolute"
    customPosition={true}
  >
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <UploadImage onFileSelect={onFileSelect} />
    </div>
  </Avatar>
);

export default EditProfileAvatar;
