'use client';
import { useRouter } from 'next/navigation';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { BlockedAccountsList } from '@/features/settings/components/privacy';

export default function BlockedAccountsPage() {
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

      <BlockedAccountsList />
    </div>
  );
}
