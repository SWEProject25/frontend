'use client';

import React, { useEffect } from 'react';
import { CloseIcon, XLogo } from '@/components/ui/icons';
import { createPortal } from 'react-dom';

interface XModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  overlayColor?: string;
  customLayout?: boolean;
  title?: string;
  showLogo?: boolean;
  showCloseButton?: boolean;
  padding?: boolean;
}

export default function XModal({
  isOpen,
  onClose,
  children,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  overlayColor = 'bg-black/50 backdrop-blur-sm',
  customLayout = true,
  title = 'Custom Modal',
  showLogo = false,
  showCloseButton = false,
  padding = true,
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
    sm: 'sm:max-w-sm sm:max-h-[300px]',
    md: 'sm:max-w-md sm:max-h-[400px]',
    lg: 'sm:max-w-lg sm:max-h-[500px]',
    xl: 'sm:max-w-xl sm:max-h-[600px]',
    '2xl': 'sm:h-[427.5px] sm:w-[600px]',
    '3xl': 'sm:h-[427.5px] sm:w-[630px]',
    '4xl': 'sm:min-h-[427.5px] sm:max-h-[85vh] sm:w-[600px]',
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div>
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center overflow-y-clip ${overlayColor}`}
        onClick={handleOverlayClick}
        data-testid={`overlay-xmodal`}
        role="dialog"
        aria-modal="true"
      >
        <div
          className={`
              relative w-full
              bg-modal-bg sm:rounded-2xl
              shadow-2xl
              h-full sm:h-auto sm:max-h-[90vh] overflow-y-auto
              sm:p-0
              animate-in fade-in zoom-in-95 duration-200
               ${sizeClasses[size]}
              `}
        >
          {customLayout && (
            <>
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="absolute top-4 left-4 p-2 rounded-full hover:bg-muted transition-colors z-10"
                  aria-label="Close modal"
                  data-testid={`close-xmodal`}
                >
                  <CloseIcon className="w-5 h-5 text-text-active" />
                </button>
              )}

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
            </>
          )}
          {/* Content */}
          <div className={`${padding && 'px-2 pb-8'}`}>{children}</div>
        </div>
      </div>
    </div>,
    document.body
  );
}
