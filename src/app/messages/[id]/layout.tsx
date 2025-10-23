import LayoutWrapper from '@/features/layout/components/LayoutWrapper';
import React from 'react';

export default function MessageIdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutWrapper
      showRightSidebar={false}
      hideMobileBar={true}
      fullWidth={true}
    >
      {children}
    </LayoutWrapper>
  );
}
