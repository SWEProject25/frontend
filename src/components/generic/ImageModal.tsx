'use client';
import React from 'react';
import Image from 'next/image';

import Icon from '@/components/ui/home/Icon';
import type { MediaItem } from '@/features/tweets/types';

interface ImageModalProps {
  readonly isOpen: boolean;
  readonly onClose: (e: React.MouseEvent) => void;
  readonly media: MediaItem[];
  readonly currentIndex: number;
  readonly onNext?: (e: React.MouseEvent) => void;
  readonly onPrev?: (e: React.MouseEvent) => void;
  readonly showNavigation?: boolean;
  readonly showCounter?: boolean;
}

export default function ImageModal({
  isOpen,
  onClose,
  media,
  currentIndex,
  onNext,
  onPrev,
  showNavigation = true,
  showCounter = true,
}: ImageModalProps) {
  if (!isOpen || media.length === 0) return null;

  const currentMedia = media[currentIndex];
  const hasMultipleMedia = media.length > 1;
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < media.length - 1;

  return (
    <div
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          onClose(e as any);
        }
      }}
      aria-label="Image viewer"
      data-testid="image-modal"
    >
      {/* Close button */}
      <button
        className="absolute top-4 left-4 text-white text-2xl hover:bg-white/10 rounded-full w-10 h-10 flex items-center justify-center z-[10000]"
        onClick={onClose}
        aria-label="Close modal"
        data-testid="image-modal-close-btn"
      >
        ×
      </button>

      {/* Image counter */}
      {showCounter && hasMultipleMedia && (
        <div
          className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm z-[10000]"
          data-testid="image-modal-counter"
        >
          {currentIndex + 1} / {media.length}
        </div>
      )}

      {/* Navigation arrows */}
      {showNavigation && hasMultipleMedia && canGoPrev && onPrev && (
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 z-[10000] w-12 h-12 flex items-center justify-center bg-black/60 hover:bg-black/80 cursor-pointer text-white rounded-full"
          onClick={onPrev}
          aria-label="Previous image"
          data-testid="image-modal-prev-btn"
        >
          <Icon
            disabled={true}
            color="text-white"
            path="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z"
          />
        </button>
      )}

      {showNavigation && hasMultipleMedia && canGoNext && onNext && (
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 z-[10000] w-12 h-12 flex items-center justify-center bg-black/60 hover:bg-black/80 cursor-pointer text-white rounded-full"
          onClick={onNext}
          aria-label="Next image"
          data-testid="image-modal-next-btn"
        >
          <Icon
            disabled={true}
            color="text-white"
            path="M12.957 4.54L20.414 12l-7.457 7.46-1.414-1.42L16.586 13H3v-2h13.586l-5.043-5.04 1.414-1.42z"
          />
        </button>
      )}

      {/* Image container */}
      <div
        role="presentation"
        className="max-w-[95vw] max-h-[95vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        data-testid="image-modal-content"
      >
        {currentMedia?.type.toLowerCase() === 'image' ? (
          <Image
            src={currentMedia.url}
            alt={`Image ${currentIndex + 1}`}
            className="max-w-full max-h-[95vh] object-contain"
            onClick={(e) => e.stopPropagation()}
            width={1000}
            height={800}
            style={{
              objectFit: 'contain',
              maxWidth: '100%',
              maxHeight: '95vh',
            }}
            priority
            data-testid="image-modal-image"
          />
        ) : (
          <video
            controls
            className="max-w-full max-h-[95vh] object-contain"
            src={currentMedia?.url}
            onClick={(e) => e.stopPropagation()}
            data-testid="image-modal-video"
          >
            <track kind="captions" />
          </video>
        )}
      </div>
    </div>
  );
}
