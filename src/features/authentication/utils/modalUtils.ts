import { BREAKPOINTS } from '../constants';

/**
 * Checks if the current screen size is mobile
 */
export const isMobileScreen = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < BREAKPOINTS.MOBILE;
};

/**
 * Gets the appropriate modal type based on screen size
 */
export const getModalType = (activeModal: string | null): string | null => {
  if (!activeModal) return null;
  // On mobile, we don't show modals, we show full-screen forms
  // But we still need to return the modal type for the logic to work
  return activeModal;
};

/**
 * Gets the appropriate full-screen form type based on screen size
 */
export const getFullScreenFormType = (
  activeModal: string | null,
  isMobile: boolean
): string | null => {
  if (!activeModal || !isMobile) return null;
  return activeModal;
};
