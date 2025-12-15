import React from 'react';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import MobileBottomBar from './MobileBottomBar';
import { Toaster } from 'react-hot-toast';
import GrokSummary from './GrokSummary';
interface LayoutWrapperProps {
  children: React.ReactNode;
  showRightSidebar?: boolean;
  showMobileBottomBar?: boolean;
  hasSearch?: boolean;
  hideWhatIsHappening?: boolean;
}

export default function LayoutWrapper({
  children,
  showRightSidebar = true,
  hasSearch = true,
  showMobileBottomBar = true,
  hideWhatIsHappening = false,
}: LayoutWrapperProps) {
  return (
    <div className="flex flex-row w-full min-h-screen justify-center">
      <Toaster position="bottom-center" />
      <div className="hidden sm:block">
        <LeftSidebar />
      </div>

      {showMobileBottomBar && (
        <div className="sm:hidden">
          <MobileBottomBar />
        </div>
      )}

      <main className="flex flex-1 flex-row min-h-screen max-w-[1100px] w-full">
        <div className="border-x-border border-x sm:w-[560px] w-full flex-1 min-w-0 overflow-visible">
          {children}
        </div>

        <div
          className={`lg:block right-0 w-[440px] top-0 h-full hidden ${!showRightSidebar ? 'lg:hidden' : ''}`}
        >
          <RightSidebar
            hasSearch={hasSearch}
            hideWhatIsHappening={hideWhatIsHappening}
          />
        </div>
      </main>
      {showRightSidebar && (
        <div className="fixed bottom-25 right-10 z-50">
          <GrokSummary />
        </div>
      )}
    </div>
  );
}
