'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { InputField } from '@/components/ui/input';
import Button from '@/components/ui/Button';
import { useAuth } from '@/features/authentication/hooks/useAuth';

export default function EmailPage() {
  const router = useRouter();
  const { user, updateEmail, isUpdateEmailLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Initialize email from auth store
  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  const handleBack = () => {
    router.back();
  };

  const handleSave = async () => {
    if (!email || !user) return;

    // Clear previous messages
    setError('');
    setSuccess('');

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      const response = await updateEmail({ email: email });

      console.log('Update email response:', response);

      setSuccess('Email updated successfully!');

      // Redirect back after 2 seconds
      setTimeout(() => {
        router.back();
      }, 2000);
    } catch (err) {
      console.error('Update email error:', err);
      if (err instanceof Error) {
        setError(err.message || 'Failed to update email');
      } else {
        setError('Failed to update email. Please try again.');
      }
    }
  };

  // Check if button should be disabled
  const isDisabled = !email || email === user?.email || isUpdateEmailLoading;

  return (
    <div className="border-r border-border min-h-screen">
      <Breadcrumb title="Change email" onBack={handleBack} showArrow={true} />
      <div className="px-4 py-6">
        <div className="mb-4">
          <p className="text-sm text-text-secondary mb-4">
            Update your email address. You&apos;ll use this email to sign in to
            your account.
          </p>
        </div>

        <InputField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError('');
            setSuccess('');
          }}
          maxLength={100}
          showCharCount
          error={error && !success ? error : undefined}
          placeholder="your.email@example.com"
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
            loading={isUpdateEmailLoading}
            onClick={handleSave}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
