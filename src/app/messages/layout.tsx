'use client';
import { usePathname } from 'next/navigation';
import LayoutWrapper from '@/features/layout/components/LayoutWrapper';

export default function MessagesRootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isConversationView = pathname !== '/messages';

  return (
    <LayoutWrapper
      showRightSidebar={false}
      showMobileBottomBar={!isConversationView}
    >
      {children}
    </LayoutWrapper>
  );
}
