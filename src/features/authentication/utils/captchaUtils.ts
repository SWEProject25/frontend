import { CAPTCHA_CONSTANTS } from '@/components/ui/forms/constants';

/**
 * Generates a random captcha string
 */
export const generateCaptchaText = (): string => {
  const chars = CAPTCHA_CONSTANTS.CHARACTERS;
  let result = '';
  for (let i = 0; i < CAPTCHA_CONSTANTS.LENGTH; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Validates captcha input against generated text
 */
export const validateCaptcha = (
  input: string,
  captchaText: string
): boolean => {
  return input.toUpperCase() === captchaText.toUpperCase();
};
