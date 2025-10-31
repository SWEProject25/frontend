import React from 'react';
import Cover from '../Cover';
import UploadImage from '@/components/ui/UploadImage';

interface EditProfileCoverProps {
  coverImage?: string;
  onFileSelect: (file: File | null) => void;
  showClearButton: boolean;
  onClear: () => void;
}

const EditProfileCover: React.FC<EditProfileCoverProps> = ({
  coverImage,
  onFileSelect,
  showClearButton,
  onClear,
}) => (
  <Cover coverImage={coverImage} className="mt-4">
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <UploadImage
        onFileSelect={onFileSelect}
        showClearButton={showClearButton}
        onClear={onClear}
      />
    </div>
  </Cover>
);

export default EditProfileCover;
