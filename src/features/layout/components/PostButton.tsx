import { Feather } from 'lucide-react';

export default function PostButton() {
  return (
    <button
      className="bg-white text-black font-bold text-lg mt-4 rounded-full 
  w-12 h-12 xl:w-[230px] xl:h-auto flex items-center justify-center 
  hover:bg-gray-200 transition-all duration-200"
    >
      <Feather className="w-6 h-6 xl:hidden" />
      <span className="hidden xl:inline px-4 py-2">Post</span>
    </button>
  );
}
