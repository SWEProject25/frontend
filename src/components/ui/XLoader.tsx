import React from 'react';
import { XLogo } from '@/components/ui/icons';

const XLoader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black">
      <div className="animate-pulse">
        <XLogo className="w-16 h-16 text-white" />
      </div>
    </div>
  );
};

export default XLoader;
