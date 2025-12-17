/**
 * Password Validation Utilities
 * Centralized password validation logic for the authentication feature
 */

// ============================================================================
// REGEX PATTERNS
// ============================================================================

/**
 * Password regex: 8-50 characters
 * - At least one uppercase letter (A-Z)
 * - At least one lowercase letter (a-z)
 * - At least one number (0-9)
 * - At least one special character (@$!%*?&)
 * - No spaces, emojis, or non-ASCII characters allowed
 */
export const PASSWORD_REGEX =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,50}$/;

// ============================================================================
// TYPES
// ============================================================================

export type PasswordValidationResult = {
  valid: boolean;
  errors: string[];
};

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Returns a detailed breakdown of password validation rules and
 * a friendly errors array when rules are missing.
 *
 * @param value - Password to validate
 * @returns Object with valid flag and array of error messages
 *
 * @example
 * validatePasswordDetailed('Test123!') // { valid: true, errors: [] }
 * validatePasswordDetailed('test') // { valid: false, errors: ['At least 8 characters.', ...] }
 */
export function validatePasswordDetailed(
  value: string
): PasswordValidationResult {
  const errors: string[] = [];

  if (!value || value.length < 8) {
    errors.push('At least 8 characters.');
  }

  if (value && value.length > 50) {
    errors.push('Maximum 50 characters.');
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

  // Check for spaces
  if (/\s/.test(value)) {
    errors.push('No spaces allowed.');
  }

  // Ensure characters are within the allowed set (letters, digits, allowed specials)
  // This will catch emojis and non-ASCII characters
  if (value && !PASSWORD_REGEX.test(value)) {
    // If it fails the overall regex but none of the above caught it, show a
    // generic allowed-characters message.
    if (errors.length === 0) {
      errors.push(
        'Password contains unsupported characters (no emojis or non-ASCII characters).'
      );
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Backwards-compatible convenience function used by form components.
 * Returns undefined when valid, otherwise a friendly joined message.
 *
 * @param value - Password to validate
 * @returns Error message if invalid, undefined if valid
 *
 * @example
 * validatePassword('Test123!') // undefined (valid)
 * validatePassword('test') // 'At least 8 characters. At least one uppercase...'
 */
export function validatePassword(value: string): string | undefined {
  if (!value) return undefined;
  const res = validatePasswordDetailed(value);
  if (res.valid) return undefined;
  // Join errors into a readable sentence. Keep it short but actionable.
  return res.errors.join(' ');
}

/**
 * Validates that password and confirm password match
 *
 * @param password - Password value
 * @param confirmPassword - Confirm password value
 * @returns Error message if they don't match, undefined if they match
 *
 * @example
 * validatePasswordMatch('Test123!', 'Test123!') // undefined (match)
 * validatePasswordMatch('Test123!', 'Different') // 'Passwords do not match.'
 */
export function validatePasswordMatch(
  password: string,
  confirmPassword: string
): string | undefined {
  if (!password || !confirmPassword) return undefined;

  if (password !== confirmPassword) {
    return 'Passwords do not match.';
  }

  return undefined;
}

// ============================================================================
// ERROR MESSAGES
// ============================================================================

export const PASSWORD_ERROR_MESSAGES = {
  MIN_LENGTH: 'At least 8 characters.',
  MAX_LENGTH: 'Maximum 50 characters.',
  UPPERCASE: 'At least one uppercase letter (A-Z).',
  LOWERCASE: 'At least one lowercase letter (a-z).',
  NUMBER: 'At least one number (0-9).',
  SPECIAL_CHAR: 'At least one special character (@ $ ! % * ? &).',
  NO_SPACES: 'No spaces allowed.',
  UNSUPPORTED_CHARS:
    'Password contains unsupported characters (no emojis or non-ASCII characters).',
  NO_MATCH: 'Passwords do not match.',
} as const;

// ============================================================================
// CONSTANTS
// ============================================================================

export const PASSWORD_CONSTRAINTS = {
  MIN_LENGTH: 8,
  MAX_LENGTH: 50,
  ALLOWED_SPECIAL_CHARS: '@$!%*?&',
} as const;

// ============================================================================
// EXPORTS
// ============================================================================

export const passwordValidation = {
  // Regex pattern
  PASSWORD_REGEX,

  // Validation functions
  validatePasswordDetailed,
  validatePassword,
  validatePasswordMatch,

  // Error messages
  ERROR_MESSAGES: PASSWORD_ERROR_MESSAGES,

  // Constants
  CONSTRAINTS: PASSWORD_CONSTRAINTS,
};

export default passwordValidation;
