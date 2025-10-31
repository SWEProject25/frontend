import Timeline from '@/features/timeline/components/Timeline';
import Link from 'next/link';
import { Toaster, toast } from 'react-hot-toast';
export const metadata = {
  title: 'Home',
  description: 'Home page',
};

export default function Home() {
  return (
    <div className="grid grid-cols-[1fr_600px_1fr] min-h-screen overflow-x-hidden  ">
      <aside className="bg-gray-100">Left</aside>
      <Toaster position="bottom-center" />
      <Timeline />
      <aside className="bg-gray-100">Left</aside>
    </div>
    // <Timeline />
  );
}
