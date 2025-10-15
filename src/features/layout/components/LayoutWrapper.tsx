import React from 'react';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';

interface LayoutWrapperProps {
  children: React.ReactNode;
  showRightSidebar?: boolean;
}

export default function LayoutWrapper({
  children,
  showRightSidebar = true,
}: LayoutWrapperProps) {
  return (
    <div className="container flex flex-row justify-center min-h-screen">
      <div className="hidden xs:block">
        <LeftSidebar />
      </div>
      <div className="block xs:hidden">{/* <MobileBar/> */}</div>

      {/* Main Content */}
      <main
        className={`
          flex-1
          ${showRightSidebar ? 'max-w-[600px]' : 'max-w-[990px]'}
          min-h-screen
          border-x
          border-gray-800
          pt-0
          pb-20
        `}
      >
        <div>{children}</div>
      </main>

      {/* Right Sidebar - Conditional */}
      {showRightSidebar && (
        <div className="hidden xl:flex right-0 top-0 h-full">
          <RightSidebar />
        </div>
      )}
    </div>
  );
}
