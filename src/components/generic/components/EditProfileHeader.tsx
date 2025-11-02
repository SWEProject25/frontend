import React from 'react';
import Button from '@/components/ui/Button';
import { CloseIcon } from '@/components/ui/icons';

interface EditProfileHeaderProps {
  onClose: () => void;
  onSave: () => void;
  isUpdating: boolean;
}

const EditProfileHeader: React.FC<EditProfileHeaderProps> = ({
  onClose,
  onSave,
  isUpdating,
}) => (
  <div className="sticky top-0 z-40 backdrop-blur-sm bg-black/80">
    <div className="flex justify-between gap-2 px-1 py-2">
      <div>
        <Button
          variant="ghost"
          size="sm"
          shape="circle"
          onClick={onClose}
          aria-label="Close modal"
          disabled={isUpdating}
        >
          <CloseIcon className="w-5 h-5 text-text-active" />
        </Button>
        <span className="text-xl font-bold ml-3">Edit profile</span>
      </div>
      <Button
        variant="social"
        size="sm"
        shape="rounded"
        onClick={onSave}
        disabled={isUpdating}
      >
        {isUpdating ? 'Saving...' : 'Save'}
      </Button>
    </div>
  </div>
);

export default EditProfileHeader;
