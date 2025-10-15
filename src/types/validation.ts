// Validation Types
export interface ValidationRule {
  type: 'email' | 'custom';
  message: string;
  validator?: (value: string) => boolean;
  apiEndpoint?: string;
}

export interface UseValidationOptions {
  rules: ValidationRule[];
  onValidationChange?: (isValid: boolean, error?: string) => void;
}

export interface ValidationState {
  isValidating: boolean;
  error: string | undefined;
  isValid: boolean;
}
