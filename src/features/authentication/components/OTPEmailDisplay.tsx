'use client';

import React from 'react';

export interface OTPEmailDisplayProps {
  email: string;
}

/**
 * Displays the email address where the OTP was sent
 */
export function OTPEmailDisplay({ email }: OTPEmailDisplayProps) {
  return (
    <div className="text-center">
      <p className="text-sm text-text-inactive">
        We sent a verification code to
      </p>
      <p className="font-medium text-foreground">{email}</p>
    </div>
  );
}
