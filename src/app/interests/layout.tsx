import LayoutWrapper from '@/features/layout/components/LayoutWrapper';
import { ReactNode } from 'react';
export const metadata = {
  title: 'Interests',
  description: 'Interests page',
};
export default function layout({ children }: { children: ReactNode }) {
  return (
    <LayoutWrapper hasSearch={true}>
      <div className="w-full">{children}</div>
    </LayoutWrapper>
  );
}
