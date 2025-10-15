import LayoutWrapper from '@/features/layout/components/LayoutWrapper';
import { SettingsLayout } from '@/features/settings/components';

export default function SettingsRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutWrapper showRightSidebar={false}>
      <SettingsLayout>{children}</SettingsLayout>
    </LayoutWrapper>
  );
}
