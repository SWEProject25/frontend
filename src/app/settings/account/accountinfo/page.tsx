'use client';
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Breadcrumb from '@/components/ui/Breadcrumb';
import ListItem from '@/components/ui/ListItem';
import OptionItem from '@/components/ui/OptionItem';
import { PasswordConfirm } from '@/features/settings/components';
import { useAuth } from '@/features/authentication/hooks/useAuth';
import { getAccountInfoItems } from '@/features/settings/constants/USER_DATA';

export default function AccountInfoPage() {
  const router = useRouter();
  const { checkPasswordVerification, user } = useAuth();
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(true);

  const accountInfoItems = useMemo(() => getAccountInfoItems(user), [user]);

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
    <div
      className="border-r border-border min-h-screen"
      data-testid="account-info-page"
    >
      <Breadcrumb
        title="Account information"
        subtitle={user?.username}
        onBack={handleBack}
        showArrow={true}
        data-testid="account-info-breadcrumb"
      />
      {showPasswordConfirm ? (
        <PasswordConfirm onConfirm={handlePasswordConfirmed} />
      ) : (
        <nav className="flex flex-col" data-testid="account-info-nav">
          {accountInfoItems.map((item) => (
            <ListItem
              key={item.id}
              href={item.path}
              data-testid={`account-info-item-${item.id}`}
            >
              <OptionItem
                label={item.label}
                description={item.value}
                showArrow={true}
                data-testid={`account-info-option-${item.id}`}
              />
            </ListItem>
          ))}
        </nav>
      )}
    </div>
  );
}
