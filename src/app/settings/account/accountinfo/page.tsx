'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Breadcrumb from '@/components/ui/Breadcrumb';
import ListItem from '@/components/ui/ListItem';
import OptionItem from '@/components/ui/OptionItem';
import { PasswordConfirm } from '@/features/settings/components';
import { useAuth } from '@/features/authentication/hooks/useAuth';
import {
  userData,
  accountInfoItems,
} from '@/features/settings/constants/USER_DATA';

export default function AccountInfoPage() {
  const router = useRouter();
  const { checkPasswordVerification } = useAuth();
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(true);

  useEffect(() => {
    // Check if password is already verified and not expired
    const isVerified = checkPasswordVerification();
    if (isVerified) {
      setShowPasswordConfirm(false);
    }
  }, [checkPasswordVerification]);

  const handleBack = () => {
    router.push('/settings/account');
  };

  const handlePasswordConfirmed = () => {
    setShowPasswordConfirm(false);
  };

  return (
    <div className="border-r border-border min-h-screen">
      <Breadcrumb
        title="Account information"
        subtitle={userData.username}
        onBack={handleBack}
        showArrow={true}
      />
      {showPasswordConfirm ? (
        <PasswordConfirm onConfirm={handlePasswordConfirmed} />
      ) : (
        <nav className="flex flex-col">
          {accountInfoItems.map((item) => (
            <ListItem key={item.id} href={item.path}>
              <OptionItem
                label={item.label}
                description={item.value}
                showArrow={true}
              />
            </ListItem>
          ))}
        </nav>
      )}
    </div>
  );
}
