import LayoutWrapper from '@/features/layout/components/LayoutWrapper';
import { ReactNode } from 'react';
export const metadata = {
  title: 'Explore',
  description: 'Explore page',
};
export default function layout({ children }: { children: ReactNode }) {
  return (
    <LayoutWrapper hasSearch={false}>
      <div className="w-full">{children}</div>
    </LayoutWrapper>
  );
}
