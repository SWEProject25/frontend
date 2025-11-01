/**
 * Email Validation Utilities
 * Centralized email validation logic for the authentication feature
 */

// ============================================================================
// REGEX PATTERNS
// ============================================================================

/**
 * Permissive email regex - allows uppercase and will be normalized before sending
 * Format: localpart@domain.tld
 */
export const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

/**
 * ASCII-only regex for email validation (U+0020 to U+007E)
 * Prevents emojis and Unicode symbols
 */
export const ASCII_ONLY_REGEX = /^[\u0020-\u007E]+$/;

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validates email format
 * Trims the email before validation since we normalize it anyway
 *
 * @param email - Email address to validate
 * @returns true if email format is valid, false otherwise
 *
 * @example
 * isValidEmailFormat('user@example.com') // true
 * isValidEmailFormat(' User@Example.COM ') // true (trimmed and case-insensitive)
 * isValidEmailFormat('invalid-email') // false
 */
export function isValidEmailFormat(email: string): boolean {
  if (!email) return false;
  return EMAIL_REGEX.test(email.trim());
}

/**
 * Validates that email contains only ASCII characters
 * Trims before checking since we normalize anyway
 *
 * @param email - Email address to validate
 * @returns Error message if invalid, undefined if valid
 *
 * @example
 * validateEmailASCII('user@example.com') // undefined (valid)
 * validateEmailASCII('user😀@example.com') // 'Email must contain only ASCII characters...'
 */
export function validateEmailASCII(email: string): string | undefined {
  if (!email) return undefined;

  const trimmedEmail = email.trim();
  if (!ASCII_ONLY_REGEX.test(trimmedEmail)) {
    return 'Email must contain only ASCII characters (no emojis or Unicode symbols)';
  }

  return undefined;
}

/**
 * Complete email validation (ASCII + format)
 *
 * @param email - Email address to validate
 * @returns Error message if invalid, undefined if valid
 *
 * @example
 * validateEmail('user@example.com') // undefined (valid)
 * validateEmail('user😀@example.com') // 'Email must contain only ASCII characters...'
 * validateEmail('invalid-email') // 'Please enter a valid email.'
 */
export function validateEmail(email: string): string | undefined {
  if (!email) return undefined;

  // Check ASCII first
  const asciiError = validateEmailASCII(email);
  if (asciiError) return asciiError;

  // Check format
  if (!isValidEmailFormat(email)) {
    return 'Please enter a valid email.';
  }

  return undefined;
}

// ============================================================================
// NORMALIZATION FUNCTIONS
// ============================================================================

/**
 * Normalizes email for backend submission
 * - Trims whitespace
 * - Converts to lowercase
 *
 * @param email - Email address to normalize
 * @returns Normalized email address
 *
 * @example
 * normalizeEmail(' User@Example.COM ') // 'user@example.com'
 * normalizeEmail('Test@Test.com') // 'test@test.com'
 */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

// ============================================================================
// ERROR MESSAGES
// ============================================================================

export const EMAIL_ERROR_MESSAGES = {
  INVALID_FORMAT: 'Please enter a valid email.',
  ALREADY_TAKEN: 'Email has already been taken.',
  ASCII_ONLY:
    'Email must contain only ASCII characters (no emojis or Unicode symbols)',
  REQUIRED: 'Email is required',
} as const;

// ============================================================================
// EXPORTS
// ============================================================================

export const emailValidation = {
  // Regex patterns
  EMAIL_REGEX,
  ASCII_ONLY_REGEX,

  // Validation functions
  isValidEmailFormat,
  validateEmailASCII,
  validateEmail,

  // Normalization
  normalizeEmail,

  // Error messages
  ERROR_MESSAGES: EMAIL_ERROR_MESSAGES,
};

export default emailValidation;
