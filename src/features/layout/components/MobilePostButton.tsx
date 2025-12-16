'use client';
import { useState } from 'react';
import ComposeModal from '@/features/timeline/components/ComposeModal';
import { PencilIcon } from '@/components/ui/icons';

export default function MobilePostButton() {
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  return (
    <>
      <button
        data-testid="mobile-post-button"
        onClick={() => setIsComposeOpen(true)}
        className="fixed bottom-20 right-4 bg-primary hover:bg-primary-hover hover:cursor-pointer text-white font-bold rounded-full transition-colors w-14 h-14 flex items-center justify-center shadow-lg z-40"
        aria-label="Create post"
      >
        <PencilIcon className="w-6 h-6 cursor-pointer text-white" />
      </button>

      <ComposeModal
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
      />
    </>
  );
}
