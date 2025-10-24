import LayoutWrapper from '@/features/layout/components/LayoutWrapper';

export default function MessagesRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LayoutWrapper showRightSidebar={false}>{children}</LayoutWrapper>;
}
