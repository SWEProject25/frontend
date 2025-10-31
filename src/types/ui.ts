// Generic UI Component Types
export interface IconProps {
  className?: string;
}

// Allow standard button HTML attributes so consumers can pass data-testid, id, aria-*, etc.
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'social' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  className?: string;
  // children and icon are still explicit
  children: React.ReactNode;
  icon?: React.ReactNode;
}

// Allow standard input HTML attributes so consumers can pass data-testid, name, id, aria-*, etc.
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'textarea';
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  error?: string;
  maxLength?: number;
  showCharCount?: boolean;
  showPasswordToggle?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  disabled?: boolean;
  error?: string;
  fullWidth?: boolean;
  className?: string;
  wrapperClassName?: string;
}

export interface DividerProps {
  text?: string;
  className?: string;
  lineClassName?: string;
  textClassName?: string;
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'dashed' | 'dotted';
}
