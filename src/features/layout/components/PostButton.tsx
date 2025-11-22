import { Plus } from 'lucide-react';

export default function PostButton() {
  return (
    <button
      data-testid="sidebar-post-button"
      className="bg-white hover:bg-gray-200 text-black font-bold rounded-full transition-colors mt-4 w-14 h-14 xl:w-full xl:h-auto xl:py-3 flex items-center justify-center"
    >
      {/* Show + icon on small screens, "Post" text on xl */}
      <Plus className="w-6 h-6 min-[1400px]:hidden" strokeWidth={3} />
      <span className="hidden min-[1400px]:inline text-lg">Post</span>
    </button>
  );
}
