'use client';

import React from 'react';
import { FormContainer, authFormConfigs } from '@/components/ui/forms';
import { AuthButton } from '@/components/ui/AuthButton';
import { CheckIcon } from '@/components/ui/icons';

type Props = {
  initialValues: Record<string, string>;
  isLoading: boolean;
  success: boolean;
  message?: string;
  errors: Record<string, string>;
  onSubmit: (data: Record<string, string>) => Promise<void>;
  onGoHome: () => void;
  onGoProfile?: () => void;
};

export function ResetPasswordForm({
  initialValues,
  isLoading,
  success,
  message,
  errors,
  onSubmit,
  onGoHome,
  onGoProfile,
}: Props) {
  return (
    <div>
      {success ? (
        <div className="mt-6 flex flex-col items-center text-center p-8 rounded-2xl bg-background border border-border">
          <div className="bg-success/10 rounded-full p-4 mb-4">
            <CheckIcon className="w-10 h-10 text-success" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Password reset successful
          </h2>
          <p className="text-text-inactive mb-6 max-w-xl">
            {message ||
              'Password has been reset successfully. You can now login with your new password.'}
          </p>

          <div className="flex gap-3">
            <AuthButton variant="primary" size="md" onClick={onGoHome}>
              Go to Home
            </AuthButton>
            {onGoProfile && (
              <AuthButton variant="secondary" size="md" onClick={onGoProfile}>
                Go to Profile
              </AuthButton>
            )}
          </div>
        </div>
      ) : (
        <FormContainer
          {...authFormConfigs.resetPassword}
          mode="fullpage"
          onSubmit={onSubmit}
          initialValues={initialValues}
          formState={{ isLoading, success, errors }}
        />
      )}
    </div>
  );
}

export default ResetPasswordForm;
