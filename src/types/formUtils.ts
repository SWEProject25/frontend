// Form Utility Types
export interface FieldStyleProps {
  error?: string;
  isFocused?: boolean;
  hasValue?: boolean;
  shouldFloatLabel?: boolean;
  icon?: React.ReactNode;
  showPasswordToggle?: boolean;
  showCharCount?: boolean;
}

export interface UseFieldStateProps<T extends HTMLElement = HTMLElement> {
  value?: string;
  onFocus?: (e: React.FocusEvent<T>) => void;
  onBlur?: (e: React.FocusEvent<T>) => void;
}
