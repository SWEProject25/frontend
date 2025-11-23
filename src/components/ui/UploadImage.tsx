import React, { useRef } from 'react';
import Button from '@/components/ui/Button';
import { CameraIcon, CloseIcon } from '@/components/ui/icons';

interface UploadImageProps {
  label?: string;
  onFileSelect: (file: File | null) => void;
  previewUrl?: string;
  showClearButton?: boolean;
  onClear?: () => void;
  'data-testid'?: string;
}

const UploadImage: React.FC<UploadImageProps> = ({
  label,
  onFileSelect,
  showClearButton = false,
  onClear,
  'data-testid': dataTestId,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    } else {
      onFileSelect(null);
    }
  };

  return (
    <div
      className="flex flex-col items-center gap-2"
      data-testid={dataTestId || 'upload-image-container'}
    >
      <div
        className="flex flex-row items-center gap-2"
        data-testid={
          dataTestId ? `${dataTestId}-buttons` : 'upload-image-buttons'
        }
      >
        <Button
          variant="overlay"
          size="md"
          shape="circle"
          onClick={handleButtonClick}
          data-testid={
            dataTestId
              ? `${dataTestId}-upload-button`
              : 'upload-image-upload-button'
          }
        >
          <CameraIcon className="w-5 h-5 text-white" />
        </Button>
        {showClearButton && onClear && (
          <Button
            variant="overlay"
            size="md"
            shape="circle"
            onClick={onClear}
            aria-label="Clear image"
            data-testid={
              dataTestId
                ? `${dataTestId}-clear-button`
                : 'upload-image-clear-button'
            }
          >
            <CloseIcon className="w-5 h-5 text-white" />
          </Button>
        )}
      </div>
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        data-testid={dataTestId ? `${dataTestId}-input` : 'upload-image-input'}
      />
      {label && (
        <p
          className="text-sm text-text-active"
          data-testid={
            dataTestId ? `${dataTestId}-label` : 'upload-image-label'
          }
        >
          {label}
        </p>
      )}
    </div>
  );
};

export default UploadImage;
