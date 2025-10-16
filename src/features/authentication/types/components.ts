// OTP Input Types
export interface OTPInputProps {
  length?: number;
  onComplete: (otp: string) => void;
  email?: string;
  error?: string;
  onClearError?: () => void;
}
