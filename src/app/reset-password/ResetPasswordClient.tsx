'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
// authApi is used inside the feature hook; no direct import needed here
import { ResetPasswordForm } from '@/features/authentication/components/ResetPasswordForm';
import { useAuthHandlers } from '@/features/authentication/hooks/useAuthHandlers';

export default function ResetPasswordClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams?.get('token') ?? '';
  const userId = Number(searchParams?.get('id'));
  const email = 'temp@temp.com';

  const { formState, handleResetPassword } = useAuthHandlers();

  const [missingParamsError, setMissingParamsError] = useState('');

  const initialValues = useMemo<Record<string, string>>(() => ({}), []);

  useEffect(() => {
    if (!token || Number.isNaN(userId)) {
      setMissingParamsError(
        'Invalid or missing reset link. Please check your email link.'
      );
    }
  }, [token, userId]);

  const handleSubmit = async (data: Record<string, string>) => {
    if (!token || Number.isNaN(userId)) return;

    // delegate to auth handler which will update formState inside the hook
    await handleResetPassword({
      userId,
      token,
      newPassword: data.password,
      email,
    });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg mx-auto">
        <div className="bg-background rounded-2xl w-full">
          <div className="px-4 sm:px-8 pb-8">
            <ResetPasswordForm
              initialValues={initialValues}
              isLoading={formState.isLoading}
              success={formState.success}
              message={formState.message}
              errors={formState.errors}
              onSubmit={handleSubmit}
              onGoHome={() => router.push('/')}
            />

            {/* Missing params error */}
            {missingParamsError && (
              <div className="mt-6 bg-red-700 text-foreground p-4 rounded">
                {missingParamsError}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
