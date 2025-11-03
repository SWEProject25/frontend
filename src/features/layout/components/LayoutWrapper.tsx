import React from 'react';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import MobileBottomBar from './MobileBottomBar';
import { Toaster } from 'react-hot-toast';
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
    <div className="container flex flex-row justify-center min-h-screen w-full max-w-[1280px]">
      <Toaster position="bottom-center" />
      {/* Left Sidebar - Hidden on mobile */}
      <div className="hidden xs:block xs:w-[68px] lg:w-[275px]">
        <LeftSidebar />
      </div>

      {/* Mobile Bottom Bar */}
      {showMobileBottomBar && (
        <div className="xs:hidden">
          <MobileBottomBar />
        </div>
      )}

      {/* Main Content */}
      <main
        className={`
          flex
          flex-1
          flex-row
          w-full
          ${showRightSidebar ? 'max-w-full xl:max-w-[990px]' : 'max-w-[600px]'}
          min-h-screen
          pt-0
        `}
      >
        {/* Center Content - Responsive width */}
        <div className="border-x-border border-x-[1px] w-full flex-1 min-w-0">
          {children}
        </div>

        {/* Right Sidebar - Conditional and hidden on mobile/tablet */}
        {showRightSidebar && (
          <div className="hidden xl:flex xl:w-[350px] right-0 top-0 h-full shrink-0">
            <RightSidebar />
          </div>
        )}
      </main>
    </div>
  );
}
