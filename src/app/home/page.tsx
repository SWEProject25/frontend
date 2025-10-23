import LayoutWrapper from '@/features/layout/components/LayoutWrapper';
import Timeline from '@/features/timeline/components/Timeline';
export const metadata = {
  title: 'Home',
  description: 'Home page',
};
export default function Home() {
  return (
    <LayoutWrapper showRightSidebar={true}>
      <Timeline />
    </LayoutWrapper>
  );
}
