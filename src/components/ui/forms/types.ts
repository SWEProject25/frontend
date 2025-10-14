// Form-specific types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'select';
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  showCharCount?: boolean;
  showPasswordToggle?: boolean;
  options?: { value: string; label: string }[];
  validation?: (value: string) => string | undefined;
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
  onSwitchModal?: (newType: 'login' | 'signup' | 'createAccount') => void;
  loading?: boolean;
  error?: string | null;
  success?: boolean;
  onClearState?: () => void;
  className?: string;
  mode?: 'modal' | 'fullpage' | 'responsive';
}

export interface FormState {
  formData: Record<string, string>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
}

export interface FormHandlers {
  handleInputChange: (
    fieldName: string
  ) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleBlur: (fieldName: string) => () => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleSocialLogin: (providerId: string) => void;
}

export interface FormContainerProps
  extends GenericAuthFormProps,
    FormState,
    FormHandlers {
  displayMode: 'modal' | 'fullpage';
  onClose?: () => void;
  className?: string;
}

export interface FormFieldsProps {
  fields: readonly FormField[];
  formData: Record<string, string>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  onInputChange: (
    fieldName: string
  ) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onBlur: (fieldName: string) => () => void;
}

export interface FormHeaderProps {
  title: string;
  subtitle?: string;
}

export interface FormFooterProps {
  footerLinks: readonly FooterLink[];
  onSwitchModal?: (newType: 'login' | 'signup' | 'createAccount') => void;
}

export interface FormActionsProps {
  submitButton: SubmitButton;
  loading: boolean;
  showForgotPassword: boolean;
  onForgotPassword?: () => void;
}

export interface SocialLoginSectionProps {
  socialProviders: readonly SocialProvider[];
  showDivider: boolean;
  loading: boolean;
  onSocialLogin: (providerId: string) => void;
}

export interface FormContentProps
  extends GenericAuthFormProps,
    FormState,
    FormHandlers {
  onSwitchModal?: (newType: 'login' | 'signup' | 'createAccount') => void;
}
