import {
  AllSteps,
  AuthModalType,
} from '@/components/ui/forms/types/components';

/**
 * Maps step names to configuration keys for authFormConfigs
 */
export const getConfigKey = (
  step: AllSteps,
  type: AuthModalType
): keyof typeof import('@/features/authentication/configs/authFormConfigs').authFormConfigs => {
  if (step === 'email') return 'login';
  if (step === 'signup') return 'signup';
  if (step === 'otp') return 'otp';
  if (step === 'password') {
    return type === 'login' ? 'loginPassword' : 'resetPassword';
  }
  if (step === 'forgotPassword') return 'forgotPassword';
  return step as keyof typeof import('@/features/authentication/configs/authFormConfigs').authFormConfigs;
};

/**
 * Gets initial values for pre-filling email in password/OTP steps
 */
export const getInitialValues = (
  type: AuthModalType,
  currentStep: AllSteps,
  stepData: Record<string, Record<string, string>>
): Record<string, string> => {
  if (
    type === 'login' &&
    currentStep === 'password' &&
    stepData.email?.identifier
  ) {
    return { email: stepData.email.identifier };
  }
  if (
    type === 'createAccount' &&
    currentStep === 'otp' &&
    stepData.register?.email
  ) {
    return { email: stepData.register.email };
  }
  if (
    type === 'forgotPassword' &&
    (currentStep === 'otp' || currentStep === 'password') &&
    stepData.forgotPassword?.email
  ) {
    return { email: stepData.forgotPassword.email };
  }
  return {};
};
