import React from 'react';
import Action from './Action';
import { SlidersHorizontal } from 'lucide-react';
import { FaArrowLeft } from 'react-icons/fa6';
function Header() {
  function handleBackClick() {
    window.history.back();
  }
  return (
    <div className="flex items-center justify-between px-4 py-3 cursor-pointer">
      <div className="flex items-center gap-8">
        <Action
          icon={<FaArrowLeft size={16} />}
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
        <Action icon={<SlidersHorizontal size={18} />} color="gray" />
      </div>
    </div>
  );
}

export default Header;

{
  /* <svg
  viewBox="0 0 24 24"
  aria-hidden="true"
  class="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-z80fyv r-19wmn03"
  style="color: rgb(239, 243, 244);"
>
  <g>
    <path d="M14 6V3h2v8h-2V8H3V6h11zm7 2h-3.5V6H21v2zM8 16v-3h2v8H8v-3H3v-2h5zm13 2h-9.5v-2H21v2z"></path>
  </g>
</svg>; */
}
