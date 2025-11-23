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
    <div
      className="border-r border-border min-h-screen"
      data-testid="blocked-accounts-page"
    >
      <Breadcrumb
        title="Blocked accounts"
        onBack={handleBack}
        showArrow={true}
        data-testid="blocked-accounts-breadcrumb"
      />

      <BlockedAccountsList />
    </div>
  );
}
