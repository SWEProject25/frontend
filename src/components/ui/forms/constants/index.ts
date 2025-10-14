// Form field constants
export const MONTHS = [
  { value: '', label: 'Month' },
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];

export const DAYS = [
  { value: '', label: 'Day' },
  ...Array.from({ length: 31 }, (_, i) => ({
    value: String(i + 1).padStart(2, '0'),
    label: String(i + 1),
  })),
];

export const YEARS = [
  { value: '', label: 'Year' },
  ...Array.from({ length: 100 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { value: String(year), label: String(year) };
  }),
];

// Form field types
export const FIELD_TYPES = {
  TEXT: 'text',
  EMAIL: 'email',
  PASSWORD: 'password',
  SELECT: 'select',
} as const;

// Button variants
export const BUTTON_VARIANTS = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  OUTLINE: 'outline',
  SOCIAL: 'social',
  GHOST: 'ghost',
} as const;

// Form modes
export const FORM_MODES = {
  MODAL: 'modal',
  FULLPAGE: 'fullpage',
  RESPONSIVE: 'responsive',
} as const;
