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
    <div className="flex flex-row w-full min-h-screen justify-center">
      <Toaster position="bottom-center" />
      <div className="hidden xs:block">
        <LeftSidebar />
      </div>

      {showMobileBottomBar && (
        <div className="xs:hidden">
          <MobileBottomBar />
        </div>
      )}

      <main className="flex flex-1 flex-row min-h-screen max-w-[942px]">
        <div className="border-x-border border-x-[1px] flex-1">{children}</div>

        {showRightSidebar && (
          <div className="hidden xl:flex right-0 top-0 h-full">
            <RightSidebar />
          </div>
        )}
      </main>
    </div>
  );
}
