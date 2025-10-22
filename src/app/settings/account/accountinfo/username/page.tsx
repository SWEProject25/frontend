'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { InputField } from '@/components/ui/input';
import Button from '@/components/ui/Button';
import { userData } from '@/features/settings/constants/MUTE_and_BLOCK';

export default function UsernamePage() {
  const router = useRouter();
  const [username, setUsername] = useState(userData.username);
  const [loading, setLoading] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleSave = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLoading(false);
    // Here you would update the username in the backend
  };

  // Check if button should be disabled
  const isDisabled = !username || username === userData.username;

  return (
    <div className="border-r border-border min-h-screen">
      <Breadcrumb
        title="Change username"
        onBack={handleBack}
        showArrow={true}
      />
      <div className="px-4 py-6">
        <InputField
          label="Username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          maxLength={50}
          showCharCount
        />
        <div className="mt-6 flex justify-end">
          <Button
            variant="primary"
            size="md"
            disabled={isDisabled}
            loading={loading}
            onClick={handleSave}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
