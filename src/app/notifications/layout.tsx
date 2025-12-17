import LayoutWrapper from '@/features/layout/components/LayoutWrapper';
import { ReactNode } from 'react';

export default function NotificationsLayout({
  children,
}: {
  readonly children: ReactNode;
}) {
  return <LayoutWrapper>{children}</LayoutWrapper>;
}
