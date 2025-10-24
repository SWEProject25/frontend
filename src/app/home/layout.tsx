import LayoutWrapper from '@/features/layout/components/LayoutWrapper';

export default function HomeRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LayoutWrapper showRightSidebar={true}>{children}</LayoutWrapper>;
}
