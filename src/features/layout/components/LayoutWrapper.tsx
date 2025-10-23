import React from 'react';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import MobileBottomBar from './MobileBottomBar';
import EmptySpace from './EmptySpace';

interface LayoutWrapperProps {
  children: React.ReactNode;
  showRightSidebar?: boolean;
}

export default function LayoutWrapper({
  children,
  showRightSidebar = true,
}: LayoutWrapperProps) {
  return (
    <div className="min-h-screen bg-black flex justify-center">
      <EmptySpace />

      <div className="hidden sm:block w-[68px] sm:w-[88px] xl:w-[275px] flex-shrink-0">
        <LeftSidebar />
      </div>

      <main
        className={`flex-1 ${showRightSidebar ? 'max-w-[600px]' : 'max-w-[990px]'} border-x border-gray-800 min-h-screen`}
      >
        {children}
      </main>

      {showRightSidebar && (
        <div className="hidden lg:block w-[350px] flex-shrink-0">
          <RightSidebar />
        </div>
      )}

      <EmptySpace />

      <div className="sm:hidden">
        <MobileBottomBar />
      </div>
    </div>
  );
}
