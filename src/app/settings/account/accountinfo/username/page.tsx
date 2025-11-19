'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { InputField } from '@/components/ui/input';
import Button from '@/components/ui/Button';
import { useAuth } from '@/features/authentication/hooks/useAuth';

export default function UsernamePage() {
  const router = useRouter();
  const { user, updateUsername, isUpdateUsernameLoading } = useAuth();

  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Initialize username from auth store
  useEffect(() => {
    if (user?.username) {
      setUsername(user.username);
    }
  }, [user]);

  const handleBack = () => {
    router.back();
  };

  const handleSave = async () => {
    if (!username || !user) return;

    // Clear previous messages
    setError('');
    setSuccess('');

    // Validate username
    if (username.length < 3) {
      setError('Username must be at least 3 characters long');
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError('Username can only contain letters, numbers, and underscores');
      return;
    }

    try {
      const response = await updateUsername({ username: username });

      console.log('Update username response:', response);

      setSuccess('Username updated successfully!');

      // Redirect back after 2 seconds
      setTimeout(() => {
        router.back();
      }, 2000);
    } catch (err) {
      console.error('Update username error:', err);
      if (err instanceof Error) {
        setError(err.message || 'Failed to update username');
      } else {
        setError('Failed to update username. Please try again.');
      }
    }
  };

  // Check if button should be disabled
  const isDisabled =
    !username || username === user?.username || isUpdateUsernameLoading;

  return (
    <div className="border-r border-border min-h-screen">
      <Breadcrumb
        title="Change username"
        onBack={handleBack}
        showArrow={true}
      />
      <div className="px-4 py-6">
        <div className="mb-4">
          <p className="text-sm text-text-secondary mb-4">
            Your username is how others find and mention you on the platform.
            Choose wisely!
          </p>
        </div>

        <InputField
          label="Username"
          type="text"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setError('');
            setSuccess('');
          }}
          maxLength={50}
          showCharCount
          error={error && !success ? error : undefined}
        />

        {success && (
          <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <p className="text-sm text-green-500">{success}</p>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <Button
            variant="primary"
            size="md"
            disabled={isDisabled}
            loading={isUpdateUsernameLoading}
            onClick={handleSave}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
