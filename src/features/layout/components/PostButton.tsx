'use client';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import ComposeModal from '@/features/timeline/components/ComposeModal';

export default function PostButton() {
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  return (
    <>
      <button
        data-testid="sidebar-post-button"
        onClick={() => setIsComposeOpen(true)}
        className="bg-white hover:bg-gray-200 text-black font-bold rounded-full transition-colors mt-4 w-14 h-14 min-[1400px]:w-full min-[1400px]:h-auto min-[1400px]:py-3 flex items-center justify-center"
      >
        {/* Show + icon on small screens, "Post" text at 1400px+ */}
        <Plus className="w-6 h-6 min-[1400px]:hidden" strokeWidth={3} />
        <span className="hidden min-[1400px]:inline text-lg">Post</span>
      </button>

      <ComposeModal
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
      />
    </>
  );
}
