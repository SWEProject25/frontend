import { Plus } from 'lucide-react';

export default function PostButton() {
  return (
    <button className="bg-white hover:bg-gray-200 text-black font-bold rounded-full transition-colors mt-4 w-14 h-14 xl:w-full xl:h-auto xl:py-3 flex items-center justify-center">
      {/* Show + icon on small screens, "Post" text on xl */}
      <Plus className="w-6 h-6 xl:hidden" strokeWidth={3} />
      <span className="hidden xl:inline text-lg">Post</span>
    </button>
  );
}
