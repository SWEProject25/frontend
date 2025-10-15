import React from 'react';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className=" container flex flex-row justify-center min-h-screen">
      <LeftSidebar />

      {/* Main Feed Placeholder */}
      <main
        className="
          flex-1
          max-w-[600px]
          min-h-screen
          border-x
          border-gray-800
          pt-0
          pb-20
        "
      >
        {/* Placeholder for Feed */}
        <div className="flex items-center justify-center h-full text-gray-500">
          {children}
        </div>
      </main>

      {/* Right Sidebar */}
      <div className="hidden lg:flex right-0 top-0 h-full">
        <RightSidebar />
      </div>
    </div>
  );
}
