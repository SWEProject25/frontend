'use client';

import { useState } from 'react';
import { InputField } from '@/components/ui/input';
import Button from '@/components/ui/Button';
import { useAuth } from '@/features/authentication/hooks/useAuth';

interface PasswordConfirmProps {
  onConfirm: () => void;
  title?: string;
  description?: string;
}

export default function PasswordConfirm({
  onConfirm,
  title = 'Confirm your password',
  description = 'To access your account information, please confirm your password.',
}: PasswordConfirmProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { verifyPassword, isVerifyPasswordLoading, setPasswordVerified } =
    useAuth();

  const handleConfirmPassword = async () => {
    if (!password) {
      setError('Password is required');
      return;
    }

    try {
      const response = await verifyPassword({ password });
      console.log(response);
      if (response.status === 'success') {
        setError('');
        // Set password as verified in store (expires after 30 minutes)
        setPasswordVerified(true);
        onConfirm();
      } else {
        setError('Incorrect password. Please try again.');
      }
    } catch (err) {
      // Handle API errors
      if (err instanceof Error) {
        setError(err.message || 'An error occurred. Please try again.');
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };

  const handlePasswordChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setPassword(e.target.value);
    if (error) {
      setError('');
    }
  };

  return (
    <div className="px-4 py-6" data-testid="password-confirm">
      <div className="mb-4" data-testid="password-confirm-header">
        <h3
          className="text-lg font-semibold text-white mb-2"
          data-testid="password-confirm-title"
        >
          {title}
        </h3>
        <p
          className="text-sm text-text-inactive mb-6"
          data-testid="password-confirm-description"
        >
          {description}
        </p>
      </div>
      <InputField
        label="Password"
        type="password"
        value={password}
        onChange={handlePasswordChange}
        error={error}
        showPasswordToggle
        data-testid="password-confirm-input"
      />
      <div
        className="mt-6 flex justify-end"
        data-testid="password-confirm-actions"
      >
        <Button
          variant="primary"
          size="md"
          disabled={!password}
          loading={isVerifyPasswordLoading}
          onClick={handleConfirmPassword}
          data-testid="password-confirm-button"
        >
          Confirm
        </Button>
      </div>
    </div>
  );
}
