// Practical validators for auth forms (client-side, UX-focused)
export const emailRe = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,}$/;
// Use provided password regex for realtime validation
export const passwordRe =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;

export const nameRe = /^[^\s].{1,48}[^\s]$/;

// Shared helper for email format validation
export function isValidEmailFormat(email: string): boolean {
  return emailRe.test(email);
}

export type PasswordValidationResult = {
  valid: boolean;
  errors: string[];
};

/**
 * Returns a detailed breakdown of password validation rules (booleans) and
 * a friendly errors array when rules are missing.
 */
export function validatePasswordDetailed(
  value: string
): PasswordValidationResult {
  const errors: string[] = [];

  if (!value || value.length < 8) {
    errors.push('At least 8 characters.');
  }

  if (!/[A-Z]/.test(value)) {
    errors.push('At least one uppercase letter (A-Z).');
  }

  if (!/[a-z]/.test(value)) {
    errors.push('At least one lowercase letter (a-z).');
  }

  if (!/\d/.test(value)) {
    errors.push('At least one number (0-9).');
  }

  if (!/[@$!%*?&]/.test(value)) {
    errors.push('At least one special character (@ $ ! % * ? &).');
  }

  // Ensure characters are within the allowed set (letters, digits, allowed specials)
  if (value && !passwordRe.test(value)) {
    // If it fails the overall regex but none of the above caught it, show a
    // generic allowed-characters message.
    if (errors.length === 0) {
      errors.push('Password contains unsupported characters.');
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Backwards-compatible convenience function used by form components.
 * Returns undefined when valid, otherwise a friendly joined message.
 */
export function validatePassword(value: string): string | undefined {
  if (!value) return undefined;
  const res = validatePasswordDetailed(value);
  if (res.valid) return undefined;
  // Join errors into a readable sentence. Keep it short but actionable.
  return res.errors.join(' ');
}

export function validateName(value: string): string | undefined {
  if (!value) return undefined;
  if (!nameRe.test(value)) {
    return "Name must be between 3 and 50 characters and can't start or end with spaces.";
  }
  return undefined;
}

const validators = {
  emailRe,
  validatePassword,
  validateName,
  isValidEmailFormat,
};

export default validators;
