import LayoutWrapper from '@/features/layout/components/LayoutWrapper';

export default function SettingsRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LayoutWrapper showRightSidebar={true}>{children}</LayoutWrapper>;
}
