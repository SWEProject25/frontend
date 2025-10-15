import React, { useEffect } from 'react';
import { XLogo, CloseIcon } from '@/components/ui/icons';

interface XModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  showLogo?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

export default function XModal({
  isOpen,
  onClose,
  title,
  children,
  showLogo = true,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
}: XModalProps) {
  useEffect(() => {
    if (!closeOnEscape || !isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [closeOnEscape, isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`
          relative w-full ${sizeClasses[size]}
          bg-modal-bg rounded-2xl
          shadow-2xl
          max-h-[90vh] overflow-y-auto
          animate-in fade-in zoom-in-95 duration-200
        `}
      >
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-full hover:bg-muted transition-colors z-10"
          aria-label="Close modal"
        >
          <CloseIcon className="w-5 h-5 text-text-active" />
        </button>

        {showLogo && (
          <div className="flex justify-center pt-4 pb-2">
            <XLogo className="w-8 h-8 text-text-active" />
          </div>
        )}

        {title && (
          <div className="px-8 pt-2 pb-4">
            <h2 className="text-2xl font-bold text-text-active text-center">
              {title}
            </h2>
          </div>
        )}

        {/* Content */}
        <div className="px-8 pb-8">{children}</div>
      </div>
    </div>
  );
}
