'use client';

import { useRouter } from 'next/navigation';
import Breadcrumb from '@/components/ui/Breadcrumb';
import ListItem from '@/components/ui/ListItem';
import { userData, accountInfoItems } from '@/constants/USER_DATA';

export default function AccountInformationList() {
  const router = useRouter();

  const handleBack = () => {
    router.push('/settings/account');
  };

  return (
    <div className="border-r border-border min-h-screen">
      <Breadcrumb
        title="Account information"
        subtitle={userData.username}
        onBack={handleBack}
        showArrow={true}
      />
      <nav className="flex flex-col">
        {accountInfoItems.map((item) => (
          <ListItem
            key={item.id}
            label={item.label}
            description={item.value}
            href={item.path}
            showArrow={true}
          />
        ))}
      </nav>
    </div>
  );
}
