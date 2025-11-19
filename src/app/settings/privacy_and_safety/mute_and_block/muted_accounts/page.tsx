'use client';
import { useRouter } from 'next/navigation';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { MutedAccountsList } from '@/features/settings/components/privacy';

export default function MutedAccountsPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push('/settings/privacy_and_safety/mute_and_block');
  };

  return (
    <div className="border-r border-border min-h-screen">
      <Breadcrumb title="Muted accounts" onBack={handleBack} showArrow={true} />

      <MutedAccountsList />
    </div>
  );
}
