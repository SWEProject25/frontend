import { AllSteps } from '@/components/ui/forms/types/components';

/**
 * Maps step names to configuration keys for authFormConfigs
 */
export const getConfigKey = (
  step: AllSteps,
  type: 'login' | 'createAccount' | 'signup' | 'forgotPassword'
): keyof typeof import('@/features/authentication/configs/authFormConfigs').authFormConfigs => {
  if (step === 'email') return 'login';
  if (step === 'password' && type === 'login') return 'loginPassword';
  if (step === 'signup') return 'signup';
  if (step === 'forgotPassword') return 'forgotPassword';
  return step as keyof typeof import('@/features/authentication/configs/authFormConfigs').authFormConfigs;
};

/**
 * Gets initial values for pre-filling email in password/OTP steps
 */
export const getInitialValues = (
  type: 'login' | 'createAccount' | 'signup' | 'forgotPassword',
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
  return {};
};
