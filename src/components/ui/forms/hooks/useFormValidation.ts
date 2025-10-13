import { useCallback, useMemo } from 'react';
import { FormField } from '../types';

export function useFormValidation(fields: readonly FormField[]) {
  // Memoized field lookup for better performance
  const fieldMap = useMemo(() => {
    const map = new Map<string, FormField>();
    fields.forEach((field) => map.set(field.name, field));
    return map;
  }, [fields]);

  const validateField = useCallback(
    (fieldName: string, value: string): string | undefined => {
      const field = fieldMap.get(fieldName);
      if (!field) return undefined;

      // Required validation
      if (field.required && !value.trim()) {
        return `${field.label} is required`;
      }

      // Email validation
      if (field.type === 'email' && value && !/\S+@\S+\.\S+/.test(value)) {
        return 'Email is invalid';
      }

      // Password validation
      if (field.type === 'password' && value && value.length < 6) {
        return 'Password must be at least 6 characters';
      }

      // Custom validation
      if (field.validation && value) {
        return field.validation(value);
      }

      return undefined;
    },
    [fieldMap]
  );

  const validateForm = useCallback(
    (
      formData: Record<string, string>
    ): { isValid: boolean; errors: Record<string, string> } => {
      const newErrors: Record<string, string> = {};
      let isValid = true;

      fields.forEach((field) => {
        const error = validateField(field.name, formData[field.name] || '');
        if (error) {
          newErrors[field.name] = error;
          isValid = false;
        }
      });

      return { isValid, errors: newErrors };
    },
    [fields, validateField]
  );

  return {
    validateField,
    validateForm,
  };
}
