// Global application constants
export const APP_CONFIG = {
  NAME: 'X',
  COMPANY: 'X Corp.',
  YEAR: 2025,
} as const;

// Global UI constants
export const UI_CONSTANTS = {
  ICON_SIZES: {
    SMALL: 'w-4 h-4',
    MEDIUM: 'w-5 h-5',
    LARGE: 'w-6 h-6',
    XLARGE: 'w-8 h-8',
  },
  SPACING: {
    XS: 'space-y-1',
    SM: 'space-y-2',
    MD: 'space-y-3',
    LG: 'space-y-4',
    XL: 'space-y-6',
    XXL: 'space-y-12',
  },
} as const;

// Global theme constants
export const THEME = {
  COLORS: {
    PRIMARY: 'text-primary',
    SECONDARY: 'text-secondary',
    FOREGROUND: 'text-foreground',
    BACKGROUND: 'bg-background',
    MUTED: 'text-text-inactive',
  },
} as const;
