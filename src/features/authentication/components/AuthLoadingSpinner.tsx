'use client';

import React from 'react';

export interface LoadingSpinnerProps {
  /**
   * Optional title text to display above the spinner
   */
  title?: string;
  /**
   * Main loading message to display below the spinner
   */
  message: string;
  /**
   * Optional subtitle or additional context (e.g., email address)
   */
  subtitle?: string;
  /**
   * Optional custom className for the container
   */
  className?: string;
}

/**
 * Reusable loading spinner component with consistent styling
 * Used across authentication flows (OTP, reCAPTCHA, etc.)
 */
export function LoadingSpinner({
  title,
  message,
  subtitle,
  className = '',
}: LoadingSpinnerProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Title (optional) */}
      {title && (
        <div className="text-center">
          <p className="text-sm text-text-inactive">{title}</p>
        </div>
      )}

      {/* Subtitle (optional - e.g., email address) */}
      {subtitle && (
        <div className="text-center">
          <p className="font-medium text-foreground">{subtitle}</p>
        </div>
      )}

      {/* Loading Spinner */}
      <div className="flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>

      {/* Loading Message */}
      <div className="text-center">
        <p className="text-sm text-text-inactive">{message}</p>
      </div>
    </div>
  );
}
