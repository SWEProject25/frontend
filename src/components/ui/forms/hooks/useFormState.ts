import { useState, useMemo } from 'react';
import { FormField } from '../types';

export function useFormState(fields: readonly FormField[]) {
  // Initialize form data
  const initialFormData = useMemo(() => {
    const data: Record<string, string> = {};
    fields.forEach((field) => {
      data[field.name] = '';
    });
    return data;
  }, [fields]);

  const [formData, setFormData] =
    useState<Record<string, string>>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  return {
    formData,
    setFormData,
    errors,
    setErrors,
    touched,
    setTouched,
  };
}
