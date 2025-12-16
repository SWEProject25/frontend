'use client';
import LayoutWrapper from '@/features/layout/components/LayoutWrapper';
import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

export default function Layout({ children }: { readonly children: ReactNode }) {
  const pathname = usePathname();
  const isOnExploreTabs = pathname?.startsWith('/explore/tabs');

  return (
    <LayoutWrapper hasSearch={false} hideWhatIsHappening={isOnExploreTabs}>
      <div className="w-full">{children}</div>
    </LayoutWrapper>
  );
}
