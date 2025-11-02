import React from 'react';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import MobileBottomBar from './MobileBottomBar';

interface LayoutWrapperProps {
  children: React.ReactNode;
  showRightSidebar?: boolean;
  showMobileBottomBar?: boolean;
}

export default function LayoutWrapper({
  children,
  showRightSidebar = true,
  showMobileBottomBar = true,
}: LayoutWrapperProps) {
  return (
    <div className="container flex flex-row justify-center min-h-screen">
      <div className="hidden xs:block">
        <LeftSidebar />
      </div>

      {showMobileBottomBar && (
        <div className="xs:hidden">
          <MobileBottomBar />
        </div>
      )}

      <main
        className={`
          flex-1
          ${showRightSidebar ? 'max-w-[600px]' : 'max-w-[942px]'}
          min-h-screen
          border-x
          border-gray-800
          pt-0
        `}
      >
        <div>{children}</div>
      </main>

      {showRightSidebar && (
        <div className="hidden xl:flex right-0 top-0 h-full">
          <RightSidebar />
        </div>
      )}
    </div>
  );
}
