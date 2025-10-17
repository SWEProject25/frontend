import React from 'react';
import { MoreHorizontal } from 'lucide-react';

export default function ProfileSection() {
  return (
    <div className="flex items-center justify-between hover:bg-gray-900 rounded-full p-3 mb-3 cursor-pointer transition-colors ">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
          <img
            src="https://via.placeholder.com/40"
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="hidden xl:block">
          <p className="text-white font-semibold text-sm leading-tight">
            Ammar Yasser
          </p>
          <p className="text-gray-400 text-sm">@ammar10695</p>
        </div>
      </div>
      <MoreHorizontal className="text-white hidden xl:block" />
    </div>
  );
}
