'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import { useAuth } from '@/features/authentication/hooks/useAuth';
import { CheckIcon } from '@/components/ui/icons';

interface ForgotPasswordLinkProps {
  onCancel?: () => void;
  'data-testid'?: string;
}

export default function ForgotPasswordLink({
  onCancel,
  'data-testid': testId = 'forgot-password-link',
}: ForgotPasswordLinkProps) {
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);
  const [forgotPasswordError, setForgotPasswordError] = useState('');
  const { forgotPassword, isForgotPasswordLoading, user } = useAuth();

  const handleForgotPassword = async () => {
    if (!user?.email) {
      setForgotPasswordError('User email not found. Please log in again.');
      return;
    }

    try {
      const response = await forgotPassword({
        email: user.email,
        type: 'WEB',
      });

      if (response.status === 'success') {
        setForgotPasswordSuccess(true);
        setForgotPasswordError('');
      }
    } catch (err) {
      if (err instanceof Error) {
        setForgotPasswordError(
          err.message || 'Failed to send reset email. Please try again.'
        );
      } else {
        setForgotPasswordError('Failed to send reset email. Please try again.');
      }
    }
  };

  const handleClose = () => {
    setForgotPasswordSuccess(false);
    setForgotPasswordError('');
    if (onCancel) onCancel();
  };

  if (forgotPasswordSuccess) {
    return (
      <div
        className="flex flex-col items-center text-center p-8 rounded-2xl bg-background border border-border"
        data-testid={`${testId}-success`}
      >
        <div className="bg-success/10 rounded-full p-4 mb-4">
          <CheckIcon className="w-10 h-10 text-success" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Check your email
        </h2>
        <p className="text-text-inactive mb-6 max-w-xl">
          We&apos;ve sent a password reset link to{' '}
          <span className="text-text-active font-semibold">{user?.email}</span>.
          Please check your inbox and follow the instructions to reset your
          password.
        </p>
        <Button
          variant="primary"
          size="md"
          onClick={handleClose}
          data-testid={`${testId}-back-button`}
        >
          Back
        </Button>
      </div>
    );
  }

  return (
    <div data-testid={`${testId}-form`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-2">
          Reset your password
        </h3>
        <p className="text-sm text-text-inactive mb-6">
          We&apos;ll send a password reset link to{' '}
          <span className="text-text-active font-semibold">{user?.email}</span>
        </p>
      </div>

      {forgotPasswordError && (
        <div
          className="mb-4 p-3 rounded bg-error/10 border border-error text-error text-sm"
          data-testid={`${testId}-error`}
        >
          {forgotPasswordError}
        </div>
      )}

      <div className="flex gap-3 justify-end">
        <Button
          variant="secondary"
          size="md"
          onClick={handleClose}
          data-testid={`${testId}-cancel-button`}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          size="md"
          loading={isForgotPasswordLoading}
          onClick={handleForgotPassword}
          data-testid={`${testId}-send-button`}
        >
          Send Reset Link
        </Button>
      </div>
    </div>
  );
}
