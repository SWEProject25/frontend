import React from 'react';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import MobileBottomBar from './MobileBottomBar';
import { Toaster } from 'react-hot-toast';
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
      <Toaster position="bottom-center" />
      <div className="hidden xs:block">
        <LeftSidebar />
      </div>

      <div className="xs:hidden">
        <MobileBottomBar />
      </div>

      {/* Main Content */}
      <main
        className={`
          flex
          flex-1
          flex-row
          ${showRightSidebar ? 'max-w-[942px]' : 'max-w-[942px]'}
          min-h-screen
          pt-0
          pb-20
        `}
      >
        <div className="border-x-border border-x-[1px] ">{children}</div>
        {/* Right Sidebar - Conditional */}
        {showRightSidebar && (
          <div className="hidden xl:flex right-0 top-0 h-full">
            <RightSidebar />
          </div>
        )}
      </main>
    </div>
  );
}
