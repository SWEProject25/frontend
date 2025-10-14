import { useState, useEffect } from 'react';
import { AUTH_MODAL_TYPES, BREAKPOINTS } from '../constants';

export type AuthModalType =
  (typeof AUTH_MODAL_TYPES)[keyof typeof AUTH_MODAL_TYPES];

export function useAuthModals() {
  const [activeModal, setActiveModal] = useState<AuthModalType | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < BREAKPOINTS.MOBILE);
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
    modalType: isMobile ? null : activeModal,
    showFullScreenForm: isMobile ? activeModal : null,
    isMobile,
    openModal,
    closeModal,
    closeFullScreenForm: closeModal,
    switchModal,
  };
}
