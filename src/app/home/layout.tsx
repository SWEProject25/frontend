import LayoutWrapper from '@/features/layout/components/LayoutWrapper';
import { ReactNode } from 'react';

export default function layout({
  children,
}: {
  children: ReactNode;
  // compose: ReactNode;
}) {
  return <>{children}</>;
  // return <LayoutWrapper>{children}</LayoutWrapper>;
}
