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
