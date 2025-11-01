import React from 'react';
import Action from './Action';
import { BackArrowIcon, FilterIcon } from '@/components/ui/icons/UIIcons';
function Header() {
  function handleBackClick() {
    window.history.back();
  }
  return (
    <div className="flex items-center justify-between px-4 py-3 cursor-pointer">
      <div className="flex items-center gap-8">
        <Action
          icon={<BackArrowIcon />}
          color="gray"
          onClick={handleBackClick}
          label="Back"
        />
        <h1 className="text-xl font-bold">Post</h1>
      </div>
      <div className="flex items-center gap-2">
        <button
          className={`px-3.5 py-1 rounded-full font-semibold text-sm transition cursor-pointer 'bg-black text-white border border-gray-700 hover:bg-[#0a0a0a]`}
        >
          Reply
        </button>
        <Action icon={<FilterIcon />} color="gray" />
      </div>
    </div>
  );
}

export default Header;
