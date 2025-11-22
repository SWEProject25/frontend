'use client';

import React, { useState } from 'react';
import XModal from '@/components/ui/hoc/XModal';
import { DatePicker, DatePickerValue } from '@/components/ui/DatePicker';
import { AuthButton } from '@/components/ui/AuthButton';
import { useUpdateDateOfBirth } from '../hooks/useOnboarding';
import { datePickerValueToISOString } from '@/utils';

interface DateOfBirthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export default function DateOfBirthModal({
  isOpen,
  onClose,
  onComplete,
}: DateOfBirthModalProps) {
  const [dateOfBirth, setDateOfBirth] = useState<DatePickerValue | undefined>(
    undefined
  );
  const updateDateOfBirth = useUpdateDateOfBirth();

  const handleSubmit = async () => {
    if (!dateOfBirth) return;

    const isoDate = datePickerValueToISOString(dateOfBirth);
    if (!isoDate) return;

    try {
      await updateDateOfBirth.mutateAsync({
        dateOfBirth: isoDate,
      });
      onComplete();
    } catch (error) {
      console.error('Failed to update date of birth:', error);
    }
  };

  const isValid = dateOfBirth !== undefined;

  return (
    <XModal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      closeOnOverlayClick={false}
      closeOnEscape={false}
      showLogo
      customLayout
      title=""
    >
      <div className="px-8 pt-5 pb-12">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-[31px] font-bold text-foreground mb-2 leading-9">
            What&apos;s your birth date?
          </h2>
          <p className="text-text-inactive text-[15px] leading-5">
            This won&apos;t be public.
          </p>
        </div>

        {/* Date Picker */}
        <div className="mb-8">
          <DatePicker value={dateOfBirth} onChange={setDateOfBirth} fullWidth />
        </div>

        {/* Submit Button */}
        <div className="mb-4">
          <AuthButton
            type="button"
            variant="primary"
            size="lg"
            loading={updateDateOfBirth.isPending}
            disabled={!isValid || updateDateOfBirth.isPending}
            className="w-full"
            onClick={handleSubmit}
          >
            Next
          </AuthButton>
        </div>

        {/* Error message */}
        {updateDateOfBirth.isError && (
          <div className="mb-4">
            <p className="text-error text-sm text-center">
              {updateDateOfBirth.error?.message ||
                'Failed to update date of birth'}
            </p>
          </div>
        )}
      </div>
    </XModal>
  );
}
