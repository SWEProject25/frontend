import React from 'react';
import { AuthButton } from '@/components/ui/AuthButton';
import { FormActionsProps } from '../types';

export function FormActions({
  submitButton,
  loading,
  showForgotPassword,
  onForgotPassword,
  isFormValid,
}: FormActionsProps) {
  return (
    <>
      {/* Submit Button */}
      <AuthButton
        type="submit"
        variant="primary"
        size="lg"
        loading={loading}
        disabled={!isFormValid || loading}
        className="w-full"
      >
        {submitButton.text}
      </AuthButton>

      {/* Forgot Password Button */}
      {showForgotPassword && (
        <AuthButton
          type="button"
          variant="outline"
          size="lg"
          className="w-full"
          onClick={onForgotPassword}
        >
          Forgot password?
        </AuthButton>
      )}
    </>
  );
}
