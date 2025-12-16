import { FieldStyleProps } from '@/types/formUtils';

// Input-specific component types
export interface InputLabelProps extends FieldStyleProps {
  label: string;
  onClick?: () => void;
}

export interface PasswordToggleProps {
  showPassword: boolean;
  onToggle: () => void;
  inputRef?: React.RefObject<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >;
}

export interface CharCounterProps {
  currentLength: number;
  maxLength: number;
}

export interface InputBaseProps
  extends React.HTMLAttributes<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  > {
  // loosened ref type to support both input and textarea refs
  inputRef?: React.Ref<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >;
  type?: string;
  // generic focus/blur handlers for input or textarea
  onFocus?: (
    e: React.FocusEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  onBlur?: (
    e: React.FocusEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  styleProps: FieldStyleProps;
  [key: string]: unknown;
}
