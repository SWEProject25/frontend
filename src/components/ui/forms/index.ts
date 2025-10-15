// Main component
export { GenericAuthForm } from './GenericAuthForm';

// Types
export type {
  GenericAuthFormProps,
  FormField,
  SocialProvider,
  FooterLink,
  SubmitButton,
  FormState,
  FormHandlers,
  FormContainerProps,
} from './types';

// Configurations
export { authFormConfigs } from './configs/authFormConfigs';

// Hooks
export { useGenericAuthForm } from './hooks/useGenericAuthForm';
export { useFormState } from './hooks/useFormState';
export { useFormValidation } from './hooks/useFormValidation';
export { useResponsiveMode } from './hooks/useResponsiveMode';

// Components (for advanced usage)
export { FormContainer } from './components/FormContainer';
export { FormContent } from './components/FormContent';
export { FormHeader } from './components/FormHeader';
export { SocialLoginSection } from './components/SocialLoginSection';
export { FormFields } from './components/FormFields';
export { FormActions } from './components/FormActions';
export { FormFooter } from './components/FormFooter';
