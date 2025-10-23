import LayoutWrapper from '@/features/layout/components/LayoutWrapper';
import MessagesLayout from '@/features/messages/components/MessagesLayout';

export default function MessagesPage() {
  return (
    <LayoutWrapper
      showRightSidebar={false}
      hideMobileBar={false}
      fullWidth={true}
    >
      <MessagesLayout />
    </LayoutWrapper>
  );
}
