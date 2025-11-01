/**
 * Name Validation Utilities
 * For validating display names (full names), not usernames
 */

// ============================================================================
// REGEX PATTERNS
// ============================================================================

/**
 * Name validation regex for display names
 * - Must be between 3 and 50 characters
 * - Cannot start or end with spaces
 * - Can contain letters, spaces, and common name characters
 */
export const NAME_REGEX = /^[^\s].{1,48}[^\s]$/;

/**
 * ASCII-only regex for name validation (U+0020 to U+007E)
 * Prevents emojis and Unicode symbols in names
 */
export const ASCII_ONLY_REGEX = /^[\u0020-\u007E]+$/;

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validates display name (full name)
 *
 * @param value - Name to validate
 * @returns Error message if invalid, undefined if valid
 *
 * @example
 * validateName('John Doe') // undefined (valid)
 * validateName('  John') // "Name must be between 3 and 50 characters..."
 * validateName('AB') // "Name must be between 3 and 50 characters..."
 * validateName('John 😀') // "Name must contain only ASCII characters..."
 */
export function validateName(value: string): string | undefined {
  if (!value) return undefined;

  // Check for ASCII characters only (no emojis or Unicode)
  if (!ASCII_ONLY_REGEX.test(value)) {
    return 'Name must contain only ASCII characters (no emojis or special Unicode symbols).';
  }

  // Check length and format
  if (!NAME_REGEX.test(value)) {
    return "Name must be between 3 and 50 characters and can't start or end with spaces.";
  }

  return undefined;
}

/**
 * Checks if a name format is valid
 *
 * @param value - Name to check
 * @returns true if format is valid, false otherwise
 */
export function isValidNameFormat(value: string): boolean {
  if (!value) return false;
  return NAME_REGEX.test(value);
}

// ============================================================================
// ERROR MESSAGES
// ============================================================================

export const NAME_ERROR_MESSAGES = {
  INVALID_FORMAT:
    "Name must be between 3 and 50 characters and can't start or end with spaces.",
  ASCII_ONLY:
    'Name must contain only ASCII characters (no emojis or special Unicode symbols).',
  REQUIRED: 'Name is required',
} as const;

// ============================================================================
// CONSTANTS
// ============================================================================

export const NAME_CONSTRAINTS = {
  MIN_LENGTH: 3,
  MAX_LENGTH: 50,
  DESCRIPTION: 'Display name for the user (e.g., "John Doe")',
} as const;

// ============================================================================
// EXPORTS
// ============================================================================

export const nameValidation = {
  // Regex pattern
  NAME_REGEX,

  // Validation functions
  validateName,
  isValidNameFormat,

  // Error messages
  ERROR_MESSAGES: NAME_ERROR_MESSAGES,

  // Constants
  CONSTRAINTS: NAME_CONSTRAINTS,
};

export default nameValidation;
