import { useCallback } from 'react';
import { useFormState } from './useFormState';
import { useFormValidation } from './useFormValidation';
import { useResponsiveMode } from './useResponsiveMode';
import { GenericAuthFormProps } from '../types';

export function useGenericAuthForm(props: GenericAuthFormProps) {
  const { fields, onSubmit, onSocialLogin, mode = 'modal' } = props;

  // Form state management
  const { formData, setFormData, errors, setErrors, touched, setTouched } =
    useFormState(fields);

  // Form validation
  const { validateField, validateForm } = useFormValidation(fields);

  // Responsive mode handling
  const { displayMode, mounted } = useResponsiveMode(mode);

  // Event handlers
  const handleInputChange = useCallback(
    (fieldName: string) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const value = e.target.value;
        setFormData((prev) => ({ ...prev, [fieldName]: value }));

        // Clear error when user starts typing
        if (errors[fieldName]) {
          setErrors((prev) => ({ ...prev, [fieldName]: '' }));
        }
      },
    [errors, setFormData, setErrors]
  );

  const handleBlur = useCallback(
    (fieldName: string) => () => {
      setTouched((prev) => ({ ...prev, [fieldName]: true }));
      const error = validateField(fieldName, formData[fieldName]);
      setErrors((prev) => ({ ...prev, [fieldName]: error || '' }));
    },
    [validateField, formData, setTouched, setErrors]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const { isValid, errors: newErrors } = validateForm(formData);
      setErrors(newErrors);

      if (isValid) {
        onSubmit(formData);
      }
    },
    [validateForm, formData, onSubmit, setErrors]
  );

  const handleSocialLogin = useCallback(
    (providerId: string) => {
      onSocialLogin?.(providerId);
    },
    [onSocialLogin]
  );

  // Determine if this is a register form
  const isRegisterForm = props.title === 'Create your account';

  return {
    // State
    formData,
    errors,
    touched,
    displayMode,
    mounted,
    isRegisterForm,

    // Handlers
    handleInputChange,
    handleBlur,
    handleSubmit,
    handleSocialLogin,
  };
}
