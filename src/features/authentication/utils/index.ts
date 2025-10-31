// Re-export all authentication utility functions
export {
  isMobileScreen,
  getModalType,
  getFullScreenFormType,
} from './modalUtils';
export { generateCaptchaText, validateCaptcha } from './captchaUtils';
export {
  isValidOTPInput,
  isOTPComplete,
  getNextOTPIndex,
  getPreviousOTPIndex,
  processPastedOTP,
} from './otpUtils';
export { getOTPInputClassName } from './otpStyleUtils';
export {
  handleCreateAccount,
  handleFormClose,
  getSubmitHandler,
} from './authFormUtils';
export { getConfigKey, getInitialValues } from './multiStepUtils';

// Email validation utilities
export {
  isValidEmailFormat,
  validateEmailASCII,
  validateEmail,
  normalizeEmail,
  EMAIL_ERROR_MESSAGES,
  emailValidation,
} from './emailValidation';

// Password validation utilities
export {
  validatePasswordDetailed,
  validatePassword,
  validatePasswordMatch,
  PASSWORD_ERROR_MESSAGES,
  passwordValidation,
} from './passwordValidation';
export type { PasswordValidationResult } from './passwordValidation';

// Name validation utilities (for display names)
export {
  validateName,
  isValidNameFormat,
  NAME_ERROR_MESSAGES,
  nameValidation,
} from './nameValidation';
