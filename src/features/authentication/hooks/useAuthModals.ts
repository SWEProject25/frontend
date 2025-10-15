import { useState, useEffect } from 'react';
import { AUTH_MODAL_TYPES } from '../constants';
import { isMobileScreen, getModalType, getFullScreenFormType } from '../utils';

export type AuthModalType =
  (typeof AUTH_MODAL_TYPES)[keyof typeof AUTH_MODAL_TYPES];

export function useAuthModals() {
  const [activeModal, setActiveModal] = useState<AuthModalType | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(isMobileScreen());
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Simplified handlers
  const openModal = (type: AuthModalType) => {
    setActiveModal(type);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const switchModal = (newType: AuthModalType) => {
    setActiveModal(newType);
  };

  return {
    modalType: getModalType(activeModal),
    showFullScreenForm: getFullScreenFormType(activeModal, isMobile),
    isMobile,
    openModal,
    closeModal,
    closeFullScreenForm: closeModal,
    switchModal,
  };
}
