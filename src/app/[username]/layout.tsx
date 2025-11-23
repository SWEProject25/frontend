import LayoutWrapper from '@/features/layout/components/LayoutWrapper';
import { ProfileProvider } from './ProfileProvider';

interface UsernameLayoutProps {
  children: React.ReactNode;
  params: Promise<{ username: string }>;
}

export default function UsernameLayout({
  children,
  params,
}: UsernameLayoutProps) {
  return (
    <LayoutWrapper showRightSidebar={true}>
      <ProfileProvider params={params}>{children}</ProfileProvider>
    </LayoutWrapper>
  );
}
