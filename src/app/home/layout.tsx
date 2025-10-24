import LayoutWrapper from '@/features/layout/components/LayoutWrapper';
import { ReactNode } from 'react';

export default function layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
  // <LayoutWrapper>{children}</LayoutWrapper>;
}
