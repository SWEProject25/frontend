// OTP Input Types
export interface OTPInputProps {
  length?: number;
  onComplete: (otp: string) => void;
  email?: string;
  error?: string;
  onClearError?: () => void;
}

// Captcha Component Types
export interface CaptchaInputProps {
  onVerify: (isVerified: boolean) => void;
}

// Email Input Field Types
export interface EmailInputFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  validation?: {
    enableRealTimeValidation?: boolean;
    apiEndpoint?: string;
    messages?: {
      invalidFormat?: string;
      alreadyTaken?: string;
    };
  };
  onValidationChange?: (isValid: boolean, isValidating: boolean) => void;
}
