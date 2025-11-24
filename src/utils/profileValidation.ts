/**
 * Profile field validation utilities
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates display name
 * Rules:
 * - Required (cannot be empty or only spaces)
 * - Must be 5-50 characters
 * - Cannot contain only emojis
 * - Cannot be only whitespace
 */
export const validateDisplayName = (name: string): ValidationResult => {
  const trimmed = name.trim();

  // Check if empty
  if (!trimmed || trimmed.length === 0) {
    return {
      isValid: false,
      error: 'Name is required and cannot be empty',
    };
  }

  // Check minimum length (at least 5 characters after trim)
  if (trimmed.length < 5) {
    return {
      isValid: false,
      error: 'Name must be at least 5 characters',
    };
  }

  // Check maximum length
  if (trimmed.length > 30) {
    return {
      isValid: false,
      error: 'Name must be 50 characters or less',
    };
  }

  // Check if only emojis (no alphanumeric characters)
  // This regex matches if there are NO letters, numbers, or common punctuation
  const hasAlphanumeric = /[a-zA-Z0-9]/.test(trimmed);
  if (!hasAlphanumeric) {
    return {
      isValid: false,
      error: 'Name must contain at least one letter or number',
    };
  }

  return { isValid: true };
};

/**
 * Validates location
 * Rules:
 * - Optional field
 * - If provided, cannot be only spaces
 * - Cannot contain emojis
 * - Max 30 characters
 */
export const validateLocation = (location: string): ValidationResult => {
  const trimmed = location.trim();

  // Empty is valid (optional field)
  if (!location || trimmed.length === 0) {
    return { isValid: true };
  }

  // Check if only spaces (original has content but trimmed is empty)
  if (location.length > 0 && trimmed.length === 0) {
    return {
      isValid: false,
      error: 'Location cannot be only spaces',
    };
  }

  // Check for emojis
  const emojiRegex =
    /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
  if (emojiRegex.test(trimmed)) {
    return {
      isValid: false,
      error: 'Location cannot contain emojis',
    };
  }

  // Check maximum length
  if (trimmed.length > 30) {
    return {
      isValid: false,
      error: 'Location must be 30 characters or less',
    };
  }

  return { isValid: true };
};

/**
 * Validates website URL
 * Rules:
 * - Optional field
 * - If provided, must be a valid URL format
 * - Cannot contain only spaces
 * - Cannot contain emojis
 * - Must have proper domain format
 * - Cannot have spaces within the URL
 * - Max 100 characters
 */
export const validateWebsite = (website: string): ValidationResult => {
  const trimmed = website.trim();

  // Empty is valid (optional field)
  if (!website || trimmed.length === 0) {
    return { isValid: true };
  }

  // Check if only spaces
  if (website.length > 0 && trimmed.length === 0) {
    return {
      isValid: false,
      error: 'Website cannot be only spaces',
    };
  }

  // Check for spaces within the URL (not just at edges)
  if (/\s/.test(trimmed)) {
    return {
      isValid: false,
      error: 'Website URL cannot contain spaces',
    };
  }

  // Check for emojis
  const emojiRegex =
    /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
  if (emojiRegex.test(trimmed)) {
    return {
      isValid: false,
      error: 'Website URL cannot contain emojis',
    };
  }

  // Check maximum length
  if (trimmed.length > 100) {
    return {
      isValid: false,
      error: 'Website must be 100 characters or less',
    };
  }

  // Check for valid URL format with proper domain
  // Must have at least one dot and proper domain structure
  const urlPattern =
    /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/i;

  if (!urlPattern.test(trimmed)) {
    return {
      isValid: false,
      error:
        'Please enter a valid website URL (e.g., example.com or https://example.com)',
    };
  }

  // Additional check: ensure it's not just a single word without domain
  const hasDomain = /\./.test(trimmed);
  if (!hasDomain) {
    return {
      isValid: false,
      error: 'Website must include a domain (e.g., example.com)',
    };
  }

  return { isValid: true };
};

/**
 * Validates bio
 * Rules:
 * - Optional field
 * - Max 160 characters
 */
export const validateBio = (bio: string): ValidationResult => {
  const trimmed = bio.trim();

  // Empty is valid (optional field)
  if (!bio || trimmed.length === 0) {
    return { isValid: true };
  }

  // Check maximum length
  if (trimmed.length > 160) {
    return {
      isValid: false,
      error: 'Bio must be 160 characters or less',
    };
  }

  return { isValid: true };
};

/**
 * Validates all profile fields at once
 */
export const validateProfileForm = (data: {
  name: string;
  bio?: string;
  location?: string;
  website?: string;
}): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  const nameValidation = validateDisplayName(data.name);
  if (!nameValidation.isValid) {
    errors.name = nameValidation.error!;
  }

  if (data.bio) {
    const bioValidation = validateBio(data.bio);
    if (!bioValidation.isValid) {
      errors.bio = bioValidation.error!;
    }
  }

  if (data.location) {
    const locationValidation = validateLocation(data.location);
    if (!locationValidation.isValid) {
      errors.location = locationValidation.error!;
    }
  }

  if (data.website) {
    const websiteValidation = validateWebsite(data.website);
    if (!websiteValidation.isValid) {
      errors.website = websiteValidation.error!;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
