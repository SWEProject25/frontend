// Form-specific types
export type FormInputChangeEvent = React.ChangeEvent<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
>;

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'select';
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  minLength?: number;
  showCharCount?: boolean;
  showPasswordToggle?: boolean;
  disabled?: boolean;
  options?: { value: string; label: string }[];
  validation?: {
    enableRealTimeValidation?: boolean;
    remoteCheck?: boolean;
    apiEndpoint?: string;
    messages?: {
      invalidFormat?: string;
      alreadyTaken?: string;
    };
  };
  group?: {
    id: string;
    title: string;
    description?: string;
    layout: 'horizontal' | 'vertical';
  };
}

export interface SocialProvider {
  id: string;
  name: string;
  icon: React.ReactNode;
}

export interface FooterLink {
  text: string;
  linkText: string;
  href: string;
}

export interface SubmitButton {
  text: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'social' | 'ghost';
}

import { AuthModalType } from './types/components';

export interface GenericAuthFormProps {
  title: string;
  subtitle?: string;
  fields: readonly FormField[];
  submitButton: SubmitButton;
  socialProviders?: readonly SocialProvider[];
  showDivider?: boolean;
  showForgotPassword?: boolean;
  footerLinks?: readonly FooterLink[];
  onSubmit: (data: Record<string, string>) => void;
  onSocialLogin?: (providerId: string) => void;
  onForgotPassword?: () => void;
  onClose?: () => void;
  onSwitchModal?: (newType: AuthModalType) => void;
  formState: {
    isLoading: boolean;
    success: boolean;
    errors: Record<string, string>;
  };
  onClearState?: (fieldName?: string) => void;
  className?: string;
  mode?: 'modal' | 'fullpage' | 'responsive';
  initialValues?: Record<string, string>;
}

export interface FormState {
  formData: Record<string, string>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
}

export interface FormHandlers {
  handleInputChange: (fieldName: string) => (e: FormInputChangeEvent) => void;
  handleBlur: (fieldName: string) => () => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleSocialAuth: (providerId: string) => void;
  onClearState?: (fieldName?: string) => void;
  onEmailValidationChange?: (isValid: boolean, isValidating: boolean) => void;
}

export interface FormContainerProps
  extends GenericAuthFormProps, FormState, FormHandlers {
  displayMode: 'modal' | 'fullpage';
  onClose?: () => void;
  className?: string;
}

export interface FormFieldsProps {
  fields: readonly FormField[];
  formData: Record<string, string>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  onInputChange: (fieldName: string) => (e: FormInputChangeEvent) => void;
  onBlur: (fieldName: string) => () => void;
  onClearState?: (fieldName?: string) => void;
  onEmailValidationChange?: (isValid: boolean, isValidating: boolean) => void;
  loading?: boolean;
}

export interface FormHeaderProps {
  title: string;
  subtitle?: string;
}

export interface FormFooterProps {
  footerLinks: readonly FooterLink[];
  onSwitchModal?: (newType: AuthModalType) => void;
}

export interface FormActionsProps {
  submitButton: SubmitButton;
  loading: boolean;
  showForgotPassword: boolean;
  onForgotPassword?: () => void;
  isFormValid: boolean;
}

export interface SocialLoginSectionProps {
  socialProviders: readonly SocialProvider[];
  showDivider: boolean;
  loading: boolean;
  onSocialLogin: (providerId: string) => void;
}

export interface FormContentProps
  extends GenericAuthFormProps, FormState, FormHandlers {
  onSwitchModal?: (newType: AuthModalType) => void;
  loading: boolean;
  isFormValid: boolean;
}

// Re-export types from organized files
export * from './types/components';
export * from './types/hooks';
