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
      await updateEmail({ email: email });
      setSuccess('Email updated successfully!');
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
  const isDisabled =
    !email ||
    email.toLowerCase() === user?.email?.toLowerCase() ||
    isUpdateEmailLoading;

  return (
    <div
      className="border-r border-border min-h-screen"
      data-testid="email-page"
    >
      <Breadcrumb
        title="Change email"
        onBack={handleBack}
        showArrow={true}
        data-testid="email-breadcrumb"
      />
      <div className="px-4 py-6" data-testid="email-content">
        <div className="mb-4" data-testid="email-description">
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
          data-testid="email-input"
        />

        {success && (
          <div
            className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg"
            data-testid="email-success-message"
          >
            <p className="text-sm text-green-500">{success}</p>
          </div>
        )}

        <div className="mt-6 flex justify-end" data-testid="email-actions">
          <Button
            variant="primary"
            size="md"
            disabled={isDisabled}
            loading={isUpdateEmailLoading}
            onClick={handleSave}
            data-testid="email-save-button"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
