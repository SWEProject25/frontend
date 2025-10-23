/**
 * OTP Input Style Utilities
 * Helper functions for generating OTP input styles
 */

/**
 * Generate className for OTP input field based on state
 */
export const getOTPInputClassName = (
  baseSize: string,
  hasError: boolean,
  hasValue: boolean
): string => {
  const baseClasses =
    'text-center text-2xl font-bold border-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200';

  const stateClasses = hasError
    ? 'border-error bg-error/10 text-error focus:ring-error focus:border-error'
    : hasValue
      ? 'border-primary bg-primary/10 text-primary focus:ring-primary'
      : 'border-border bg-background text-foreground focus:ring-primary';

  return `${baseSize} ${baseClasses} ${stateClasses}`;
};
