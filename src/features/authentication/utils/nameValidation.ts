/**
 * Name Validation Utilities
 * For validating display names (full names), not usernames
 */

// ============================================================================
// REGEX PATTERNS
// ============================================================================

/**
 * Name validation regex for display names
 * Matches an entire string that contains only letters (from any language),
 * accent marks, spaces, hyphens, or apostrophes, and rejects anything else
 * — including emojis, numbers, or punctuation.
 *
 * Pattern breakdown:
 * - \p{L} = Unicode letter property (any language)
 * - \p{M} = Unicode mark property (accents, diacritics)
 * - ' - = space, apostrophe, hyphen
 */
export const NAME_REGEX = /^[\p{L}\p{M}' -]+$/u;

/**
 * Legacy: Name validation regex for length checking
 * - Must be between 3 and 50 characters
 * - Cannot start or end with spaces
 */
export const NAME_LENGTH_REGEX = /^[^\s].{1,48}[^\s]$/;

/**
 * ASCII-only regex for name validation (U+0020 to U+007E)
 * Prevents emojis and Unicode symbols in names
 * @deprecated Use NAME_REGEX instead for better Unicode support
 */
export const ASCII_ONLY_REGEX = /^[\u0020-\u007E]+$/;

/**
 * No numbers regex for name validation
 * Prevents digits 0-9 in names
 * @deprecated Validation is now handled by NAME_REGEX
 */
export const NO_NUMBERS_REGEX = /^[^0-9]*$/;

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validates display name (full name)
 * Implements validation rule: Matches an entire string that contains only
 * letters (from any language), accent marks, spaces, hyphens, or apostrophes,
 * and rejects anything else — including emojis, numbers, or punctuation.
 *
 * @param value - Name to validate
 * @returns Error message if invalid, undefined if valid
 *
 * @example
 * validateName('John Doe') // undefined (valid)
 * validateName('José García') // undefined (valid - supports accents)
 * validateName('Mary-Jane O\'Brien') // undefined (valid - hyphens and apostrophes)
 * validateName('Jean-François') // undefined (valid - accents and hyphens)
 * validateName('John123') // "Name should contain only letters..."
 * validateName('John 😀') // "Name should contain only letters..."
 * validateName('John!') // "Name should contain only letters..."
 * validateName('  John') // "Name must be between 3 and 50 characters..."
 */
export function validateName(value: string): string | undefined {
  if (!value) return undefined;

  // Check for leading/trailing spaces first (more specific error)
  if (value.startsWith(' ') || value.endsWith(' ')) {
    return "Name can't start or end with spaces.";
  }

  // Check length (must be between 3 and 50 characters)
  if (value.length < 3) {
    return 'Name must be at least 3 characters long.';
  }

  if (value.length > 50) {
    return 'Name must be 50 characters or less.';
  }

  // Apply the main validation regex: only letters, accent marks, spaces, hyphens, apostrophes
  if (!NAME_REGEX.test(value)) {
    // Check for specific common errors to provide better feedback
    if (/\d/.test(value)) {
      return 'Name cannot contain numbers.';
    }
    if (/[!@#$%^&*()_+=[\]{};:"|<>,./?\\]/.test(value)) {
      return 'Name cannot contain special characters (only letters, spaces, hyphens, and apostrophes are allowed).';
    }
    // Check for emojis using a simple regex
    if (
      /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u.test(
        value
      )
    ) {
      return 'Name cannot contain emojis.';
    }
    // Generic fallback for other invalid characters
    return 'Name can only contain letters, spaces, hyphens, and apostrophes.';
  }

  return undefined;
}

/**
 * Checks if a name format is valid
 * Validates against the Unicode-aware name pattern
 *
 * @param value - Name to check
 * @returns true if format is valid, false otherwise
 */
export function isValidNameFormat(value: string): boolean {
  if (!value) return false;
  if (value.length < 3 || value.length > 50) return false;
  if (value.startsWith(' ') || value.endsWith(' ')) return false;
  return NAME_REGEX.test(value);
}

// ============================================================================
// ERROR MESSAGES
// ============================================================================

export const NAME_ERROR_MESSAGES = {
  TOO_SHORT: 'Name must be at least 3 characters long.',
  TOO_LONG: 'Name must be 50 characters or less.',
  LEADING_TRAILING_SPACES: "Name can't start or end with spaces.",
  HAS_NUMBERS: 'Name cannot contain numbers.',
  HAS_SPECIAL_CHARS:
    'Name cannot contain special characters (only letters, spaces, hyphens, and apostrophes are allowed).',
  HAS_EMOJIS: 'Name cannot contain emojis.',
  INVALID_CHARACTERS:
    'Name can only contain letters, spaces, hyphens, and apostrophes.',
  // Legacy error messages for backward compatibility
  INVALID_FORMAT:
    "Name must be between 3 and 50 characters and can't start or end with spaces.",
  ASCII_ONLY:
    'Name must contain only ASCII characters (no emojis or special Unicode symbols).',
  NO_NUMBERS: 'Name cannot contain numbers.',
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
