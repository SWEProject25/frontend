'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { InputField } from '@/components/ui/input';
import Button from '@/components/ui/Button';
import { useAuth } from '@/features/authentication/hooks/useAuth';
import ForgotPasswordLink from '@/features/settings/components/ForgotPasswordLink';
import { CheckIcon } from '@/components/ui/icons';

export default function PasswordPage() {
  const router = useRouter();
  const { user, changePassword, isChangePasswordLoading } = useAuth();
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [errors, setErrors] = useState({
    current: '',
    new: '',
    confirm: '',
    general: '',
  });
  const [success, setSuccess] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handlePasswordChange =
    (field: keyof typeof passwords) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      setPasswords((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: '',
        }));
      }
    };

  const handleSave = async () => {
    let hasErrors = false;
    const newErrors = { current: '', new: '', confirm: '', general: '' };

    if (!passwords.current) {
      newErrors.current = 'Current password is required';
      hasErrors = true;
    }

    if (!passwords.new) {
      newErrors.new = 'New password is required';
      hasErrors = true;
    } else if (passwords.new.length < 8) {
      newErrors.new = 'Password must be at least 8 characters';
      hasErrors = true;
    }

    if (!passwords.confirm) {
      newErrors.confirm = 'Please confirm your new password';
      hasErrors = true;
    } else if (passwords.new !== passwords.confirm) {
      newErrors.confirm = 'Passwords do not match';
      hasErrors = true;
    }

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    try {
      await changePassword({
        oldPassword: passwords.current,
        newPassword: passwords.new,
      });

      setSuccess(true);
      setPasswords({ current: '', new: '', confirm: '' });
      setErrors({ current: '', new: '', confirm: '', general: '' });
    } catch (err) {
      if (err instanceof Error) {
        setErrors((prev) => ({
          ...prev,
          general:
            err.message || 'Failed to change password. Please try again.',
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          general: 'Failed to change password. Please try again.',
        }));
      }
    }
  };

  const isDisabled = !passwords.current || !passwords.new || !passwords.confirm;

  if (showForgotPassword) {
    return (
      <div className="border-r border-border min-h-screen">
        <Breadcrumb
          title="Reset your password"
          subtitle={user?.username}
          onBack={() => setShowForgotPassword(false)}
          showArrow={true}
        />
        <div className="px-4 py-6">
          <ForgotPasswordLink
            onCancel={() => setShowForgotPassword(false)}
            data-testid="password-page-forgot-link"
          />
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="border-r border-border min-h-screen">
        <Breadcrumb
          title="Change your password"
          subtitle={user?.username}
          onBack={handleBack}
          showArrow={true}
        />
        <div className="px-4 py-6">
          <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-background border border-border">
            <div className="bg-success/10 rounded-full p-4 mb-4">
              <CheckIcon className="w-10 h-10 text-success" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Password changed successfully
            </h2>
            <p className="text-text-inactive mb-6 max-w-xl">
              Your password has been updated. You can now use your new password
              to log in.
            </p>
            <div className="flex gap-3">
              <Button
                variant="primary"
                size="md"
                onClick={() => router.push('/settings')}
              >
                Back to Settings
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={() => setSuccess(false)}
              >
                Change Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border-r border-border min-h-screen">
      <Breadcrumb
        title="Change your password"
        subtitle={user?.username}
        onBack={handleBack}
        showArrow={true}
      />
      <div className="px-4 py-6">
        {errors.general && (
          <div className="mb-4 p-3 rounded bg-error/10 border border-error text-error text-sm">
            {errors.general}
          </div>
        )}
        <div className="space-y-6">
          <div>
            <InputField
              label="Current password"
              type="password"
              value={passwords.current}
              onChange={handlePasswordChange('current')}
              error={errors.current}
              showPasswordToggle
            />
            <div className="mt-2">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-primary text-sm hover:underline cursor-pointer"
              >
                Forgot password?
              </button>
            </div>
          </div>

          <InputField
            label="New password"
            type="password"
            value={passwords.new}
            onChange={handlePasswordChange('new')}
            error={errors.new}
            showPasswordToggle
          />

          <InputField
            label="Confirm password"
            type="password"
            value={passwords.confirm}
            onChange={handlePasswordChange('confirm')}
            error={errors.confirm}
            showPasswordToggle
          />
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            variant="primary"
            size="md"
            disabled={isDisabled}
            loading={isChangePasswordLoading}
            onClick={handleSave}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
