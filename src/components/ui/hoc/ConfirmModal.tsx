'use client';

import React from 'react';
import XModal from './XModal';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonClass?: string;
  isLoading?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmButtonClass = 'bg-error hover:bg-error/90 text-white',
  isLoading = false,
}: ConfirmModalProps) {
  const handleConfirm = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    onConfirm();
    onClose();
  };

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    onClose();
  };

  return (
    <XModal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      customLayout={false}
      closeOnOverlayClick={!isLoading}
      closeOnEscape={!isLoading}
    >
      <div className="p-8">
        {/* Title */}
        <h2 className="text-xl font-bold text-text-active mb-3">{title}</h2>

        {/* Message */}
        <p className="text-text-secondary mb-6 text-sm leading-relaxed">
          {message}
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className={`w-full px-4 py-2.5 rounded-full font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${confirmButtonClass}`}
          >
            {isLoading ? 'Processing...' : confirmText}
          </button>
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="w-full px-4 py-2.5 rounded-full font-semibold text-sm transition-colors border border-border text-text-active hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </XModal>
  );
}
