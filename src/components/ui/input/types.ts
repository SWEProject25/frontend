import { FieldStyleProps } from '@/types/formUtils';

// Input-specific component types
export interface InputLabelProps extends FieldStyleProps {
  label: string;
  onClick?: () => void;
}

export interface PasswordToggleProps {
  showPassword: boolean;
  onToggle: () => void;
  inputRef?: React.RefObject<HTMLInputElement>;
}

export interface CharCounterProps {
  currentLength: number;
  maxLength: number;
}

export interface InputBaseProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  inputRef?: React.Ref<HTMLInputElement>;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  styleProps: FieldStyleProps;
}
