'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { InputField } from '@/components/ui/input';
import Button from '@/components/ui/Button';
import { userData } from '@/features/settings/constants/USER_DATA';

export default function PasswordPage() {
  const router = useRouter();
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [errors, setErrors] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [loading, setLoading] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handlePasswordChange =
    (field: 'current' | 'new' | 'confirm') =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPasswords((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: '',
        }));
      }
    };

  const handleSave = async () => {
    // Validate passwords
    let hasErrors = false;
    const newErrors = { current: '', new: '', confirm: '' };

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

    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLoading(false);
    // Here you would update the password in the backend
    // Reset form on success
    setPasswords({ current: '', new: '', confirm: '' });
  };

  // Check if button should be disabled
  const isDisabled = !passwords.current || !passwords.new || !passwords.confirm;

  return (
    <div className="border-r border-border min-h-screen">
      <Breadcrumb
        title="Change your password"
        subtitle={userData.username}
        onBack={handleBack}
        showArrow={true}
      />
      <div className="px-4 py-6">
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
            <a
              href="#"
              className="text-primary text-sm hover:underline inline-block mt-2"
              onClick={(e) => {
                e.preventDefault();
                // Handle forgot password
              }}
            >
              Forgot password?
            </a>
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
