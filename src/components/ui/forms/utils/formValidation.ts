import { FormField } from '../types';

/**
 * Validates if all required fields are filled and have no errors
 */
export const isFormValid = (
  fields: readonly FormField[],
  formData: Record<string, string>,
  errors: Record<string, string>
): boolean => {
  // Check if all required fields are filled
  const requiredFields = fields.filter(
    (field) => field.required && !field.disabled
  );

  for (const field of requiredFields) {
    const value = formData[field.name];

    // Check if field is empty
    if (!value || value.trim() === '') {
      return false;
    }

    // Check if field has an error
    if (errors[field.name]) {
      return false;
    }
  }

  return true;
};
