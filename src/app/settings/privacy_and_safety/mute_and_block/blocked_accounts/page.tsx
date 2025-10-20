'use client';
import { useRouter } from 'next/navigation';
import Breadcrumb from '@/components/ui/Breadcrumb';

export default function MuteAndBlockPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push('/settings/privacy_and_safety/mute_and_block');
  };

  return (
    <div className="border-r border-border min-h-screen">
      <Breadcrumb
        title="Blocked accounts"
        onBack={handleBack}
        showArrow={true}
      />
    </div>
  );
}
